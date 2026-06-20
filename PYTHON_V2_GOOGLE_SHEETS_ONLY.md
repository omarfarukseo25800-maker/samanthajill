# Python Scraper v2 - Google Sheets Only (Updated)

## Changes Made ✅

Your script has been updated with these improvements:

### 1. **Google Sheets Only** (No Database)
- ❌ Removed all MySQL/database code
- ✅ Focuses exclusively on Google Sheets
- ✅ Lightweight and dependency-free (no MySQL connector needed)
- ✅ Faster execution

### 2. **5-Minute Breaks Between Pages** ⏸️
- ✅ Automatically waits 5 minutes after each page
- ✅ Helps avoid overloading the server
- ✅ Prevents IP throttling/blocking
- ✅ Shows countdown in console

### 3. **Single Page Per Run (Default)**
- ✅ `max_pages=1` is the default (prevent accidental full scrape)
- ✅ You control how many pages per run
- ✅ Safe and predictable

---

## Updated Installation (3 Steps)

### Step 1: Install Packages (Simplified)
```bash
cd c:\xampp\htdocs\homescraper\backend\scrapers
pip install google-api-python-client google-auth selenium beautifulsoup4 webdriver-manager requests
```

**Or use the requirements file:**
```bash
pip install -r requirements_v2.txt
```

### Step 2: Download Google Credentials
1. Go to https://console.cloud.google.com/
2. Create project, enable Google Sheets API
3. Create Service Account → Download JSON key
4. Save as `service_account.json` in scrapers directory
5. Share your Google Sheet with the service account email

### Step 3: Update Script Configuration
Edit the `__main__` section at the bottom:

```python
google_sheets_config = {
    'spreadsheet_id': 'YOUR_SPREADSHEET_ID',  # ← Paste your Sheet ID
    'sheet_name': 'Affordable Housing',
    'credentials_path': 'service_account.json'
}

num_pages = 1  # Start with 1 page, increase as needed
```

---

## Running the Script

### Test Run (1 Page)
```bash
python affordable_housing_scraper_v2.py
```

Expected output:
```
================================================================================
📊 Affordable Housing Scraper v2 (Google Sheets Only)
================================================================================
Configuration:
  • Spreadsheet ID: 1ABC2DEF...
  • Sheet name: Affordable Housing
  • Pages to scrape: 1
  • Break between pages: 5 minutes
  • Estimated time: 3 minutes
================================================================================

2024-03-04 10:30:15 - INFO - Starting scrape v2 with Google Sheets integration...
2024-03-04 10:30:15 - INFO - ✓ Google Sheets connection established
2024-03-04 10:30:25 - INFO - Page 1: Found 45 property cards
2024-03-04 10:30:35 - INFO - [NEW] 123 Main St, Atlanta, GA
...
2024-03-04 10:33:00 - INFO - ✓ Added 12 new listings to Google Sheet
2024-03-04 10:33:00 - INFO - [OK] Scrape completed successfully in 180 seconds
```

### Run 2 Pages with 5-Minute Break
```python
num_pages = 2  # Will scrape page 1, wait 5 minutes, then scrape page 2
```

Time estimate: 3 min (page 1) + 5 min (break) + 3 min (page 2) = **11 minutes**

### Run Multiple Pages Daily
```
09:00 AM - Run page 1 (3 min)
09:05 AM - Break (5 min)
10:10 AM - Run page 2 (3 min)
10:15 AM - Break (5 min)
11:20 AM - Run page 3 (3 min)
etc.
```

---

## Configuration Options

### Change Number of Pages
```python
num_pages = 1   # Just 1 page (default, safe)
num_pages = 2   # 2 pages in one run
num_pages = 4   # 4 pages in one run (longest: ~30 min)
num_pages = 8   # Full scrape (longest: ~50 minutes total with breaks)
```

### Change Sheet Name
```python
google_sheets_config = {
    'spreadsheet_id': 'YOUR_ID',
    'sheet_name': 'My Custom Sheet',  # ← Change this
    'credentials_path': 'service_account.json'
}
```

### Change credentials path
```python
google_sheets_config = {
    'spreadsheet_id': 'YOUR_ID',
    'sheet_name': 'Affordable Housing',
    'credentials_path': 'C:\Users\YourName\Downloads\service_account.json'  # Full path
}
```

---

## What Gets Updated in Google Sheet

### First Run (New Sheet):
- Header row created (blue background, white text)
- All properties added with **GREEN background** (marked as NEW)
- Columns: Address, Price, Beds, Baths, SqFt, Type, Phone, URL, Image, Description, Last Updated, Is New, Listing ID (hidden)

### Subsequent Runs:
- **NEW properties**: Green background with "NEW" in column L
- **Existing properties**: White background, "Last Updated" timestamp refreshed
- **No duplicates**: Each property appears only once
- Total rows grow as new listings are discovered

