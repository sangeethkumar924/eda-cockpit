import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_DESIGNS } from '../data/designs';
import { VERIFICATION_DATA } from '../data/verification';
import { PPA_BENCHMARK_DATA, TECH_NODES } from '../data/ppa';
import { OPTIMIZATION_COMPARISON_DATA, OPTIMIZATION_DETAILS } from '../data/optimization';
import { analyzeVerilog } from '../utils/rtlParser';
import { generateCocotbTestbench } from '../utils/testbenchGenerator';

const AppContext = createContext();

const LOCAL_STORAGE_KEY = 'vision_eda_state_v1';

const INITIAL_STATE = {
  selectedDesignId: 'alu',
  targetCoverage: 95,
  preferredFramework: 'cocotb',
  selectedTechNode: '45nm',
  targetFrequency: '100',
  dataWidth: '8',
  verificationRunStates: {
    alu: { executed: false, feedbackExecuted: false },
    counter: { executed: false, feedbackExecuted: false },
    uart: { executed: false, feedbackExecuted: false },
    fifo: { executed: false, feedbackExecuted: false },
    fsm: { executed: false, feedbackExecuted: false },
    alu_faulty: { executed: false, feedbackExecuted: false }
  },
  optimizationOptions: {
    clockGating: true,
    dataGating: true,
    redundantLogic: true,
    switchingReduction: false
  }
};

export function AppProvider({ children }) {
  // Load saved configuration or fall back to defaults
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return INITIAL_STATE;
  });

  // Current RTL Code in editor (can be modified or uploaded by user)
  const [currentRtlCode, setCurrentRtlCode] = useState(() => {
    const initDesign = SAMPLE_DESIGNS.find(d => d.id === state.selectedDesignId) || SAMPLE_DESIGNS[0];
    return initDesign.code;
  });

  // Client-side parsed analysis results
  const [analysisResult, setAnalysisResult] = useState(() => {
    const initDesign = SAMPLE_DESIGNS.find(d => d.id === state.selectedDesignId) || SAMPLE_DESIGNS[0];
    return analyzeVerilog(initDesign.code);
  });

  // Testbench generation configuration
  const [tbConfig, setTbConfig] = useState({
    framework: 'cocotb',
    testCount: 50,
    includeDirected: true,
    includeRandom: true,
    includeEdgeCases: true,
    includeCoverage: true
  });

  // Generated testbench text
  const [generatedTestbench, setGeneratedTestbench] = useState(() => {
    const initDesign = SAMPLE_DESIGNS.find(d => d.id === state.selectedDesignId) || SAMPLE_DESIGNS[0];
    return generateCocotbTestbench(initDesign, {
      framework: 'cocotb',
      testCount: 50,
      includeDirected: true,
      includeRandom: true,
      includeEdgeCases: true,
      includeCoverage: true
    });
  });

  // Toast notification queue
  const [toasts, setToasts] = useState([]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [state]);

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Get currently selected design object
  const activeDesign = SAMPLE_DESIGNS.find(d => d.id === state.selectedDesignId) || SAMPLE_DESIGNS[0];

  // Change active design and sync code/testbench
  const selectDesign = (designId) => {
    const design = SAMPLE_DESIGNS.find(d => d.id === designId) || SAMPLE_DESIGNS[0];
    setState(prev => ({ ...prev, selectedDesignId: design.id }));
    setCurrentRtlCode(design.code);
    const parsed = analyzeVerilog(design.code);
    setAnalysisResult(parsed);
    const tb = generateCocotbTestbench(design, tbConfig);
    setGeneratedTestbench(tb);

    addToast({
      title: 'Active Design Switched',
      message: `Loaded ${design.name} (${design.shortName}) into workspace.`,
      type: 'info'
    });
  };

  // Run RTL Analysis
  const runRtlAnalysis = (customCode = null) => {
    const codeToAnalyze = customCode !== null ? customCode : currentRtlCode;
    const parsed = analyzeVerilog(codeToAnalyze);
    setAnalysisResult(parsed);
    return parsed;
  };

  // Generate testbench with current config
  const regenerateTestbench = (newConfig = null) => {
    const cfg = newConfig || tbConfig;
    setTbConfig(cfg);
    const tb = generateCocotbTestbench(activeDesign, cfg);
    setGeneratedTestbench(tb);
    return tb;
  };

  // Mark verification executed
  const markVerificationRun = (designId, executed = true) => {
    setState(prev => ({
      ...prev,
      verificationRunStates: {
        ...prev.verificationRunStates,
        [designId]: {
          ...prev.verificationRunStates[designId],
          executed
        }
      }
    }));
  };

  // Mark coverage feedback loop executed
  const markFeedbackRun = (designId, feedbackExecuted = true) => {
    setState(prev => ({
      ...prev,
      verificationRunStates: {
        ...prev.verificationRunStates,
        [designId]: {
          ...prev.verificationRunStates[designId],
          feedbackExecuted
        }
      }
    }));
  };

  // Reset entire demo to fresh default state
  const resetDemo = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState(INITIAL_STATE);
    const defaultDesign = SAMPLE_DESIGNS[0];
    setCurrentRtlCode(defaultDesign.code);
    setAnalysisResult(analyzeVerilog(defaultDesign.code));
    setTbConfig({
      framework: 'cocotb',
      testCount: 50,
      includeDirected: true,
      includeRandom: true,
      includeEdgeCases: true,
      includeCoverage: true
    });
    setGeneratedTestbench(generateCocotbTestbench(defaultDesign, {
      framework: 'cocotb',
      testCount: 50,
      includeDirected: true,
      includeRandom: true,
      includeEdgeCases: true,
      includeCoverage: true
    }));

    addToast({
      title: 'Demo Restored to Initial State',
      message: 'All verification logs, uploaded code, and benchmark baselines have been reset.',
      type: 'success'
    });
  };

  // Get verification data for active design
  const activeVerificationData = VERIFICATION_DATA[state.selectedDesignId] || VERIFICATION_DATA['alu'];
  const isCurrentVerificationExecuted = !!state.verificationRunStates[state.selectedDesignId]?.executed;
  const isCurrentFeedbackExecuted = !!state.verificationRunStates[state.selectedDesignId]?.feedbackExecuted;

  // Get PPA benchmark data for active design
  const activePpaData = PPA_BENCHMARK_DATA.find(p => p.designId === state.selectedDesignId) || PPA_BENCHMARK_DATA[0];

  // Get Optimization comparison data for active design
  const activeOptComparison = OPTIMIZATION_COMPARISON_DATA.find(o => o.designId === state.selectedDesignId) || OPTIMIZATION_COMPARISON_DATA[0];
  const activeOptDetails = OPTIMIZATION_DETAILS[state.selectedDesignId] || OPTIMIZATION_DETAILS['alu'];

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        activeDesign,
        selectDesign,
        currentRtlCode,
        setCurrentRtlCode,
        analysisResult,
        runRtlAnalysis,
        tbConfig,
        setTbConfig,
        generatedTestbench,
        setGeneratedTestbench,
        regenerateTestbench,
        activeVerificationData,
        isCurrentVerificationExecuted,
        isCurrentFeedbackExecuted,
        markVerificationRun,
        markFeedbackRun,
        activePpaData,
        activeOptComparison,
        activeOptDetails,
        resetDemo,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
