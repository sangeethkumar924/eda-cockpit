export const VERIFICATION_DATA = {
  alu: {
    designId: 'alu',
    designName: 'ALU',
    initialCoverage: 72,
    finalCoverage: 96,
    initialMetrics: {
      statement: 74.5,
      branch: 68.2,
      functional: 73.3
    },
    finalMetrics: {
      statement: 98.2,
      branch: 95.0,
      functional: 96.0
    },
    initialTests: [
      { id: 'TC_ALU_01', name: 'Basic Addition (3 + 5)', opcode: 'ADD', inputs: 'a=0x03, b=0x05, cin=0', expected: 'res=0x08, cout=0', status: 'PASS', time: '1.2ms' },
      { id: 'TC_ALU_02', name: 'Bitwise AND Masking', opcode: 'AND', inputs: 'a=0x0F, b=0xF0, cin=0', expected: 'res=0x00, zero=1', status: 'PASS', time: '0.8ms' },
      { id: 'TC_ALU_03', name: 'Bitwise OR Combine', opcode: 'OR', inputs: 'a=0xAA, b=0x55, cin=0', expected: 'res=0xFF, zero=0', status: 'PASS', time: '0.9ms' },
      { id: 'TC_ALU_04', name: 'Logical Shift Left', opcode: 'SLL', inputs: 'a=0x01, b=0x00, cin=0', expected: 'res=0x02, cout=0', status: 'PASS', time: '1.1ms' },
      { id: 'TC_ALU_05', name: 'Subtraction Positive (10 - 4)', opcode: 'SUB', inputs: 'a=0x0A, b=0x04, cin=0', expected: 'res=0x06, cout=0', status: 'PASS', time: '1.0ms' },
      { id: 'TC_ALU_06', name: 'Default Illegal Opcode', opcode: 'DEF', inputs: 'a=0xFF, b=0xFF, opcode=7', expected: 'res=0x7F, zero=0', status: 'PASS', time: '0.7ms' }
    ],
    feedbackTests: [
      { id: 'TC_ALU_07_AI', name: 'Maximum Signed Addition Overflow', opcode: 'ADD', inputs: 'a=0x7F, b=0x01, cin=0', expected: 'res=0x80, overflow=1, cout=0', status: 'PASS', time: '1.4ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_ALU_08_AI', name: 'Carry-In Propagation with Full Word', opcode: 'ADD', inputs: 'a=0xFF, b=0x00, cin=1', expected: 'res=0x00, cout=1, zero=1', status: 'PASS', time: '1.3ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_ALU_09_AI', name: 'Signed Negative Underflow Subtraction', opcode: 'SUB', inputs: 'a=0x80, b=0x01, cin=0', expected: 'res=0x7F, overflow=1, cout=1', status: 'PASS', time: '1.5ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_ALU_10_AI', name: 'Bitwise XOR Complement Equality', opcode: 'XOR', inputs: 'a=0xA5, b=0xA5, cin=0', expected: 'res=0x00, zero=1', status: 'PASS', time: '1.0ms', generatedBy: 'Coverage Agent' }
    ],
    uncoveredScenarios: [
      { code: 'COV_HOLE_01', type: 'Branch', desc: 'Signed arithmetic overflow flag assertion with boundary values (0x7F + 0x01 and 0x80 - 0x01).' },
      { code: 'COV_HOLE_02', type: 'Functional', desc: 'Simultaneous assertion of Carry-Out and Zero flag on 8-bit wrap-around (0xFF + 0x01).' },
      { code: 'COV_HOLE_03', type: 'Corner Case', desc: 'Negative operand signed subtraction underflow condition.' }
    ],
    initialLogs: [
      `[0.00ns] [INFO] Cocotb verification framework initialized. Simulator: Icarus Verilog v12.0`,
      `[0.00ns] [INFO] Running test module: test_alu_8bit.py with directed stimulus vector...`,
      `[10.00ns] [PASS] TC_ALU_01: Basic Addition test completed successfully. (res=0x08, cout=0)`,
      `[25.00ns] [PASS] TC_ALU_02: Bitwise AND Masking passed. Zero flag asserted.`,
      `[40.00ns] [PASS] TC_ALU_03: Bitwise OR passed with alternating bit pattern.`,
      `[55.00ns] [PASS] TC_ALU_04: Logical Shift Left operation verified.`,
      `[70.00ns] [PASS] TC_ALU_05: Subtraction Positive test verified.`,
      `[85.00ns] [PASS] TC_ALU_06: Default opcode boundary check verified.`,
      `[90.00ns] [WARN] Coverage Collector: Statement: 74.5% | Branch: 68.2% | Functional: 73.3%`,
      `[90.00ns] [WARN] Substantial coverage hole detected: Signed Overflow and Carry-Out corner cases uncovered.`,
      `[90.00ns] [STATUS] Initial Verification Completed: 6/6 tests passed. Overall coverage: 72.0%.`
    ],
    feedbackLogs: [
      `[95.00ns] [AGENT] AI Coverage-Driven Feedback Loop engaged...`,
      `[96.20ns] [AGENT] Analyzing AST and Uncovered Branch Scenarios: COV_HOLE_01, COV_HOLE_02, COV_HOLE_03`,
      `[98.00ns] [AGENT] Synthesized 4 targeted corner-case stimulus vectors for Cocotb execution.`,
      `[110.00ns] [PASS] TC_ALU_07_AI: Signed Overflow (0x7F + 0x01 -> 0x80) verified. overflow=1.`,
      `[125.00ns] [PASS] TC_ALU_08_AI: Full word carry-in (0xFF + 0x00 + 1 -> 0x00) verified. cout=1, zero=1.`,
      `[140.00ns] [PASS] TC_ALU_09_AI: Negative underflow boundary (0x80 - 0x01 -> 0x7F) verified.`,
      `[155.00ns] [PASS] TC_ALU_10_AI: Bitwise XOR identity and zero assertion verified.`,
      `[160.00ns] [INFO] Re-evaluating coverage metrics post-feedback execution...`,
      `[160.00ns] [SUCCESS] Target coverage achieved: Statement: 98.2% | Branch: 95.0% | Functional: 96.0%`,
      `[160.00ns] [STATUS] Final Verification Completed: 10/10 tests passed. Final Coverage: 96.0%.`
    ]
  },

  counter: {
    designId: 'counter',
    designName: 'Counter',
    initialCoverage: 75,
    finalCoverage: 97,
    initialMetrics: {
      statement: 78.0,
      branch: 72.0,
      functional: 75.0
    },
    finalMetrics: {
      statement: 98.5,
      branch: 96.0,
      functional: 97.0
    },
    initialTests: [
      { id: 'TC_CNT_01', name: 'Asynchronous Reset Active-Low', opcode: 'RESET', inputs: 'rst_n=0, clk=posedge', expected: 'count=0x00, tc=0', status: 'PASS', time: '1.0ms' },
      { id: 'TC_CNT_02', name: 'Count Up Increment Sequence', opcode: 'UP', inputs: 'rst_n=1, enable=1, up_down=1', expected: 'count increments by 1', status: 'PASS', time: '2.5ms' },
      { id: 'TC_CNT_03', name: 'Synchronous Parallel Load (0xA5)', opcode: 'LOAD', inputs: 'load=1, data_in=0xA5', expected: 'count=0xA5', status: 'PASS', time: '1.1ms' },
      { id: 'TC_CNT_04', name: 'Count Down Decrement Sequence', opcode: 'DOWN', inputs: 'enable=1, up_down=0', expected: 'count decrements by 1', status: 'PASS', time: '2.3ms' }
    ],
    feedbackTests: [
      { id: 'TC_CNT_05_AI', name: 'Terminal Count Up Boundary (0xFF -> 0x00)', opcode: 'UP_TC', inputs: 'count=0xFF, enable=1, up_down=1', expected: 'tc=1 pulse, roll-over to 0x00', status: 'PASS', time: '1.8ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_CNT_06_AI', name: 'Terminal Count Down Boundary (0x00 -> 0xFF)', opcode: 'DN_TC', inputs: 'count=0x00, enable=1, up_down=0', expected: 'tc=1 pulse, underflow to 0xFF', status: 'PASS', time: '1.9ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_CNT_07_AI', name: 'Clock Enable Deassertion Freeze', opcode: 'STALL', inputs: 'enable=0, clk=10 cycles', expected: 'count holds stable value', status: 'PASS', time: '1.2ms', generatedBy: 'Coverage Agent' }
    ],
    uncoveredScenarios: [
      { code: 'COV_HOLE_CNT1', type: 'Corner Case', desc: 'Roll-over wrap from 0xFF to 0x00 in up-counting mode.' },
      { code: 'COV_HOLE_CNT2', type: 'Corner Case', desc: 'Underflow roll-under from 0x00 to 0xFF in down-counting mode.' },
      { code: 'COV_HOLE_CNT3', type: 'Functional', desc: 'Priority resolution between parallel load and clock enable signals.' }
    ],
    initialLogs: [
      `[0.00ns] [INFO] Cocotb verification framework initialized. Simulator: Icarus Verilog v12.0`,
      `[0.00ns] [INFO] Running test module: test_sync_counter.py`,
      `[10.00ns] [PASS] TC_CNT_01: Asynchronous reset verified. Register cleared to 0x00.`,
      `[30.00ns] [PASS] TC_CNT_02: Standard count up verified over 16 clock cycles.`,
      `[45.00ns] [PASS] TC_CNT_03: Parallel load of 0xA5 registered on next clock edge.`,
      `[65.00ns] [PASS] TC_CNT_04: Down-counting mode verified.`,
      `[70.00ns] [WARN] Initial Coverage: 75.0% (Terminal count wrap-around branches uncovered).`
    ],
    feedbackLogs: [
      `[72.00ns] [AGENT] AI Coverage-Driven Feedback Loop engaged...`,
      `[75.00ns] [AGENT] Synthesized 3 targeted roll-over and enable stall test sequences.`,
      `[90.00ns] [PASS] TC_CNT_05_AI: Terminal count rollover at 0xFF asserted. TC flag high.`,
      `[105.00ns] [PASS] TC_CNT_06_AI: Terminal count underflow at 0x00 asserted. TC flag high.`,
      `[115.00ns] [PASS] TC_CNT_07_AI: Counter stall with enable=0 verified across 10 cycles.`,
      `[120.00ns] [SUCCESS] Target coverage achieved: 97.0%. Statement: 98.5% | Branch: 96.0%.`
    ]
  },

  uart: {
    designId: 'uart',
    designName: 'UART',
    initialCoverage: 68,
    finalCoverage: 94,
    initialMetrics: {
      statement: 71.0,
      branch: 65.0,
      functional: 68.0
    },
    finalMetrics: {
      statement: 96.0,
      branch: 92.5,
      functional: 94.0
    },
    initialTests: [
      { id: 'TC_UART_01', name: 'TX Idle State Line High', opcode: 'TX_IDLE', inputs: 'rst_n=1, tx_start=0', expected: 'tx_serial=1, tx_busy=0', status: 'PASS', time: '1.0ms' },
      { id: 'TC_UART_02', name: 'TX Single Byte Transmit (0x55)', opcode: 'TX_BYTE', inputs: 'tx_start=1, tx_data=0x55', expected: 'Frame: start(0)+data+stop(1)', status: 'PASS', time: '4.8ms' },
      { id: 'TC_UART_03', name: 'RX Byte Framing Valid (0x33)', opcode: 'RX_BYTE', inputs: 'rx_serial bitstream 0x33', expected: 'rx_data=0x33, rx_valid=1', status: 'PASS', time: '5.1ms' }
    ],
    feedbackTests: [
      { id: 'TC_UART_04_AI', name: 'Back-to-Back Consecutive Byte Stream', opcode: 'TX_BURST', inputs: 'tx_start back-to-back 3 bytes', expected: 'Continuous frame lock without jitter', status: 'PASS', time: '12.0ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_UART_05_AI', name: 'RX Glitch False Start Bit Rejection', opcode: 'RX_GLITCH', inputs: 'rx_serial low pulse < 0.5 baud', expected: 'Stay in RX_IDLE, rx_valid=0', status: 'PASS', time: '2.5ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_UART_06_AI', name: 'Parity Framing Error Detection', opcode: 'PARITY', inputs: 'Invalid stop bit (line held low)', expected: 'parity_err=1 asserted', status: 'PASS', time: '4.2ms', generatedBy: 'Coverage Agent' }
    ],
    uncoveredScenarios: [
      { code: 'COV_HOLE_UART1', type: 'Protocol', desc: 'Baud counter phase alignment under input line glitch.' },
      { code: 'COV_HOLE_UART2', type: 'Corner Case', desc: 'Missing stop bit framing error detection state transition.' },
      { code: 'COV_HOLE_UART3', type: 'Functional', desc: 'High baud-rate back-to-back continuous transmit queue.' }
    ],
    initialLogs: [
      `[0.00ns] [INFO] Cocotb verification framework initialized. Simulator: Icarus Verilog v12.0`,
      `[15.00ns] [PASS] TC_UART_01: Transmitter idle state validated.`,
      `[65.00ns] [PASS] TC_UART_02: Single byte 0x55 serialized with correct 8-N-1 framing.`,
      `[115.00ns] [PASS] TC_UART_03: Receiver deserialized incoming byte 0x33.`,
      `[120.00ns] [WARN] Initial Coverage: 68.0% (Frame error and noise rejection uncovered).`
    ],
    feedbackLogs: [
      `[122.00ns] [AGENT] AI Coverage-Driven Feedback Loop engaged...`,
      `[125.00ns] [AGENT] Generated glitch injection & framing error stimulus vectors.`,
      `[180.00ns] [PASS] TC_UART_04_AI: Back-to-back transmit burst verified.`,
      `[210.00ns] [PASS] TC_UART_05_AI: False start bit glitch filtered successfully.`,
      `[250.00ns] [PASS] TC_UART_06_AI: Missing stop bit detected. Error strobe fired.`,
      `[260.00ns] [SUCCESS] Target coverage achieved: 94.0%. Final Coverage: 94.0%.`
    ]
  },

  fifo: {
    designId: 'fifo',
    designName: 'FIFO',
    initialCoverage: 70,
    finalCoverage: 96,
    initialMetrics: {
      statement: 73.0,
      branch: 67.0,
      functional: 70.0
    },
    finalMetrics: {
      statement: 97.0,
      branch: 95.0,
      functional: 96.0
    },
    initialTests: [
      { id: 'TC_FIFO_01', name: 'FIFO Power-On Reset & Empty Flag', opcode: 'INIT', inputs: 'rst_n=0', expected: 'empty=1, full=0, count=0', status: 'PASS', time: '1.0ms' },
      { id: 'TC_FIFO_02', name: 'Single Write Single Read Sequence', opcode: 'WR_RD', inputs: 'wr_en=1 din=0x42, then rd_en=1', expected: 'dout=0x42, empty=1', status: 'PASS', time: '2.0ms' },
      { id: 'TC_FIFO_03', name: 'Sequential Fill 4 Entries', opcode: 'FILL_MID', inputs: 'wr_en=1 for 4 items', expected: 'count=4, empty=0, full=0', status: 'PASS', time: '3.5ms' }
    ],
    feedbackTests: [
      { id: 'TC_FIFO_04_AI', name: 'FIFO Full Boundary & Overflow Lock', opcode: 'FULL_BOUND', inputs: 'wr_en for 8 items + 1 overflow wr', expected: 'full=1, count=8, mem not corrupted', status: 'PASS', time: '6.5ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_FIFO_05_AI', name: 'FIFO Underflow Read Attempt on Empty', opcode: 'EMPTY_RD', inputs: 'rd_en=1 when empty=1', expected: 'empty=1, count=0, dout unchanged', status: 'PASS', time: '1.5ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_FIFO_06_AI', name: 'Simultaneous Concurrent Read & Write', opcode: 'SIMUL_WR_RD', inputs: 'wr_en=1 & rd_en=1 simultaneously', expected: 'count stable, valid data throughput', status: 'PASS', time: '4.8ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_FIFO_07_AI', name: 'Almost Full Watermark Threshold (count >= 6)', opcode: 'WATERMARK', inputs: 'fill to 6 items', expected: 'almost_full=1 asserted', status: 'PASS', time: '3.2ms', generatedBy: 'Coverage Agent' }
    ],
    uncoveredScenarios: [
      { code: 'COV_HOLE_FIFO1', type: 'Boundary', desc: 'Full capacity pointer wrap-around with write overflow protection.' },
      { code: 'COV_HOLE_FIFO2', type: 'Corner Case', desc: 'Simultaneous concurrent read and write with steady-state pointer update.' },
      { code: 'COV_HOLE_FIFO3', type: 'Functional', desc: 'Almost full watermark hysteresis transition.' }
    ],
    initialLogs: [
      `[0.00ns] [INFO] Cocotb verification framework initialized. Simulator: Icarus Verilog v12.0`,
      `[10.00ns] [PASS] TC_FIFO_01: Reset condition validated. Memory pointers initialized to 0.`,
      `[25.00ns] [PASS] TC_FIFO_02: Single write followed by read matched expected byte 0x42.`,
      `[50.00ns] [PASS] TC_FIFO_03: Partial buffer fill verified.`,
      `[60.00ns] [WARN] Initial Coverage: 70.0% (Full buffer lock and simultaneous R/W uncovered).`
    ],
    feedbackLogs: [
      `[62.00ns] [AGENT] AI Coverage-Driven Feedback Loop engaged...`,
      `[65.00ns] [AGENT] Generating concurrency and pointer wrap-around test vectors...`,
      `[110.00ns] [PASS] TC_FIFO_04_AI: FIFO Full boundary reached. Overflow write safely blocked.`,
      `[130.00ns] [PASS] TC_FIFO_05_AI: Underflow read attempt safely blocked on empty queue.`,
      `[165.00ns] [PASS] TC_FIFO_06_AI: Simultaneous read and write transaction passed without data race.`,
      `[190.00ns] [PASS] TC_FIFO_07_AI: Almost full watermark assertion flag validated at depth 6.`,
      `[200.00ns] [SUCCESS] Target coverage achieved: 96.0%. Statement: 97.0% | Branch: 95.0%.`
    ]
  },

  fsm: {
    designId: 'fsm',
    designName: 'FSM',
    initialCoverage: 73,
    finalCoverage: 95,
    initialMetrics: {
      statement: 75.0,
      branch: 70.0,
      functional: 74.0
    },
    finalMetrics: {
      statement: 96.0,
      branch: 94.0,
      functional: 95.0
    },
    initialTests: [
      { id: 'TC_FSM_01', name: 'Power-On Reset to S_IDLE', opcode: 'RESET', inputs: 'rst_n=0', expected: 'state_out=S_IDLE, busy=0', status: 'PASS', time: '1.0ms' },
      { id: 'TC_FSM_02', name: 'Master A Request Arbitration Grant', opcode: 'REQ_A', inputs: 'req_a=1, req_b=0', expected: 'state_out=S_GRANT_A, gnt_a=1, busy=1', status: 'PASS', time: '1.8ms' },
      { id: 'TC_FSM_03', name: 'Release Grant on Done Pulse', opcode: 'DONE_PULSE', inputs: 'done=1', expected: 'return to S_IDLE, gnt_a=0', status: 'PASS', time: '1.5ms' }
    ],
    feedbackTests: [
      { id: 'TC_FSM_04_AI', name: 'Master B Request Arbitration Grant', opcode: 'REQ_B', inputs: 'req_a=0, req_b=1', expected: 'state_out=S_GRANT_B, gnt_b=1, busy=1', status: 'PASS', time: '2.0ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_FSM_05_AI', name: 'Simultaneous Contention (Req A Priority Rule)', opcode: 'CONTENTION', inputs: 'req_a=1 & req_b=1 at same cycle', expected: 'gnt_a granted, gnt_b denied priority resolution', status: 'PASS', time: '2.4ms', generatedBy: 'Coverage Agent' },
      { id: 'TC_FSM_06_AI', name: 'Illegal State Recovery Watchdog', opcode: 'ILLEGAL_STATE', inputs: 'Forced SEU to unmapped state 2\'b11', expected: 'Automatic fallback to S_IDLE', status: 'PASS', time: '1.7ms', generatedBy: 'Coverage Agent' }
    ],
    uncoveredScenarios: [
      { code: 'COV_HOLE_FSM1', type: 'Branch', desc: 'Master B grant branch in isolation from S_IDLE.' },
      { code: 'COV_HOLE_FSM2', type: 'Corner Case', desc: 'Simultaneous arbitration request contention between Master A and B.' },
      { code: 'COV_HOLE_FSM3', type: 'State Machine', desc: 'Default state fallback transition handling.' }
    ],
    initialLogs: [
      `[0.00ns] [INFO] Cocotb verification framework initialized. Simulator: Icarus Verilog v12.0`,
      `[10.00ns] [PASS] TC_FSM_01: Reset entered S_IDLE state.`,
      `[25.00ns] [PASS] TC_FSM_02: Master A grant line asserted on req_a.`,
      `[40.00ns] [PASS] TC_FSM_03: Done pulse successfully cleared grant line.`,
      `[45.00ns] [WARN] Initial Coverage: 73.0% (Contention arbitration and Master B branch uncovered).`
    ],
    feedbackLogs: [
      `[47.00ns] [AGENT] AI Coverage-Driven Feedback Loop engaged...`,
      `[50.00ns] [AGENT] Synthesized simultaneous contention & unmapped state recovery tests.`,
      `[80.00ns] [PASS] TC_FSM_04_AI: Master B grant line asserted in clean cycle.`,
      `[105.00ns] [PASS] TC_FSM_05_AI: Master A won arbitration contention over Master B as designed.`,
      `[125.00ns] [PASS] TC_FSM_06_AI: Illegal state recovery back to S_IDLE validated.`,
      `[130.00ns] [SUCCESS] Target coverage achieved: 95.0%. Final Coverage: 95.0%.`
    ]
  }
};
