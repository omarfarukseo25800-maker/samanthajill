# Google Apps Script - Affordable Housing Scraper Setup Guide

## Overview
This Google Apps Script automatically scrapes affordable housing listings every 6 hours from 8 pages with 20-minute breaks between pages, stores them in Google Sheets, and tracks new properties.

## Features
✅ Automatic scraping every 6 hours  
✅ Scrapes 8 pages (page 1-8) with 20-minute breaks between each  
✅ Tracks last update time for each property  
✅ Green highlighting for NEW properties  
✅ Automatic duplicate detection (no duplicates)  
✅ Removes green when property is no longer new  
✅ Error logging

## Setup Instructions

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" → "Blank spreadsheet"
3. Name it "Affordable Housing Scraper"
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### Step 2: Create a Google Apps Script Project
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. This will open the Apps Script editor in a new tab
3. Delete any existing code in the editor
4. Copy and paste the `GoogleAppsScript_Scraper.gs` file content
5. Replace `YOUR_SPREADSHEET_ID` with your actual Spreadsheet ID (line 8):
   ```javascript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
   ```
6. Click **Save** (Ctrl+S)

### Step 3: Set Up Automatic Triggers
1. In the Apps Script editor, click on the **Triggers** icon (clock icon) on the left sidebar
2. Or, run the function `setupTriggers()`:
   - Click the dropdown that says "Select function"
   - Choose `setupTriggers`
   - Click **Run**
   - Grant the necessary permissions when prompted
3. The trigger will be created to run `startAutoScrape` every 6 hours

### Step 4: Test the Script
1. In the Apps Script editor, click the dropdown and select `startAutoScrape`
2. Click **Run**
3. Grant permissions if prompted
4. Check your Google Sheet - it should populate with properties
5. Watch the **Execution log** at the bottom to see progress

## How It Works

### Automatic Execution
- **Every 6 hours**: The script automatically runs and scrapes all 8 pages
- **Between pages**: 20-minute wait between each page scrape
- **Total time**: Approximately 2.5-3 hours per scrape cycle (8 pages × ~20 min break)

### Data Tracking
The sheet has these columns:
| Column | Purpose |
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
| L | Is New (NEW/blank) |
| M | Listing ID (hidden, for duplicate detection) |

### New Property Highlighting
- **First appearance**: Property is marked with green background + "NEW" in column L
- **On subsequent scrapes**: 
  - If property still exists: Green removed, "NEW" cleared, but `Last Updated` is refreshed
  - If property disappears: It remains in the sheet but no longer highlighted

### Duplicate Prevention
- Each property is identified by a hash of its address
- Same property on different pages won't be added twice
- Existing properties are only updated with new `Last Updated` time

## Manual Functions

You can also run these functions manually from the Apps Script editor:

### `startAutoScrape()`
Manually starts a complete scrape cycle of all 8 pages

### `setupTriggers()`
Sets up the automatic 6-hour triggers (run this once)

### `removeTriggers()`
Removes the automatic triggers (if you want to pause)

### `getScraperStats()`
Shows statistics: total properties, new properties, last update time

### `initializeSheet()`
Initializes/resets the sheet headers

## Monitoring & Troubleshooting

### Check Logs
1. In Apps Script editor: **View** → **Logs** (or Ctrl+Enter after a test run)
2. Logs show:
   - Success messages
   - Pages scraped
   - Properties found per page
   - Errors if any

### Error Sheet
- Errors are automatically logged to an "Errors" sheet
- Check this if something goes wrong

### Common Issues

**Issue**: Script times out
- **Solution**: Google Apps Script has a 6-minute timeout per execution. This script respects that by using `Utilities.sleep()` which shouldn't trigger timeouts. If props aren't scraping, check the logs.

**Issue**: Properties not being added
- **Cause**: Network issues or website structure changed
- **Solution**: Check the Execution log for specific errors, inspect the HTML structure

**Issue**: Green highlighting not appearing
- **Cause**: You already had the property from a previous scrape
- **Solution**: First time running, existing data has no "NEW" marker. Green only appears for properties added after setup.

**Issue**: Duplicate properties appearing
- **Cause**: Website changed structure or hash generation failed
- **Solution**: The listing ID (column M) allows deduplication. You can manually delete duplicates.

## URL List
The script scrapes these URLs every 6 hours:
```
https://www.affordablehousing.com/atlanta-ga/house/
https://www.affordablehousing.com/atlanta-ga/house/page-2/
https://www.affordablehousing.com/atlanta-ga/house/page-3/
https://www.affordablehousing.com/atlanta-ga/house/page-4/
https://www.affordablehousing.com/atlanta-ga/house/page-5/
https://www.affordablehousing.com/atlanta-ga/house/page-6/
https://www.affordablehousing.com/atlanta-ga/house/page-7/
https://www.affordablehousing.com/atlanta-ga/house/page-8/
```

## Customization

### Change Scrape Interval
Line 13:
```javascript
const BREAK_BETWEEN_PAGES = 20 * 60 * 1000; // 20 minutes
```
Change `20` to a different number (in minutes)

### Change Highlight Color
Line 14:
```javascript
const NEW_PROPERTY_COLOR = "#90EE90"; // Light green
```
Use any hex color code

### Add More Pages
Update the `SCRAPE_URLS` array (lines 16-25) with additional URLs

### Change Trigger Interval
In `setupTriggers()` function (line 260):
```javascript
.everyHours(6) // Change 6 to desired interval
```

## Notes
- The script uses Google Apps Script's native UrlFetchApp (no external API needed)
- Parsing is done with regex patterns (faster but may need adjustment if website layout changes)
- No phone numbers are scraped yet (would require individual detail page fetches)
- Sheet automatically creates headers on first run
- All timestamps are in your local timezone

## Support
If the script stops working:
1. Check the Execution log for errors
2. Check the "Errors" sheet for logged issues
3. Verify the website structure hasn't changed
4. Test with `startAutoScrape()` function manually
5. Check Google Apps Script quotas (executions per day, etc.)

---
Created: March 4, 2026
