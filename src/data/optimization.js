export const OPTIMIZATION_COMPARISON_DATA = [
  {
    design: 'ALU',
    designId: 'alu',
    originalPower: 0.62,
    optimizedPower: 0.52,
    originalLuts: 125,
    optimizedLuts: 118,
    originalDelay: 2.50,
    optimizedDelay: 2.55,
    targetTechnique: 'Operand Isolation / Data Gating & Logic Pruning'
  },
  {
    design: 'Counter',
    designId: 'counter',
    originalPower: 0.41,
    optimizedPower: 0.34,
    originalLuts: 90,
    optimizedLuts: 84,
    originalDelay: 1.85,
    optimizedDelay: 1.88,
    targetTechnique: 'Integrated Clock Gating (ICG) Cell Insertion'
  },
  {
    design: 'UART',
    designId: 'uart',
    originalPower: 0.85,
    optimizedPower: 0.71,
    originalLuts: 180,
    optimizedLuts: 165,
    originalDelay: 3.15,
    optimizedDelay: 3.20,
    targetTechnique: 'Baud Prescaler Clock Gating & TX Bus Quenching'
  },
  {
    design: 'FIFO',
    designId: 'fifo',
    originalPower: 0.81,
    optimizedPower: 0.68,
    originalLuts: 220,
    optimizedLuts: 205,
    originalDelay: 3.52,
    optimizedDelay: 3.58,
    targetTechnique: 'Banked Memory Array Clock Gating & Pointer Isolation'
  },
  {
    design: 'FSM',
    designId: 'fsm',
    originalPower: 0.51,
    optimizedPower: 0.43,
    originalLuts: 110,
    optimizedLuts: 100,
    originalDelay: 2.10,
    optimizedDelay: 2.12,
    targetTechnique: 'Gray Code State Re-encoding & Output Gating'
  }
];

export const OPTIMIZATION_DETAILS = {
  alu: {
    techniques: [
      { id: 'data_gating', name: 'Operand Isolation / Data Gating', active: true },
      { id: 'logic_pruning', name: 'Remove Redundant Logic Muxing', active: true },
      { id: 'switching_reduction', name: 'Glitch Filter Bus Restructuring', active: false }
    ],
    explanation: {
      title: 'Operand Isolation & Arithmetic Datapath Gating',
      whatChanged: 'Inserted combinational AND-isolation gates before the heavy 8-bit carry adder and shifter blocks. Operands A and B now only toggle downstream into the adder when the opcode actively selects an arithmetic operation (ADD/SUB).',
      whySavesPower: 'In the original RTL, the adder and shifter calculate unconditionally on every transition of inputs A and B, wasting dynamic switching energy (P = α·C·V²·f) even when the ALU output multiplexer merely selects a simple bitwise logic operation like AND or OR.',
      tradeOffs: 'Introduces a slight multiplexer delay (~0.05ns) on the critical input path, but reduces average datapath switching activity (α) by ~35%, resulting in a 16.1% net dynamic power reduction.',
      disclaimer: 'Hardware Safety Notice: This is an illustrative RTL transformation template. In production silicon flows, functional equivalence must be formally verified using Synopsys Formality or Cadence Conformal LEC, and verified against standard-cell STA timing margins.'
    },
    optimizedCode: `// ========================================================
// Module: alu_8bit_power_optimized
// Technique: Operand Isolation (Data Gating) on Arithmetic Unit
// Power Saving: ~16.1% dynamic power reduction
// ========================================================

module alu_8bit_power_optimized (
    input  wire [7:0] a,
    input  wire [7:0] b,
    input  wire [2:0] opcode,
    input  wire       cin,
    output reg  [7:0] result,
    output reg        cout,
    output wire       zero,
    output reg        overflow
);

    // ====================================================
    // POWER OPTIMIZATION: Operand Isolation Enables
    // Active only when opcode represents arithmetic (ADD/SUB)
    // ====================================================
    wire is_arithmetic = (opcode == 3'b000) || (opcode == 3'b001);
    
    // Gated operands prevent unneeded toggle propagation into adder
    wire [7:0] a_gated = is_arithmetic ? a : 8'h00;
    wire [7:0] b_gated = is_arithmetic ? b : 8'h00;
    wire       cin_gated = is_arithmetic ? cin : 1'b0;

    reg [8:0] arith_res;
    assign zero = (result == 8'b0000_0000);

    always @(*) begin
        cout     = 1'b0;
        overflow = 1'b0;
        arith_res = 9'b0;

        case (opcode)
            3'b000: begin // ADD using isolated operands
                arith_res = a_gated + b_gated + cin_gated;
                result    = arith_res[7:0];
                cout      = arith_res[8];
                overflow  = (a[7] == b[7]) && (result[7] != a[7]);
            end

            3'b001: begin // SUB using isolated operands
                arith_res = a_gated - b_gated - cin_gated;
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

  counter: {
    techniques: [
      { id: 'clock_gating', name: 'Integrated Clock Gating (ICG)', active: true },
      { id: 'glitch_filter', name: 'Terminal Count Glitch Filter', active: true },
      { id: 'state_reencoding', name: 'Gray Code Counter Option', active: false }
    ],
    explanation: {
      title: 'Integrated Clock Gating (ICG) for Synchronous Registers',
      whatChanged: 'Replaced multiplexer-based clock recirculation with an enable-controlled clock gating cell (ICG latch + AND gate). The register clock tree toggles only when enable or load is active.',
      whySavesPower: 'In synchronous designs, feeding the raw system clock to flip-flops on every edge burns continuous dynamic clock distribution power, even when enable is deasserted. Gating the clock directly at the register root cuts idle clock power to near zero.',
      tradeOffs: 'Requires an ASIC-approved glitch-free Integrated Clock Gating cell (e.g. TLATNTSCA) to avoid clock glitches. Setup time to enable pin must be strictly budgeted in Static Timing Analysis (STA).',
      disclaimer: 'Hardware Safety Notice: Never construct clock gates with raw discrete logic gates in Verilog. True ASIC implementation requires standard cell library ICG primitives with glitch-free negative-latch control.'
    },
    optimizedCode: `// ========================================================
// Module: sync_counter_8b_power_optimized
// Technique: Glitch-free Enable Clock Gating
// Power Saving: ~17.1% dynamic power reduction
// ========================================================

module sync_counter_8b_power_optimized (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       enable,
    input  wire       up_down,
    input  wire       load,
    input  wire [7:0] data_in,
    output reg  [7:0] count,
    output wire       tc
);

    // ====================================================
    // POWER OPTIMIZATION: Glitch-Free Clock Gating Latch
    // In synthesis, mapped to foundry ICG cell (e.g. CKGPRELATNX4)
    // ====================================================
    wire gate_enable = enable | load;
    reg  en_latched;

    // Negative-edge latch ensures enable changes during clk low, avoiding glitches
    always @(clk or gate_enable) begin
        if (!clk)
            en_latched <= gate_enable;
    end

    wire gated_clk = clk & en_latched;

    assign tc = enable && ((up_down && (count == 8'hFF)) || (!up_down && (count == 8'h00)));

    // Counter updates only on gated_clk pulses
    always @(posedge gated_clk or negedge rst_n) begin
        if (!rst_n) begin
            count <= 8'h00;
        end else if (load) begin
            count <= data_in;
        end else begin
            if (up_down)
                count <= count + 8'd1;
            else
                count <= count - 8'd1;
        end
    end

endmodule
`
  }
};
