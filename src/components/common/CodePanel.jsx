import React, { useState } from 'react';
import { Copy, Check, Download, Upload, FileCode, Edit3, Eye } from 'lucide-react';
import { downloadFile } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

export default function CodePanel({
  title = 'Source Code',
  code = '',
  language = 'verilog',
  filename = 'design.v',
  editable = false,
  onChange,
  onUpload,
  height = 'h-[500px]'
}) {
  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { addToast } = useApp();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast({
        title: 'Copied to Clipboard',
        message: `${filename} copied successfully.`,
        type: 'success'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast({
        title: 'Copy Failed',
        message: 'Could not access clipboard.',
        type: 'error'
      });
    }
  };

  const handleDownload = () => {
    const mime = language === 'python' ? 'text/x-python' : 'text/x-verilog';
    downloadFile(filename, code, mime);
    addToast({
      title: 'File Downloaded',
      message: `${filename} saved to your downloads.`,
      type: 'success'
    });
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        if (onUpload) {
          onUpload(content, file.name);
        } else if (onChange) {
          onChange(content);
        }
        addToast({
          title: 'RTL File Loaded',
          message: `Read ${file.name} (${file.size} bytes) into workspace.`,
          type: 'success'
        });
      }
    };
    reader.onerror = () => {
      addToast({
        title: 'File Read Error',
        message: 'Unable to parse selected file.',
        type: 'error'
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-2xl border border-eda-border bg-eda-surface shadow-xl flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-eda-darkest/90 border-b border-eda-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileCode className="w-4 h-4 text-eda-accent shrink-0" />
          <span className="text-xs font-semibold tracking-wide text-slate-200 truncate">{title}</span>
          <span className="text-[10px] font-mono uppercase bg-eda-muted/40 text-slate-400 px-2 py-0.5 rounded border border-eda-border">
            {language}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {lines.length} lines
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {editable && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                isEditMode
                  ? 'bg-eda-accent text-white border-eda-accent'
                  : 'bg-eda-card text-slate-300 border-eda-border hover:bg-eda-muted/50'
              }`}
              title={isEditMode ? 'View highlighted code' : 'Edit code text'}
            >
              {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">{isEditMode ? 'Preview' : 'Edit'}</span>
            </button>
          )}

          {onUpload && (
            <label className="p-1.5 rounded-lg border bg-eda-card text-slate-300 border-eda-border hover:bg-eda-muted/50 cursor-pointer flex items-center gap-1 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Upload</span>
              <input
                type="file"
                accept=".v,.sv,.txt,.py"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border bg-eda-card text-slate-300 border-eda-border hover:bg-eda-muted/50 flex items-center gap-1 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg border bg-eda-card text-slate-300 border-eda-border hover:bg-eda-muted/50 flex items-center gap-1 transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Code Content Area */}
      <div className={`relative ${height} overflow-auto font-mono text-xs bg-eda-navy-950 p-3 select-text`}>
        {editable && isEditMode ? (
          <textarea
            value={code}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full h-full bg-transparent text-slate-200 resize-none outline-none font-mono leading-relaxed"
            spellCheck="false"
            placeholder="// Paste or write Verilog code here..."
          />
        ) : (
          <div className="table w-full">
            {lines.map((line, idx) => (
              <div key={idx} className="table-row hover:bg-slate-800/40 group">
                <span className="table-cell select-none pr-4 text-right text-slate-600 group-hover:text-slate-400 w-10 text-[11px]">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre text-slate-200 leading-relaxed">
                  {highlightSyntax(line, language)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Light tokenizer for clean Verilog and Python styling
function highlightSyntax(line, lang) {
  if (!line) return ' ';

  // Comments
  if (lang === 'verilog' && line.trim().startsWith('//')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (lang === 'python' && (line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith("'''"))) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Tokens highlighting
  if (lang === 'verilog') {
    const parts = line.split(/(\b(?:module|endmodule|input|output|inout|wire|reg|assign|always|case|endcase|default|begin|end|if|else|localparam|parameter|posedge|negedge)\b|[0-9]+'[bB][01_]+|[0-9]+'[hH][0-9a-fA-F_]+|[0-9]+'[dD][0-9_]+)/g);
    return parts.map((part, i) => {
      if (/^(module|endmodule|input|output|inout|wire|reg|assign|always|case|endcase|default|begin|end|if|else|localparam|parameter|posedge|negedge)$/.test(part)) {
        return <span key={i} className="text-indigo-400 font-semibold">{part}</span>;
      }
      if (/^[0-9]+'[bBhHdD]/.test(part)) {
        return <span key={i} className="text-amber-300 font-semibold">{part}</span>;
      }
      return part;
    });
  }

  if (lang === 'python') {
    const parts = line.split(/(\b(?:async|await|def|class|import|from|return|for|in|range|assert|if|else|elif|pass|True|False|None)\b|@cocotb\.[a-zA-Z0-9_]+|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g);
    return parts.map((part, i) => {
      if (/^(async|await|def|class|import|from|return|for|in|range|assert|if|else|elif|pass)$/.test(part)) {
        return <span key={i} className="text-violet-400 font-semibold">{part}</span>;
      }
      if (/^@cocotb/.test(part)) {
        return <span key={i} className="text-cyan-400 font-bold">{part}</span>;
      }
      if (/^["']/.test(part)) {
        return <span key={i} className="text-emerald-300">{part}</span>;
      }
      return part;
    });
  }

  return line;
}
