import React from 'react';

export default function DataTable({
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = 'No records found.'
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-eda-border bg-eda-surface shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-eda-border bg-eda-darkest/70 text-slate-400 font-medium">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 ${col.className || ''}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-eda-border/50 text-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-eda-card hover:text-white'
                    : 'hover:bg-slate-800/20'
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`py-3 px-4 ${col.className || ''}`}>
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
