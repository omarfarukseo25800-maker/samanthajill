# Python Scraper v2 - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies (2 minutes)
```bash
cd c:\xampp\htdocs\homescraper\backend\scrapers
pip install -r requirements_v2.txt
```

### 2. Get Google Sheets Credentials (2 minutes)
1. Go to: https://console.cloud.google.com/
2. Create a new project
3. Enable "Google Sheets API"
4. Create a Service Account → Download JSON key
5. Save as `c:\xampp\htdocs\homescraper\service_account.json`
6. Share your Google Sheet with the service account email from the JSON file

### 3. Configure the Script (1 minute)

Open [affordable_housing_scraper_v2.py](affordable_housing_scraper_v2.py) and find these lines at the bottom:

**Change this:**
```python
google_sheets_config = {
    'spreadsheet_id': 'YOUR_SPREADSHEET_ID',
    'sheet_name': 'Affordable Housing',
    'credentials_path': 'service_account.json'
}
```

**To this (example):**
```python
google_sheets_config = {
    'spreadsheet_id': '1mK9pQ2xL8vN3bH5yZ9q7E2j4K6w8H0u3X5c7F9g1I',
    'sheet_name': 'Affordable Housing',
    'credentials_path': 'service_account.json'
}
```

Find your Spreadsheet ID in the URL: `https://docs.google.com/spreadsheets/d/` **YOUR_ID** `/edit`

### 4. Run It!

**Test run (2 pages):**
```bash
cd c:\xampp\htdocs\homescraper\backend\scrapers
python affordable_housing_scraper_v2.py
```

**Full run (all 8 pages):**
Change `max_pages=2` to `max_pages=None` in the script, then run.

## What You'll See

✅ Script starts scraping  
✅ Fetches property cards from affordablehousing.com  
✅ Extracts: Address, Price, Bedrooms, Bathrooms, Square Feet, Type, Phone, Images  
✅ Creates/updates Google Sheet automatically  
✅ **New properties highlighted in green** 🟢  
✅ **Last updated timestamp auto-filled** ⏰  
✅ **Saves to database AND Google Sheets** 📊

## Expected Run Time

- Page 1: ~2-3 minutes
- Full 8 pages: ~20-25 minutes
- Total: Check log file for exact timing

## Check Results

### In Google Sheet:
1. New properties will have **green background**
2. Last updated date in column K
3. All fields populated: Address, Price, Beds, Baths, SqFt, Type, Phone, URL, Image

### In Console:
```
[NEW] 123 Main St, Atlanta, GA (green in sheet)
[UPDATED] 456 Oak Ave, Atlanta, GA (timestamp updated)
✓ Added 12 new listings to Google Sheet
[OK] Scrape completed successfully
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'google'` | Run: `pip install -r requirements_v2.txt` |
| `credentials not found` | Put `service_account.json` in same directory as script |
| `Spreadsheet not found` | Check Spreadsheet ID and that you shared it with service account |
| `No listings found` | Check internet connection and if affordablehousing.com is accessible |
| Chrome driver fails | Run: `pip install --upgrade webdriver-manager` |

## Next: Automate It

After testing successfully, set up automated daily runs:

### Windows
1. Open Task Scheduler
2. Create task to run: `python C:\xampp\htdocs\homescraper\backend\scrapers\affordable_housing_scraper_v2.py`
3. Schedule for daily at 2 AM

### Linux/Mac
```bash
crontab -e
# Add: 0 2 * * * cd /path/to/homescraper && python backend/scrapers/affordable_housing_scraper_v2.py
```

## Key Features vs Original Apps Script

| Feature | Details |
|---------|---------|
| 🟢 **New Properties Green** | Automatically highlights new listings |
| ⏰ **Last Updated** | Auto-fills when property is updated |
| 🔄 **Duplicate Tracking** | Smart ID prevents duplicates |
| 📊 **Google Sheets** | Direct updates with formatting |
| 💾 **Database Backup** | Also saves to MySQL |
| 📱 **Better Logging** | Detailed logs in `scraper.log` |
| ⚡ **Fast** | Selenium is faster than Apps Script |

## Questions?

Check the full setup guide: [PYTHON_SCRAPER_V2_SETUP.md](../../PYTHON_SCRAPER_V2_SETUP.md)
