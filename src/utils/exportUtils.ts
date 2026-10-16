/**
 * Client-side Export Utility for Table Data
 * Generates pure table Excel (.csv) and printable PDF documents.
 */

export const exportTableToExcel = (
  headers: string[],
  rows: (string | number)[][],
  filename = 'export_data'
) => {
  // Build CSV content with proper escaping
  const csvRows: string[] = [];

  // Header row
  csvRows.push(
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',')
  );

  // Data rows
  rows.forEach((row) => {
    csvRows.push(
      row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    );
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\r\n'));
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', csvContent);
  downloadLink.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export const exportTableToPDF = (
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename = 'report_pdf'
) => {
  // Create an isolated printable window with clean tabular formatting
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF documents.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            padding: 24px;
            margin: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0c2c23;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            color: #0c2c23;
          }
          .date {
            font-size: 11px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #cbd5e1;
            padding: 8px 10px;
            text-align: left;
          }
          td {
            border: 1px solid #e2e8f0;
            padding: 7px 10px;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer {
            margin-top: 24px;
            text-align: right;
            font-size: 10px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 1.5cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${title} (${filename})</div>
          <div class="date">Generated: ${new Date().toLocaleString()}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell ?? '-'}</td>`).join('')}
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">
          OpenAid Community Platform • Confidential Internal Document
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
