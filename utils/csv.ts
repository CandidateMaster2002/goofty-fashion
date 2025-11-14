// Simple CSV parser
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const entry: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      entry[headers[j]] = values[j];
    }
    data.push(entry);
  }
  return data;
}

// Simple CSV generator
export function generateCSV<T extends object>(data: T[], columns: (keyof T)[]): string {
  if (!data || data.length === 0) return '';
  
  const header = columns.join(',') + '\n';
  
  const rows = data.map(row => {
    return columns.map(colName => {
      const cell = row[colName];
      let cellValue = cell === null || cell === undefined ? '' : String(cell);
      // Handle commas in values by wrapping in quotes
      if (cellValue.includes(',')) {
        cellValue = `"${cellValue}"`;
      }
      return cellValue;
    }).join(',');
  }).join('\n');
  
  return header + rows;
}

export function downloadCSV(csvString: string, filename: string) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}