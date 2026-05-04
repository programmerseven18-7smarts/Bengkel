export const downloadCsv = <T extends object>(
  filename: string,
  columns: { key: keyof T; label: string }[],
  rows: T[]
) => {
  const escapeCell = (value: unknown) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    columns.map((column) => escapeCell(column.label)).join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCell(row[column.key])).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