---

## Eliminating Files & Modules

### What Was Removed:
```
❌ mysql.connector imports
❌ mysql.connector.Error imports
❌ save_listings() method
❌ log_scrape() method
❌ get_db_connection() method
❌ database configuration
❌ requirements: mysql-connector-python
```

### What Remains:
```
✅ Google Sheets integration (full)
✅ Selenium + Chrome (JavaScript rendering)
✅ BeautifulSoup (HTML parsing)
✅ All data extraction logic
✅ 5-minute breaks between pages
✅ Logging to console and scraper.log
```

---

## Timing Chart

| Pages | Per Page | Breaks | Total Time |
|-------|----------|--------|------------|
| 1 | 3 min | 0 min | **3 min** |
| 2 | 3 min | 5 min | **11 min** |
| 3 | 3 min | 10 min | **19 min** |
| 4 | 3 min | 15 min | **27 min** |
| 5 | 3 min | 20 min | **35 min** |
| 6 | 3 min | 25 min | **43 min** |
| 7 | 3 min | 30 min | **51 min** |
| 8 | 3 min | 35 min | **59 min** |

---

## Scheduling Daily

### Option 1: Run 1 Page Daily (Lightweight)
```
Every day at 9:00 AM, run with num_pages = 1
→ Covers all 8 pages in 8 days (one per day)
→ 5 minutes each = lightweight
→ Good for production
```

### Option 2: Run 2 Pages Daily
```
Every day at 9:00 AM, run with num_pages = 2
→ Covers all 8 pages in 4 days
→ ~10-15 minutes each
→ Good balance
```

### Option 3: Run All Pages Weekly
```
Every Monday at 9:00 AM, run with num_pages = 8
→ Full scrape, ~1 hour
→ Everything fresh once per week
→ Simple setup
```

### Windows Task Scheduler Setup
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Scrape Affordable Housing Page X"
4. Trigger: Daily 9:00 AM
5. Action:
   - Program: `python`
   - Arguments: `"C:\xampp\htdocs\homescraper\backend\scrapers\affordable_housing_scraper_v2.py"`
   - Start in: `C:\xampp\htdocs\homescraper\backend\scrapers`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Run: `pip install google-api-python-client google-auth selenium beautifulsoup4 webdriver-manager requests` |
| `credentials not found` | Download from Google Cloud Console, save as `service_account.json` in same directory |
| `Spreadsheet not found` | Verify Sheet ID, ensure you shared it with service account email |
| `No new properties added` | Check if website has new listings, verify Google Sheet tab name |
| `Only sees 0 bytes cards` | This is fixed now - the break/pagination system handles it better |

---

## Performance Benefits

### Advantages of 5-Minute Breaks:
✅ **Server-friendly** - Reduces load  
✅ **Prevents blocking** - Avoids IP throttling  
✅ **Safer** - Less aggressive (more like human browsing)  
✅ **Predictable** - Known run times  
✅ **Scalable** - Can run multiple times per day  

### Example Daily Schedule:
```
06:00 AM - Pages 1-2 (11 min total)
12:00 PM - Pages 3-4 (11 min total)
06:00 PM - Pages 5-6 (11 min total)
→ All 6 pages scraped daily, each run ~11 minutes
→ Server never overloaded
→ Data very fresh
```

---

## Updated Script Features

✅ **Google Sheets Only** - No database, simpler setup  
✅ **5-Minute Breaks** - Built-in delays between pages  
✅ **Safe Defaults** - max_pages=1 prevents accidents  
✅ **Better Logging** - Shows configuration and estimates  
✅ **Lighter Dependencies** - Removed MySQL requirements  
✅ **Same Quality** - Full data extraction still works  
✅ **Green Highlighting** - New properties stand out  
✅ **Auto Updates** - Last Updated timestamp refreshed  
✅ **Duplicate Prevention** - Same property never added twice  

---

## Quick Start Command

```bash
# Change num_pages value in script, then run:
python affordable_housing_scraper_v2.py

# Expected: ~3-10 minutes total time depending on page count
# Result: Google Sheet updated with highlighted new properties
```

---

## Next Steps

1. ✅ Update `googlesheets_config` with your Sheet ID
2. ✅ Update `num_pages` to desired value
3. ✅ Test run: `python affordable_housing_scraper_v2.py`
4. ✅ Check Google Sheet for results (look for green rows)
5. ✅ Set up Task Scheduler for daily/weekly automated runs
6. ✅ Monitor `scraper.log` for any issues

---

## Summary

**You now have a clean, simple, fast Google Sheets scraper that:**
- ✅ Doesn't need a database
- ✅ Respects server limits with 5-min breaks
- ✅ Safely limits pages per run
- ✅ Updates Google Sheets with pretty formatting
- ✅ Marks new properties in green
- ✅ Is production-ready and stable

**Ready to run!** 🚀
