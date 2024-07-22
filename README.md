# Invoice Data Matcher

## Overview

This project matches and compares data between two MongoDB collections: `gstr2` and `purchases`. It provides a web interface using Next.js to display matched entries and unique records.

## Features

- Match entries based on `ctin`, `rt`, and `inum`.
- Identify and display:
  - Entries in both collections
  - Entries only in `gstr2`
  - Entries only in `purchases`
- Compare additional fields and show exact matches.

## Run the App:

```bash
npm run dev