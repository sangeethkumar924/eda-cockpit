/**
 * Export and Download Utilities for VISION-EDA
 */

export function downloadFile(filename, content, mimeType = 'text/plain') {
  try {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('File download failed:', error);
    return false;
  }
}

export function exportCSV(filename, rows) {
  if (!rows || !rows.length) return false;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const val = row[header] !== undefined && row[header] !== null ? row[header] : '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\r\n');

  return downloadFile(filename, csvContent, 'text/csv');
}

export function exportJSON(filename, data) {
  const jsonString = JSON.stringify(data, null, 2);
  return downloadFile(filename, jsonString, 'application/json');
}

export function triggerPrintReport() {
  window.print();
}
