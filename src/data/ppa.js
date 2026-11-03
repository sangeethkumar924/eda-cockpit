export const PPA_BENCHMARK_DATA = [
  {
    design: 'ALU',
    designId: 'alu',
    actualPower: 0.52,
    predictedPower: 0.49,
    actualLuts: 118,
    predictedLuts: 113,
    actualDelay: 2.45,
    predictedDelay: 2.38,
    powerError: 5.77,
    lutError: 4.24,
    delayError: 2.86
  },
  {
    design: 'Counter',
    designId: 'counter',
    actualPower: 0.34,
    predictedPower: 0.32,
    actualLuts: 84,
    predictedLuts: 80,
    actualDelay: 1.82,
    predictedDelay: 1.76,
    powerError: 5.88,
    lutError: 4.76,
    delayError: 3.30
  },
  {
    design: 'UART',
    designId: 'uart',
    actualPower: 0.61,
    predictedPower: 0.58,
    actualLuts: 152,
    predictedLuts: 146,
    actualDelay: 3.12,
    predictedDelay: 3.01,
    powerError: 4.92,
    lutError: 3.95,
    delayError: 3.53
  },
  {
    design: 'FIFO',
    designId: 'fifo',
    actualPower: 0.71,
    predictedPower: 0.68,
    actualLuts: 205,
    predictedLuts: 197,
    actualDelay: 3.48,
    predictedDelay: 3.39,
    powerError: 4.23,
    lutError: 3.90,
    delayError: 2.59
  },
  {
    design: 'FSM',
    designId: 'fsm',
    actualPower: 0.43,
    predictedPower: 0.41,
    actualLuts: 95,
    predictedLuts: 91,
    actualDelay: 2.05,
    predictedDelay: 1.98,
    powerError: 4.65,
    lutError: 4.21,
    delayError: 3.41
  }
];

export const TECH_NODES = [
  { id: '45nm', name: '45nm Standard CMOS (Generic TSMC)', vdd: '1.1V', powerFactor: 1.0, delayFactor: 1.0 },
  { id: '28nm', name: '28nm FD-SOI (Low Power)', vdd: '0.9V', powerFactor: 0.68, delayFactor: 0.78 },
  { id: '14nm', name: '14nm FinFET (High Performance)', vdd: '0.8V', powerFactor: 0.44, delayFactor: 0.55 },
  { id: '7nm', name: '7nm EUV FinFET (Advanced)', vdd: '0.7V', powerFactor: 0.28, delayFactor: 0.38 }
];

export const FREQUENCIES = [
  { value: '50', label: '50 MHz (Low-power IoT)' },
  { value: '100', label: '100 MHz (Standard Control)' },
  { value: '250', label: '250 MHz (Mid-range ASIC)' },
  { value: '500', label: '500 MHz (High Performance DSP)' },
  { value: '1000', label: '1.0 GHz (Core Processor)' }
];

export const DATA_WIDTHS = [
  { value: '8', label: '8-bit Word' },
  { value: '16', label: '16-bit Half-Word' },
  { value: '32', label: '32-bit Single Precision' },
  { value: '64', label: '64-bit Extended Word' }
];
