// CSV export with Excel/Sheets compatibility (UTF-8 BOM, CRLF, quoted fields)
export function toCSV(rows: Record<string, any>[], columns: string[]): string {
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map(esc).join(",");
  const body = rows.map(r => columns.map(c => esc(r[c])).join(",")).join("\r\n");
  return "\uFEFF" + header + "\r\n" + body;
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
