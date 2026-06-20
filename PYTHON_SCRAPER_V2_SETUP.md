# Python Scraper v2 - Setup Guide

## Overview
The improved Python scraper (`affordable_housing_scraper_v2.py`) features:
- ✅ **Google Sheets Integration** - Updates Google Sheets directly with formatting
- ✅ **New Properties Marked Green** - New listings are highlighted with green background
- ✅ **Last Updated Tracking** - Automatically updates last modified timestamp
- ✅ **Duplicate Detection** - Uses listing ID to identify new vs existing properties
- ✅ **Formatted Headers** - Blue header row with white text
- ✅ **Better Logging** - Detailed logging of all operations
- ✅ **Database + Sheets** - Saves data to both MySQL and Google Sheets

## Installation

### Step 1: Install Required Python Packages

```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client google-auth
```

Or if you're in a virtual environment:
```bash
# In Windows (Command Prompt)
venv\Scripts\pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client google-auth

# OR using the requirements file (create one if needed)
pip install -r requirements.txt
```

Required packages for `requirements.txt`:
```
selenium>=4.0.0
beautifulsoup4>=4.9.0
mysql-connector-python>=8.0.0
webdriver-manager>=3.8.0
requests>=2.26.0
google-auth-oauthlib>=0.7.0
google-auth-httplib2>=0.1.0
google-api-python-client>=2.50.0
python-dateutil>=2.8.0
```

### Step 2: Set Up Google Sheets API Credentials

1. **Go to Google Cloud Console:**
   - Visit https://console.cloud.google.com/
   - Create a new project (or select existing)
   - Enable the Google Sheets API:
     - Search for "Google Sheets API"
     - Click "Enable"

2. **Create a Service Account:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Fill in the details and click "Create and Continue"
   - Grant "Editor" role (or create a custom role with Sheets editing)
   - Click "Continue" → "Done"

3. **Generate and Download Key:**
   - In the Credentials page, find your service account
   - Click on the account email
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key" → "JSON"
   - Save the downloaded JSON file as `service_account.json` in your scraper directory

4. **Share Your Google Sheet:**
   - Open your Google Sheet
   - Click "Share"
   - Copy the service account email from the JSON file (the `client_email` field)
   - Paste it in the share dialog and give it "Editor" access
   - Click "Share"

### Step 3: Update Configuration

In `affordable_housing_scraper_v2.py`, update these values:

```python
google_sheets_config = {
    'spreadsheet_id': 'YOUR_SPREADSHEET_ID',  # Get from Google Sheet URL
    'sheet_name': 'Affordable Housing',        # Name of the sheet tab
    'credentials_path': 'service_account.json' # Path to credentials file
}
```

