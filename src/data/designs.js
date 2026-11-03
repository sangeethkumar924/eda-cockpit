export const SAMPLE_DESIGNS = [
  {
    id: 'alu',
    name: 'Arithmetic Logic Unit (ALU)',
    shortName: 'ALU',
    category: 'Datapath / Arithmetic',
    description: '8-bit multi-function ALU supporting 8 arithmetic/logical operations with Zero, Carry, and Overflow status flags.',
    complexity: 'Moderate',
    linesOfCode: 52,
    moduleName: 'alu_8bit',
    clocked: false,
    ports: {
      inputs: [
        { name: 'a', width: '[7:0]', desc: 'Operand A' },
        { name: 'b', width: '[7:0]', desc: 'Operand B' },
        { name: 'opcode', width: '[2:0]', desc: 'Operation select' },
        { name: 'cin', width: '1-bit', desc: 'Carry input' }
      ],
      outputs: [
        { name: 'result', width: '[7:0]', desc: 'ALU calculation result' },
        { name: 'cout', width: '1-bit', desc: 'Carry out flag' },
        { name: 'zero', width: '1-bit', desc: 'Zero result flag' },
        { name: 'overflow', width: '1-bit', desc: 'Signed overflow flag' }
      ]
    },
    registers: 0,
    combinationalBlocks: 2,
    sequentialBlocks: 0,
    code: `// ========================================================
// Module: alu_8bit
// Description: 8-bit Arithmetic Logic Unit with status flags
// Target: Standard Cell Synthesis / FPGA
// ========================================================

module alu_8bit (
    input  wire [7:0] a,
    input  wire [7:0] b,
    input  wire [2:0] opcode,
    input  wire       cin,
    output reg  [7:0] result,
    output reg        cout,
    output wire       zero,
    output reg        overflow
);

    // Internal 9-bit arithmetic carrier
    reg [8:0] arith_res;

    // Zero detection flag
    assign zero = (result == 8'b0000_0000);

    always @(*) begin
        cout     = 1'b0;
        overflow = 1'b0;
        arith_res = 9'b0;

        case (opcode)
            3'b000: begin // ADD with carry
                arith_res = a + b + cin;
                result    = arith_res[7:0];
                cout      = arith_res[8];
                overflow  = (a[7] == b[7]) && (result[7] != a[7]);
            end

            3'b001: begin // SUB with borrow
                arith_res = a - b - cin;
                result    = arith_res[7:0];
                cout      = arith_res[8];
                overflow  = (a[7] != b[7]) && (result[7] != a[7]);
            end

            3'b010: result = a & b;       // Bitwise AND
            3'b011: result = a | b;       // Bitwise OR
            3'b100: result = a ^ b;       // Bitwise XOR
            3'b101: result = ~a;          // Bitwise NOT
            3'b110: result = a << 1;      // Logical shift left
            3'b111: result = a >> 1;      // Logical shift right
            default: result = 8'h00;
        endcase
    end

endmodule
`
  },
  {
    id: 'counter',
    name: 'Synchronous Up/Down Counter',
    shortName: 'Counter',
    category: 'Sequential Logic',
    description: '8-bit synchronous up/down counter with synchronous clear, parallel load, count enable, and terminal count indication.',
    complexity: 'Low',
    linesOfCode: 42,
    moduleName: 'sync_counter_8b',
    clocked: true,
    ports: {
      inputs: [
        { name: 'clk', width: '1-bit', desc: 'Positive-edge system clock' },
        { name: 'rst_n', width: '1-bit', desc: 'Active-low asynchronous reset' },
        { name: 'enable', width: '1-bit', desc: 'Counter clock enable' },
        { name: 'up_down', width: '1-bit', desc: '1: Count Up, 0: Count Down' },
        { name: 'load', width: '1-bit', desc: 'Synchronous parallel load enable' },
        { name: 'data_in', width: '[7:0]', desc: 'Parallel input vector' }
      ],
      outputs: [
        { name: 'count', width: '[7:0]', desc: 'Current 8-bit count output' },
        { name: 'tc', width: '1-bit', desc: 'Terminal count flag (overflow/underflow)' }
      ]
    },
    registers: 8,
    combinationalBlocks: 1,
    sequentialBlocks: 1,
    code: `// ========================================================
// Module: sync_counter_8b
// Description: Synchronous 8-bit Up/Down Counter with Load
// Target: Standard Cell Synthesis / FPGA
// ========================================================

module sync_counter_8b (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       enable,
    input  wire       up_down,
    input  wire       load,
    input  wire [7:0] data_in,
    output reg  [7:0] count,
    output wire       tc
);

    // Terminal count occurs at 255 (up) or 0 (down)
    assign tc = enable && ((up_down && (count == 8'hFF)) || (!up_down && (count == 8'h00)));

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            count <= 8'h00;
        end else if (load) begin
            count <= data_in;
        end else if (enable) begin
            if (up_down) begin
                count <= count + 8'd1;
            end else begin
                count <= count - 8'd1;
            end
        end
    end

endmodule
`
  },
  {
    id: 'uart',
    name: 'UART Transceiver Controller',
    shortName: 'UART',
    category: 'Communication Protocol',
    description: 'Universal Asynchronous Receiver/Transmitter core with programmable 8-bit frame, start/stop bit generation, and parity verification.',
    complexity: 'High',
    linesOfCode: 84,
    moduleName: 'uart_tx_rx_controller',
    clocked: true,
    ports: {
      inputs: [
        { name: 'clk', width: '1-bit', desc: 'System clock (50MHz default)' },
        { name: 'rst_n', width: '1-bit', desc: 'Active-low reset' },
        { name: 'tx_start', width: '1-bit', desc: 'Trigger byte transmission' },
        { name: 'tx_data', width: '[7:0]', desc: 'Transmit payload byte' },
        { name: 'rx_serial', width: '1-bit', desc: 'Serial RX incoming line' }
      ],
      outputs: [
        { name: 'tx_serial', width: '1-bit', desc: 'Serial TX outgoing line' },
        { name: 'tx_busy', width: '1-bit', desc: 'Transmitter busy status' },
        { name: 'rx_data', width: '[7:0]', desc: 'Received payload byte' },
        { name: 'rx_valid', width: '1-bit', desc: 'Received byte strobe' },
        { name: 'parity_err', width: '1-bit', desc: 'Parity check error flag' }
      ]
    },
    registers: 34,
    combinationalBlocks: 2,
    sequentialBlocks: 2,
    code: `// ========================================================
// Module: uart_tx_rx_controller
// Description: Full-duplex UART Frame Controller with 8-N-1 support
// Target: Standard Cell Synthesis / FPGA
// ========================================================

module uart_tx_rx_controller (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       tx_start,
    input  wire [7:0] tx_data,
    input  wire       rx_serial,
    output reg        tx_serial,
    output reg        tx_busy,
    output reg  [7:0] rx_data,
    output reg        rx_valid,
    output reg        parity_err
);

    // TX State Machine definition
    localparam TX_IDLE  = 2'b00;
    localparam TX_START = 2'b01;
    localparam TX_DATA  = 2'b10;
    localparam TX_STOP  = 2'b11;

    reg [1:0] tx_state;
    reg [2:0] tx_bit_idx;
    reg [7:0] tx_shifter;
    reg [3:0] tx_baud_cnt;

    // RX State Machine definition
    localparam RX_IDLE  = 2'b00;
    localparam RX_START = 2'b01;
    localparam RX_DATA  = 2'b10;
    localparam RX_STOP  = 2'b11;

    reg [1:0] rx_state;
    reg [2:0] rx_bit_idx;
    reg [7:0] rx_shifter;
    reg [3:0] rx_baud_cnt;

    // Transmitter logic
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            tx_state    <= TX_IDLE;
            tx_serial   <= 1'b1;
            tx_busy     <= 1'b0;
            tx_bit_idx  <= 3'd0;
            tx_shifter  <= 8'h00;
            tx_baud_cnt <= 4'd0;
        end else begin
            case (tx_state)
                TX_IDLE: begin
                    tx_serial <= 1'b1;
                    if (tx_start) begin
                        tx_shifter <= tx_data;
                        tx_state   <= TX_START;
                        tx_busy    <= 1'b1;
                    end else begin
                        tx_busy <= 1'b0;
                    end
                end

                TX_START: begin
                    tx_serial <= 1'b0; // Start bit
                    tx_state  <= TX_DATA;
                    tx_bit_idx <= 3'd0;
                end

                TX_DATA: begin
                    tx_serial <= tx_shifter[tx_bit_idx];
                    if (tx_bit_idx == 3'd7) begin
                        tx_state <= TX_STOP;
                    end else begin
                        tx_bit_idx <= tx_bit_idx + 3'd1;
                    end
                end

                TX_STOP: begin
                    tx_serial <= 1'b1; // Stop bit
                    tx_state  <= TX_IDLE;
                    tx_busy   <= 1'b0;
                end
            endcase
        end
    end

endmodule
`
  },
  {
    id: 'fifo',
    name: 'Synchronous FIFO Buffer',
    shortName: 'FIFO',
    category: 'Memory & Storage',
    description: 'Circular 8-depth by 8-bit synchronous FIFO with write/read pointers, empty/full flags, and almost-full programmable threshold.',
    complexity: 'Moderate',
    linesOfCode: 68,
    moduleName: 'sync_fifo_8x8',
    clocked: true,
    ports: {
      inputs: [
        { name: 'clk', width: '1-bit', desc: 'System clock' },
        { name: 'rst_n', width: '1-bit', desc: 'Active-low reset' },
        { name: 'wr_en', width: '1-bit', desc: 'Write request strobe' },
        { name: 'rd_en', width: '1-bit', desc: 'Read request strobe' },
        { name: 'din', width: '[7:0]', desc: 'Data input bus' }
      ],
      outputs: [
        { name: 'dout', width: '[7:0]', desc: 'Data output bus' },
        { name: 'empty', width: '1-bit', desc: 'FIFO empty condition flag' },
        { name: 'full', width: '1-bit', desc: 'FIFO full condition flag' },
        { name: 'almost_full', width: '1-bit', desc: 'Depth threshold reached (>6 entries)' },
        { name: 'count', width: '[3:0]', desc: 'Active item occupancy counter' }
      ]
    },
    registers: 76,
    combinationalBlocks: 2,
    sequentialBlocks: 2,
    code: `// ========================================================
// Module: sync_fifo_8x8
// Description: Synchronous FIFO with Watermark Indicators
// Depth: 8 entries | Width: 8 bits
// ========================================================

module sync_fifo_8x8 (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       wr_en,
    input  wire       rd_en,
    input  wire [7:0] din,
    output reg  [7:0] dout,
    output wire       empty,
    output wire       full,
    output wire       almost_full,
    output reg  [3:0] count
);

    // Memory array: 8 registers of 8 bits each
    reg [7:0] mem [0:7];
    reg [2:0] wr_ptr;
    reg [2:0] rd_ptr;

    assign empty = (count == 4'd0);
    assign full  = (count == 4'd8);
    assign almost_full = (count >= 4'd6);

    // FIFO Memory and Pointer updates
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            wr_ptr <= 3'd0;
            rd_ptr <= 3'd0;
            count  <= 4'd0;
            dout   <= 8'h00;
        end else begin
            // Write operation
            if (wr_en && !full) begin
                mem[wr_ptr] <= din;
                wr_ptr      <= wr_ptr + 3'd1;
            end

            // Read operation
            if (rd_en && !empty) begin
                dout   <= mem[rd_ptr];
                rd_ptr <= rd_ptr + 3'd1;
            end

            // Occupancy counter tracking
            case ({wr_en && !full, rd_en && !empty})
                2'b10: count <= count + 4'd1;
                2'b01: count <= count - 4'd1;
                default: count <= count;
            endcase
        end
    end

endmodule
`
  },
  {
    id: 'fsm',
    name: 'Protocol Arbiter FSM',
    shortName: 'FSM',
    category: 'Control Logic',
    description: 'Multi-state hardware protocol arbiter implementing priority-based request scheduling, timeout watchdog, and grant handshaking.',
    complexity: 'Moderate',
    linesOfCode: 58,
    moduleName: 'protocol_arbiter_fsm',
    clocked: true,
    ports: {
      inputs: [
        { name: 'clk', width: '1-bit', desc: 'System clock' },
        { name: 'rst_n', width: '1-bit', desc: 'Active-low reset' },
        { name: 'req_a', width: '1-bit', desc: 'Master A bus request' },
        { name: 'req_b', width: '1-bit', desc: 'Master B bus request' },
        { name: 'done', width: '1-bit', desc: 'Transaction complete pulse' }
      ],
      outputs: [
        { name: 'gnt_a', width: '1-bit', desc: 'Master A grant line' },
        { name: 'gnt_b', width: '1-bit', desc: 'Master B grant line' },
        { name: 'busy', width: '1-bit', desc: 'Bus arbitration busy' },
        { name: 'state_out', width: '[1:0]', desc: 'Encoded FSM state output' }
      ]
    },
    registers: 4,
    combinationalBlocks: 2,
    sequentialBlocks: 1,
    code: `// ========================================================
// Module: protocol_arbiter_fsm
// Description: Dual-Master Priority Arbiter State Machine
// Architecture: Synchronous Moore FSM
// ========================================================

module protocol_arbiter_fsm (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       req_a,
    input  wire       req_b,
    input  wire       done,
    output reg        gnt_a,
    output reg        gnt_b,
    output reg        busy,
    output wire [1:0] state_out
);

    localparam S_IDLE    = 2'b00;
    localparam S_GRANT_A = 2'b01;
    localparam S_GRANT_B = 2'b10;

    reg [1:0] current_state, next_state;

    assign state_out = current_state;

    // State transition sequential register
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            current_state <= S_IDLE;
        else
            current_state <= next_state;
    end

    // Next-state combinational logic
    always @(*) begin
        next_state = current_state;
        case (current_state)
            S_IDLE: begin
                if (req_a)
                    next_state = S_GRANT_A;
                else if (req_b)
                    next_state = S_GRANT_B;
            end

            S_GRANT_A: begin
                if (done) next_state = S_IDLE;
            end

            S_GRANT_B: begin
                if (done) next_state = S_IDLE;
            end

            default: next_state = S_IDLE;
        endcase
    end

    // Output decode logic
    always @(*) begin
        gnt_a = (current_state == S_GRANT_A);
        gnt_b = (current_state == S_GRANT_B);
        busy  = (current_state != S_IDLE);
    end

endmodule
`
  },
  {
    id: 'alu_faulty',
    name: 'ALU with Inferred Latch & Syntax Issues (Demo)',
    shortName: 'Faulty ALU',
    category: 'Diagnostic Demo',
    description: 'Deliberately flawed Verilog module containing an unassigned branch (inferred latch), missing sensitivity list signals, and unhandled default state.',
    complexity: 'Moderate (Flawed)',
    linesOfCode: 48,
    moduleName: 'alu_faulty_sample',
    clocked: false,
    faulty: true,
    issues: [
      {
        severity: 'Error',
        line: 38,
        code: 'ERR_INFERRED_LATCH',
        message: 'Inferred transparent latch detected on net "cout" due to missing assignment in opcodes 3\'b010 through 3\'b111.'
      },
      {
        severity: 'Warning',
        line: 27,
        code: 'WARN_INCOMPLETE_CASE',
        message: 'Case statement does not fully specify default assignments for all combinational control paths.'
      },
      {
        severity: 'Warning',
        line: 42,
        code: 'WARN_WIDTH_MISMATCH',
        message: 'Bit-width truncation: 9-bit arithmetic expression assigned to 8-bit register without sign extension.'
      }
    ],
    ports: {
      inputs: [
        { name: 'a', width: '[7:0]', desc: 'Operand A' },
        { name: 'b', width: '[7:0]', desc: 'Operand B' },
        { name: 'opcode', width: '[2:0]', desc: 'Operation select' }
      ],
      outputs: [
        { name: 'result', width: '[7:0]', desc: 'Calculation result' },
        { name: 'cout', width: '1-bit', desc: 'Carry flag (Latch Warning)' }
      ]
    },
    registers: 0,
    combinationalBlocks: 1,
    sequentialBlocks: 0,
    code: `// ========================================================
// Module: alu_faulty_sample
// ATTENTION: Intentional design flaws for Agent Diagnostic Demo
// Issues: Inferred latch, incomplete case branch, missing defaults
// ========================================================

module alu_faulty_sample (
    input  wire [7:0] a,
    input  wire [7:0] b,
    input  wire [2:0] opcode,
    output reg  [7:0] result,
    output reg        cout // WARNING: Inferred latch candidate
);

    // FLAGGED: cout is only driven in ADD branch, creating a hardware latch!
    always @(a or b or opcode) begin
        case (opcode)
            3'b000: begin // ADD
                {cout, result} = a + b;
            end

            3'b001: begin // SUB
                result = a - b;
                // BUG: cout is NOT assigned here! Inferred Latch!
            end

            3'b010: result = a & b; // AND - cout unassigned
            3'b011: result = a | b; // OR  - cout unassigned
            3'b100: result = a ^ b; // XOR - cout unassigned
            // FLAGGED: Missing default case statement
        endcase
    end

endmodule
`
  }
];
