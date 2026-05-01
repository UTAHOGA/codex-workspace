const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "processed_data", "hunt_database_complete.csv");
const PATCH_FILE = path.join(
  __dirname,
  "processed_data",
  "supplements",
  "hunt_database_2026_patch.csv"
);

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

function toCsv(rows, headers) {
  const escape = value => {
    const str = value == null ? "" : String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  return [
    headers.join(","),
    ...rows.map(row => headers.map(h => escape(row[h])).join(","))
  ].join("\n");
}

if (!fs.existsSync(DATA_FILE)) {
  console.error(`Missing data file: ${DATA_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(PATCH_FILE)) {
  console.error(`Missing patch file: ${PATCH_FILE}`);
  console.error("Create it by copying processed_data/supplements/hunt_database_2026_patch.template.csv");
  process.exit(1);
}

const dataText = fs.readFileSync(DATA_FILE, "utf8");
const patchText = fs.readFileSync(PATCH_FILE, "utf8");

const dataRows = parseCsv(dataText);
const patchRows = parseCsv(patchText);

const headers = dataText.trim().split(/\r?\n/)[0].split(",").map(h => h.trim());

let updates = 0;
let skipped = 0;
let missingRows = 0;

for (const patch of patchRows) {
  const huntCode = patch.hunt_code;
  const residency = patch.residency;
  const field = patch.field;
  const value = patch.value;
  const forceOverwrite = String(patch.force_overwrite || "").toLowerCase() === "true";

  if (!huntCode || !residency || !field) {
    skipped++;
    continue;
  }

  if (!headers.includes(field)) {
    console.warn(`Skipping unknown field: ${field}`);
    skipped++;
    continue;
  }

  const target = dataRows.find(row =>
    row.hunt_code === huntCode && row.residency === residency
  );

  if (!target) {
    console.warn(`No matching row found for hunt_code=${huntCode}, residency=${residency}`);
    missingRows++;
    continue;
  }

  const currentValue = target[field];

  if (currentValue && !forceOverwrite) {
    skipped++;
    continue;
  }

  target[field] = value;
  updates++;
}

fs.writeFileSync(DATA_FILE, toCsv(dataRows, headers));

console.log("2026 supplement patch complete.");
console.log(`Updated fields: ${updates}`);
console.log(`Skipped fields: ${skipped}`);
console.log(`Missing target rows: ${missingRows}`);
