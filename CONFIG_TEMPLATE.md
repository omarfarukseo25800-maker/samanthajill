# Configuration Template for Affordable Housing Scraper v2

## Copy this entire configuration block and update the values:

```python
# Database Configuration
db_config = {
    'host': 'localhost',           # MySQL host (usually 'localhost' if local)
    'user': 'root',                # MySQL username
    'password': '',                # MySQL password (empty if no password)
    'database': 'homescraper_db'   # Database name
}

# Google Sheets Configuration
google_sheets_config = {
    'spreadsheet_id': '1mK9pQ2xL8vN3bH5yZ9q7E2j4K6w8H0u3X5c7F9g1I',  # Your Google Sheet ID
    'sheet_name': 'Affordable Housing',                              # Name of the sheet tab
    'credentials_path': 'service_account.json'                       # Path to Google credentials JSON
}

# Scraper Configuration
max_pages = 2  # Number of pages to scrape (change to None for all pages)

# Initialize scraper
scraper = AffordableHousingScraper(
    db_config, 
    max_pages=max_pages,
    google_sheets_config=google_sheets_config
)

# Run the scraper
scraper.run()
```

## Step-by-Step Configuration

### 1. Database Configuration
```python
db_config = {
    'host': 'localhost',           # Default for XAMPP
    'user': 'root',                # Default XAMPP user
    'password': '',                # Set if you have a password, otherwise leave empty
    'database': 'homescraper_db'   # Make sure this database exists in MySQL
}
```

**To check your MySQL settings:**
1. Open XAMPP Control Panel
2. Click "Admin" button next to MySQL
3. You'll see the database details

### 2. Google Sheets Configuration

**Find your Spreadsheet ID:**
1. Open your Google Sheet in browser
2. Look at the URL: `https://docs.google.com/spreadsheets/d/` **COPY_THIS_PART** `/edit`
3. Paste it in `'spreadsheet_id': '...'`

**Example:**
```python
# URL: https://docs.google.com/spreadsheets/d/1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX/edit
google_sheets_config = {
    'spreadsheet_id': '1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX',  # Extracted from URL
    'sheet_name': 'Affordable Housing',
    'credentials_path': 'service_account.json'
}
```

**Sheet Name:**
- Default: `'Affordable Housing'` (matches the tab name)
- Change if your tab is named differently

**Credentials Path:**
- Put `service_account.json` in the same directory as the script
- Or provide full path: `'C:\\path\\to\\service_account.json'`

### 3. Scraper Configuration

**Test Run (2 pages):**
```python
max_pages = 2  # Test with just 2 pages first
```

**Full Run (All 8 pages):**
```python
max_pages = None  # Scrape all available pages
```

**Specific Pages:**
```python
max_pages = 4    # Scrape pages 1-4 only
```

## Complete Example

Here's a complete example with all fields filled in:

```python
#!/usr/bin/env python3

from affordable_housing_scraper_v2 import AffordableHousingScraper

# CONFIGURATION START
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'homescraper_db'
}

google_sheets_config = {
    'spreadsheet_id': '1mK9pQ2xL8vN3bH5yZ9q7E2j4K6w8H0u3X5c7F9g1I',
    'sheet_name': 'Affordable Housing',
    'credentials_path': 'service_account.json'
}

max_pages = 2
# CONFIGURATION END

if __name__ == '__main__':
    print("Initializing scraper...")
    scraper = AffordableHousingScraper(
        db_config, 
        max_pages=max_pages,
        google_sheets_config=google_sheets_config
    )
    
    print("Starting scrape...")
    success = scraper.run()
    
    if success:
        print("✅ Scrape completed successfully!")
        print("Check your Google Sheet for results")
    else:
        print("❌ Scrape failed - check scraper.log for details")
```

## Quick Copy-Paste (Update These Fields Only)

```python
# CHANGE ONLY THESE VALUES:

db_password = ''                    # ← Change if MySQL has password
google_sheet_id = 'YOUR_SHEET_ID'   # ← Paste your Sheet ID here
db_name = 'homescraper_db'          # ← Change if database name is different
pages_to_scrape = 2                 # ← Change to None for all 8 pages
```

## Validation

Before running, verify:

- [ ] `service_account.json` exists in same directory as script
- [ ] Google Sheet ID is correct (from URL)
- [ ] MySQL is running in XAMPP
- [ ] Database `homescraper_db` exists
- [ ] Shared Google Sheet with service account email
- [ ] All required packages installed (`pip install -r requirements_v2.txt`)

## Common Issues & Solutions

### "ModuleNotFoundError: No module named 'google'"
```bash
# Fix: Install Google packages
pip install -r requirements_v2.txt
```

### "credentials not found"
```python
# Make sure service_account.json is in same folder as script
# Or use full path:
'credentials_path': 'C:\\Users\\YourName\\Downloads\\service_account.json'
```

### "Spreadsheet not found"
```
1. Check the Sheet ID is correct
2. Verify you shared the spreadsheet with the service account email
3. Service account email is in the JSON file under "client_email"
```

### "MySQL Connection Error"
```python
# Check these settings:
db_config = {
    'host': 'localhost',      # ← Correct for XAMPP local
    'user': 'root',           # ← Default XAMPP user
    'password': '',           # ← Check XAMPP settings
    'database': 'homescraper_db'  # ← Make sure database exists
}
```

## Next Steps

1. ✅ Fill in the configuration above with your values
2. ✅ Save the configuration (you can put in a separate `config.py` file)
3. ✅ Run: `python affordable_housing_scraper_v2.py`
4. ✅ Check results in Google Sheet
5. ✅ Set `max_pages = None` for full run

## Reference

- **Scraper file**: `backend/scrapers/affordable_housing_scraper_v2.py`
- **Setup guide**: `PYTHON_SCRAPER_V2_SETUP.md`
- **Quick start**: `QUICK_START_V2.md`
- **Summary**: `PYTHON_SCRAPER_V2_SUMMARY.md`
