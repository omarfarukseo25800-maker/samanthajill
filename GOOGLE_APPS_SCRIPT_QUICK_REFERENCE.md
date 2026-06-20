# Google Apps Script - Quick Start

## ⚡ 5-Minute Setup

### 1️⃣ Create Google Sheet
- Go to [sheets.google.com](https://sheets.google.com)
- Create blank sheet
- Copy the **Spreadsheet ID** from URL

### 2️⃣ Create Apps Script Project
- In Sheet: **Extensions → Apps Script**
- Delete existing code
- Paste: `GoogleAppsScript_Scraper.gs` content

### 3️⃣ Add Your Spreadsheet ID
Find line 8 and replace:
```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
```
With your actual ID from Step 1

### 4️⃣ Save & Authorize
- Click **Save** (Ctrl+S)
- Click **Run** next to `setupTriggers` function
- Grant permissions

### 5️⃣ Test It
- In Apps Script: Click dropdown → select `startAutoScrape`
- Click **Run**
- Wait ~15-30 seconds, check Sheet
- You should see properties added!

---

## 📊 What Gets Scraped

**Every 6 hours automatically**, all 8 pages with 20-minute breaks:

```
Page 1, Wait 20 min → Page 2, Wait 20 min → ... → Page 8
```

---

## 🎨 Color Coding

✅ **Green Background** = NEW property (first time seen)  
⚪ **White Background** = Existing property (already in sheet)

Column "L" shows **"NEW"** for new properties, blank for existing

---

## 📋 Sheet Columns

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Address | Price | Beds | Baths | Sqft | Type | Phone | Link | Image | Notes | Last Updated | Is New | ID* |

*Column M (ID) is hidden - used for duplicate detection only

---

## 🔧 Manual Functions

Run from Apps Script dropdown:

| Function | What It Does |
|----------|-------------|
| `startAutoScrape()` | Manually start scraping all 8 pages now |
| `setupTriggers()` | Set up automatic 6-hour runs (run once) |
| `removeTriggers()` | Stop automatic runs |
| `getScraperStats()` | Show: total properties, new count, last update |
| `initializeSheet()` | Reset/recreate headers |

---

## 📈 Timeline

Example: First auto-run at 12:00 PM

```
12:00 PM - Start
12:00-12:20 - Page 1 scrape
12:20-12:40 - Wait
12:40-13:00 - Page 2 scrape
13:00-13:20 - Wait
...
~14:30 - Page 8 done, COMPLETE

6:00 PM - Next auto-run starts
```

**Total per cycle:** ~2.5-3 hours  
**Auto frequency:** Every 6 hours (4 times per day)

---

## ❓ FAQ

**Q: Can I change the 20-minute break?**  
A: Yes! Line 13: `const BREAK_BETWEEN_PAGES = 20 * 60 * 1000;`  
Change `20` to any number (in minutes)

**Q: Can I add more/fewer pages?**  
A: Yes! Edit the `SCRAPE_URLS` array (lines 16-25)

**Q: Will duplicates be added?**  
A: No! Same property detected by address hash, won't be duplicated

**Q: What if a property disappears from the site?**  
A: It stays in your Sheet but green is removed on next scrape

**Q: How long until first results?**  
A: 30 seconds to 2 minutes after clicking Run

**Q: Is phone number captured?**  
A: Not yet - requires fetching detail pages (can be added)

**Q: Does it work offline?**  
A: No - needs internet to fetch from website

---

## 🚨 Troubleshooting

**Properties not appearing?**
1. Check Execution log: **View → Logs**
2. Look for error messages
3. Verify Spreadsheet ID is correct

**App seems stuck?**
1. Check logs for progress
2. Script has 6-min timeout - might split across runs
3. Wait a few minutes, check again

**Too slow?**
1. 20-min breaks are by design (not to overload)
2. Total ~2.5-3 hours is normal
3. Don't reduce breaks too much or site blocks requests

---

## 📧 URLs Being Scraped

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

---

## 🎯 Perfect! You're Done

Your scraper is now:
- ✅ Running automatically every 6 hours
- ✅ Scraping 8 pages with proper breaks
- ✅ Storing in Google Sheet
- ✅ Highlighting new properties in green
- ✅ Tracking last update times
- ✅ Preventing duplicates
- ✅ Logging errors

Sit back and watch the data flow in! 📊

---
