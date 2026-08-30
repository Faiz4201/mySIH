import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminPermissionModal from './AdminPermissionModal';
import DistrictRiskMap from './DistrictRiskMap';
import KpiSummaryCards from './KpiSummaryCards';
import DistressHeatmapTable from './DistressHeatmapTable';
import DistressInspector from './DistressInspector';
import AlertDispatchModal from './AlertDispatchModal';
import DemoSimulatorDrawer from './DemoSimulatorDrawer';
import { DISTRICTS, INITIAL_FARMERS, calculateDistressScore, loadFarmers } from '../../data/mockData';
import './AdminPanel.css';

export default function AdminPanel({ onBackToHome }) {
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS[0]);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(true);
  const [locationGranted, setLocationGranted] = useState(false);

  // Farmers state
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    const initData = loadFarmers();
    setFarmers(initData);
    if (!selectedFarmer) {
      setSelectedFarmer(initData.find(f => f.districtId === selectedDistrict.id) || initData[0]);
    }

    const handleStorageUpdate = () => {
      const updatedFarmers = loadFarmers();
      setFarmers(updatedFarmers);
      setSelectedFarmer(prev => {
        if (!prev) return updatedFarmers[0];
        return updatedFarmers.find(f => f.id === prev.id) || prev;
      });
    };

    window.addEventListener('farmersStorageUpdated', handleStorageUpdate);
    return () => window.removeEventListener('farmersStorageUpdated', handleStorageUpdate);
  }, []);

  // Modals state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Demo simulator parameters
  const [simParams, setSimParams] = useState({
    rainDeficit: 40,
    priceCrash: 35,
    loanDays: 4
  });

  // Filter farmers by district
  const districtFarmers = farmers.filter(f => f.districtId === selectedDistrict.id);
  const activeFarmersList = districtFarmers.length > 0 ? districtFarmers : farmers;

  // Handle permission granted from popup modal
  const handlePermissionGranted = (result) => {
    setLocationGranted(result.granted);
    setIsPermissionModalOpen(false);
  };

  // Handle live recalculation when demo simulator sliders change
  const handleParamChange = (key, value) => {
    const updatedParams = { ...simParams, [key]: value };
    setSimParams(updatedParams);

    // Recalculate scores for all farmers
    const recalculated = farmers.map(farmer => {
      const { totalScore, riskLevel } = calculateDistressScore(
        updatedParams.rainDeficit,
        updatedParams.priceCrash,
        updatedParams.loanDays
      );

      return {
        ...farmer,
        rainfallDeficit: updatedParams.rainDeficit,
        priceCrash: updatedParams.priceCrash,
        loanDueDays: updatedParams.loanDays,
        riskScore: totalScore,
        riskLevel: riskLevel,
        primaryTrigger: `Simulated: Rain Shortfall (-${updatedParams.rainDeficit}%) + Price Crash (-${updatedParams.priceCrash}%)`
      };
    });

    setFarmers(recalculated);

    // Update selected farmer reference
    if (selectedFarmer) {
      const found = recalculated.find(f => f.id === selectedFarmer.id);
      if (found) setSelectedFarmer(found);
    }
  };

  const handleResetSim = () => {
    setSimParams({ rainDeficit: 40, priceCrash: 35, loanDays: 4 });
    const local = loadFarmers();
    setFarmers(local);
    setSelectedFarmer(local[0]);
  };

  const handleUpdateFarmer = (farmerId, updates) => {
    const updated = farmers.map(f => f.id === farmerId ? { ...f, ...updates } : f);
    setFarmers(updated);
    if (selectedFarmer && selectedFarmer.id === farmerId) {
      setSelectedFarmer({ ...selectedFarmer, ...updates });
    }
  };

  return (
    <div className="admin-portal-container">
      {/* 1. Top Header */}
      <AdminHeader
        selectedDistrict={selectedDistrict}
        onDistrictChange={(dist) => {
          setSelectedDistrict(dist);
          const firstInDist = farmers.find(f => f.districtId === dist.id);
          if (firstInDist) setSelectedFarmer(firstInDist);
        }}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        isSimulatorOpen={isSimulatorOpen}
        onReopenPermissionModal={() => setIsPermissionModalOpen(true)}
        onBackToHome={onBackToHome}
      />

      {/* Main Admin Dashboard Body */}
      <main className="admin-dashboard-body">
        {/* 2. Top Interactive District Heatmap Map */}
        <DistrictRiskMap
          farmers={activeFarmersList}
          selectedDistrict={selectedDistrict}
          onSelectFarmer={(farmer) => setSelectedFarmer(farmer)}
          selectedFarmerId={selectedFarmer ? selectedFarmer.id : null}
        />

        {/* 3. KPI Executive Summary Bar */}
        <KpiSummaryCards farmers={activeFarmersList} />

        {/* 4. Full-Width Stacked Layout: Heatmap Table (Top) + Distress Inspector (Below) */}
        <div className="admin-stacked-layout">
          <DistressHeatmapTable
            farmers={activeFarmersList}
            onSelectFarmer={(farmer) => setSelectedFarmer(farmer)}
            selectedFarmerId={selectedFarmer ? selectedFarmer.id : null}
            onOpenDispatchModal={(farmer) => {
              setSelectedFarmer(farmer);
              setIsDispatchModalOpen(true);
            }}
          />

          <DistressInspector
            selectedFarmer={selectedFarmer}
            onOpenDispatchModal={(farmer) => {
              setSelectedFarmer(farmer);
              setIsDispatchModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* 5. Permission Modal */}
      <AdminPermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onPermissionGranted={handlePermissionGranted}
      />

      {/* 6. Officer Dispatch Modal */}
      <AlertDispatchModal
        farmer={selectedFarmer}
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onUpdateFarmer={handleUpdateFarmer}
      />

      {/* 7. Hackathon Demo Simulator Drawer */}
      <DemoSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        simParams={simParams}
        onParamChange={handleParamChange}
        onResetSim={handleResetSim}
      />
    </div>
  );
}
