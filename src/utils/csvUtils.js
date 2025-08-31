// src/utils/csvUtils.js

export const convertToCsv = (data, headers) => {
    if (!data || data.length === 0) {
        return '';
    }

    const csvRows = [];
    const actualHeaders = headers || Object.keys(data[0]); // Use provided headers or infer from first object

    // Add header row
    csvRows.push(actualHeaders.map(header => `"${header}"`).join(','));

    // Add data rows
    for (const row of data) {
        const values = actualHeaders.map(header => {
            let value = row[header] || ''; // Get value, default to empty string
            if (typeof value === 'object' && value !== null && 'toDate' in value) {
                // Handle Firestore Timestamps
                value = value.toDate().toLocaleDateString('en-IN') + ' ' + value.toDate().toLocaleTimeString('en-IN');
            } else if (typeof value === 'boolean') {
                value = value ? 'Yes' : 'No';
            }
            // Escape double quotes by doubling them, then wrap in double quotes
            value = String(value).replace(/"/g, '""');
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

export const downloadCsv = (csvString, fileName) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    }
};