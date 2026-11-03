import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import RTLAnalysis from './pages/RTLAnalysis';
import TestbenchGeneration from './pages/TestbenchGeneration';
import VerificationCoverage from './pages/VerificationCoverage';
import PPAPrediction from './pages/PPAPrediction';
import RTLOptimization from './pages/RTLOptimization';
import ResultsComparison from './pages/ResultsComparison';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="rtl-analysis" element={<RTLAnalysis />} />
            <Route path="testbench" element={<TestbenchGeneration />} />
            <Route path="verification" element={<VerificationCoverage />} />
            <Route path="ppa" element={<PPAPrediction />} />
            <Route path="optimization" element={<RTLOptimization />} />
            <Route path="comparison" element={<ResultsComparison />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
