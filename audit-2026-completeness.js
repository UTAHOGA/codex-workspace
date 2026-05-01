const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "processed_data", "hunt_database_complete.csv");
const GAPS_FILE = path.join(__dirname, "processed_data", "hunt_database_2026_gaps.csv");
const REPORT_FILE = path.join(__dirname, "processed_data", "hunt_database_2026_completeness_report.json");

const REQUIRED_FIELDS = [
  "hunt_code",
  "residency",
  "species",
  "unit",
  "season",
  "permit_count",
  "season_dates"
];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map(h => h.trim());

  return lines.map(line => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ? values[i].trim() : "";
    });
    return row;
  });
}

function toCsv(rows) {
  const headers = ["hunt_code", "residency", "missing_field"];
  return [
    headers.join(","),
    ...rows.map(row => headers.map(h => row[h] || "").join(","))
  ].join("\n");
}

if (!fs.existsSync(DATA_FILE)) {
  console.error(`Missing data file: ${DATA_FILE}`);
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(DATA_FILE, "utf8"));

const rows2026 = rows.filter(row =>
  String(row.year || row.hunt_year || "").trim() === "2026"
);

const gaps = [];

for (const row of rows2026) {
  for (const field of REQUIRED_FIELDS) {
    if (!row[field]) {
      gaps.push({
        hunt_code: row.hunt_code,
        residency: row.residency,
        missing_field: field
      });
    }
  }
}

const report = {
  audited_year: 2026,
  total_2026_rows: rows2026.length,
  total_missing_fields: gaps.length,
  required_fields: REQUIRED_FIELDS,
  generated_at: new Date().toISOString()
};

fs.writeFileSync(GAPS_FILE, toCsv(gaps));
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

console.log("2026 audit complete.");
console.log(`2026 rows checked: ${rows2026.length}`);
console.log(`Missing fields found: ${gaps.length}`);
console.log(`Gaps file: ${GAPS_FILE}`);
console.log(`Report file: ${REPORT_FILE}`);
