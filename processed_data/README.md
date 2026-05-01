# 2026 Hunt Database Supplement Workflow

This folder is used to patch missing or incomplete 2026 hunt data into:

`processed_data/hunt_database_complete.csv`

## Step 1

Copy:

`hunt_database_2026_patch.template.csv`

Rename the copy:

`hunt_database_2026_patch.csv`

## Step 2

Add one row per missing field.

Required columns:

```csv
hunt_code,residency,field,value,force_overwrite