**To find your Spreadsheet ID:**
- Open your Google Sheet in browser
- Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`

### Step 4: Database Configuration

Update the database config in the script:

```python
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',  # If you have a password
    'database': 'homescraper_db'
}
```

## Running the Scraper

### Test Run (First 2 Pages)
```bash
python backend/scrapers/affordable_housing_scraper_v2.py
```

To test with only 2 pages, modify the script:
```python
scraper = AffordableHousingScraper(
    db_config, 
    max_pages=2,  # Test with 2 pages first
    google_sheets_config=google_sheets_config
)
```

### Full Run (All 8 Pages)
Set `max_pages=None` or remove the parameter:
```python
scraper = AffordableHousingScraper(
    db_config, 
    max_pages=None,  # Scrape all pages
    google_sheets_config=google_sheets_config
)
```

### Expected Output

During execution, you should see:
```
2024-03-04 10:30:15 - INFO - Starting scrape v2 with Google Sheets integration...
2024-03-04 10:30:15 - INFO - ✓ Google Sheets connection established
2024-03-04 10:30:15 - INFO - ✓ Sheet headers initialized
================================================================================
2024-03-04 10:30:16 - INFO - Navigating to page 1: https://www.affordablehousing.com/atlanta-ga/house/
2024-03-04 10:30:20 - INFO - Page 1: Premium cards found and loaded
2024-03-04 10:30:25 - INFO - Page 1: JavaScript rendering complete
2024-03-04 10:30:25 - INFO - Page 1: Found 45 property cards
2024-03-04 10:30:25 - INFO - Page 1: Successfully extracted 45 listing URLs
...
2024-03-04 10:35:00 - INFO - [NEW] 123 Main St, Atlanta, GA (marked green in sheet)
2024-03-04 10:35:01 - INFO - [UPDATED] 456 Oak Ave, Atlanta, GA - Last updated: 2024-03-04 10:35:01
...
2024-03-04 10:45:15 - INFO - ✓ Added 12 new listings to Google Sheet
2024-03-04 10:45:16 - INFO - Updated Google Sheet
2024-03-04 10:45:17 - INFO - [OK] Scrape completed successfully in 900 seconds
[OK] Processed 360 listings
[OK] Database and Google Sheet updated
```

## What Gets Saved

### In Google Sheet:
| Column | Content |
|--------|---------|
| A | Address |
| B | Price |
| C | Bedrooms |
| D | Bathrooms |
| E | Square Feet |
| F | Property Type |
| G | Phone |
| H | Listing URL |
| I | Image URL |
| J | Description |
| K | Last Updated |
| L | Is New (marked "NEW") |
| M | Listing ID (hidden, for duplicate detection) |

**Formatting:**
- Header row: Blue background (#4472C4) with white bold text
- New properties: Green background (#90EE90)
- Existing properties: White background (auto-updated timestamp)

### In Database:
Same columns saved to `properties` table in `homescraper_db`

## Scheduling (Automated Runs)

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task → "Scrape Affordable Housing"
3. Set trigger: "Daily" or "Weekly" at your preferred time
4. Set action: 
   - Program: `C:\Python\python.exe` (or your Python path)
   - Arguments: `"C:\xampp\htdocs\homescraper\backend\scrapers\affordable_housing_scraper_v2.py"`
   - Start in: `C:\xampp\htdocs\homescraper`

### Linux/Mac (cron)
```bash
# Edit crontab
crontab -e

# Run daily at 2 AM
0 2 * * * cd /path/to/homescraper && python backend/scrapers/affordable_housing_scraper_v2.py >> scraper.log 2>&1
```

## Troubleshooting

### "Google Sheets credentials not found"
- Ensure `service_account.json` is in the same directory as the script
- Download a new credentials file from Google Cloud Console

### "Spreadsheet not found"
- Verify the Spreadsheet ID is correct
- Ensure you shared the sheet with the service account email

### "No records saved"
- Check database connection settings
- Verify MySQL is running
- Check the logs for specific error messages

### "No listings found after scrape"
- The website structure may have changed
- Check `scraped_page.html` to see what was fetched
- Verify Chrome/ChromeDriver is working properly

## Comparison: v1 vs v2

| Feature | v1 (Original) | v2 (Improved) |
|---------|---------------|---------------|
| Scrapes with Selenium | ✅ | ✅ |
| Handles JavaScript rendering | ✅ | ✅ |
| Saves to MySQL | ✅ | ✅ |
| Google Sheets integration | ❌ | ✅ NEW |
| Green highlighting for new items | ❌ | ✅ NEW |
| Duplicate detection | ❌ | ✅ NEW |
| Last updated tracking | ❌ | ✅ NEW |
| Formatted headers | ❌ | ✅ NEW |
| Logging | ✅ (basic) | ✅ (detailed) |

## Next Steps

1. ✅ Install Google Sheets packages
2. ✅ Set up service account credentials
3. ✅ Configure the script with your Spreadsheet ID
4. ✅ Test run with `max_pages=2`
5. ✅ If successful, run full scrape with `max_pages=None`
6. ✅ Set up automation via Task Scheduler or cron
7. ✅ Monitor logs in `scraper.log`
