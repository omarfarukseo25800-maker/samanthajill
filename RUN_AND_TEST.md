# 🚀 XAMPP RUN & TEST GUIDELINE - One Complete Guide

**Goal:** Get HomeScraper running on your local machine and test all features  
**Time:** 15-20 minutes  
**Prerequisites:** XAMPP installed, Python 3.7+, Chrome/Edge browser  

---

## ✅ COMPLETE STEP-BY-STEP GUIDE

### **PHASE 1: START XAMPP (2 minutes)**

1. **Open XAMPP Control Panel**
   - Location: `C:\xampp\xampp-control.exe`
   
2. **Start Services**
   - Click "Start" next to **Apache**
   - Click "Start" next to **MySQL**
   - Both should show "Running" in green
   
3. **Verify**
   - Open browser: `http://localhost/`
   - Should see XAMPP dashboard
   - ✅ If you see it, continue to Phase 2

---

### **PHASE 2: INSTALL PYTHON PACKAGES (3 minutes)**

1. **Open Command Prompt (PowerShell)**
   - Win + R → Type `powershell` → Enter

2. **Navigate to Project**
   ```powershell
   cd C:\xampp\htdocs\homescraper\backend
   ```

3. **Install Requirements**
   ```powershell
   pip install -r requirements.txt
   ```
   - Wait for all packages to install (you'll see green checkmarks)
   - ✅ If success, continue to Phase 3

4. **Verify Installation**
   ```powershell
   python -c "import selenium; print('Selenium OK')"
   python -c "import mysql.connector; print('MySQL OK')"
   ```

---

### **PHASE 3: CREATE DATABASE (2 minutes)**

1. **Open phpMyAdmin**
   - Browser: `http://localhost/phpmyadmin`

2. **Check if Database Exists**
   - Left panel → Look for `homescraper_db`
   - If it exists → Skip to Phase 4
   - If NOT → Continue below

3. **Create Database**
   - Top → Click "New"
   - Database name: `homescraper_db`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"
   - ✅ Database created

4. **Verify Tables Created**
   - Click `homescraper_db` in left panel
   - Should see 4 tables: `properties`, `users`, `notifications`, `scrape_logs`
   - If NO tables → They'll be created when API is first accessed

---

### **PHASE 4: TEST SCRAPER (5 minutes)**

1. **Open PowerShell**
   - Win + R → Type `powershell` → Enter

2. **Run Scraper**
   ```powershell
   cd C:\xampp\htdocs\homescraper\backend\scrapers
   python affordable_housing_scraper.py
   ```

3. **Watch the Output**
   - You'll see:
     ```
     [timestamp] - INFO - Starting scrape...
     [timestamp] - INFO - Navigating to: https://affordablehousing.com/...
     [timestamp] - INFO - Found X listings in Atlanta area
     [timestamp] - INFO - Successfully saved Y new listings
     [timestamp] - INFO - Scrape completed in Z seconds
     ```

4. **Check Results**
   - Go back to phpMyAdmin: `http://localhost/phpmyadmin`
   - Click `homescraper_db` → `properties`
   - Should see rows of properties loaded
   - ✅ If properties appear, scraper works!

---

### **PHASE 5: TEST API (2 minutes)**

1. **Open Browser**
   - URL: `http://localhost/homescraper/backend/api.php`

2. **Should See JSON Response**
   ```json
   {
       "success": true,
       "data": [...],
       "pagination": {...}
   }
   ```
   - If you see this → API works! ✅

3. **Test Search API**
   - URL: `http://localhost/homescraper/backend/api.php/stats`
   - Should return statistics (total, today count, price range)

---

### **PHASE 6: TEST DASHBOARD (3 minutes)**

1. **Open Dashboard**
   - Browser: `http://localhost/homescraper/frontend/`

2. **Check Loading**
   - Should see:
     - ✅ Navbar at top
     - ✅ Sidebar with filters on left
     - ✅ Statistics cards
     - ✅ Search bar
     - ✅ Property grid with listings

3. **Test Search**
   - Type "atlanta" in search box
   - Properties should filter instantly

4. **Test Filters**
   - Left sidebar → Adjust price slider
   - Click "Apply Filters"
   - Results should update

5. **Test Property Details**
   - Click any property card
   - Modal should open with full details
   - Click "View Original" button
   - Should open listing in new tab

6. **Test Export**
   - Click "Export CSV" in sidebar
   - File downloads to your Downloads folder
   - Open with Excel to verify

7. **Test Mobile View**
   - Press F12 (Developer Tools)
   - Click device icon (mobile view)
   - Dashboard should adapt to mobile width
   - Use hamburger menu

---

### **PHASE 7: VERIFY EVERYTHING WORKS**

**Check these boxes:**

- ✅ XAMPP Apache showing "Running"
- ✅ XAMPP MySQL showing "Running"
- ✅ Python packages installed (no errors)
- ✅ Database created: `homescraper_db`
- ✅ Scraper runs without errors
- ✅ Properties in database (phpMyAdmin)
- ✅ API responds with JSON data
- ✅ Dashboard loading properties
- ✅ Search functionality works
- ✅ Filters work
- ✅ Property details modal opens
- ✅ Export CSV works
- ✅ Mobile view responsive

**All 12 checkboxes checked = System fully working! ✅**

---

## 🔧 TROUBLESHOOTING

### **"Apache won't start"**
- Close other XAMPP instances
- Run XAMPP as Administrator
- Check port 80 isn't in use: `netstat -ano | findstr :80`

### **"MySQL won't start"**
- Wait 30 seconds (sometimes slow)
- Check disk space
- Restart computer if needed

### **"Python not found"**
- Verify Python installed: `python --version`
- Add to PATH if needed:
  - Win + R → `sysdm.cpl` → Advanced → Environment Variables
  - Add Python path to PATH variable

### **"pip install fails"**
- Use: `python -m pip install --upgrade pip`
- Then: `pip install -r requirements.txt`
- Or: `pip install -r requirements.txt --user`

### **"Database tables not created"**
- Open phpMyAdmin
- Select `homescraper_db`
- Click "Empty" to clear any old data
- Go back to dashboard: `http://localhost/homescraper/frontend/`
- This triggers API which creates tables automatically

### **"Scraper shows errors"**
- Check internet connection
- Check affordablehousing.com is accessible in browser
- Verify Chrome/Chromium installed
- Run again: Selenium auto-downloads chromedriver first time

### **"Dashboard shows blank/no properties"**
- Click "Refresh Data" button
- Wait 5 seconds (loading spinner)
- Check browser console (F12) for errors
- Verify API works: `http://localhost/homescraper/backend/api.php`

### **"Properties not loading"**
- Wait another minute (scraper might still running)
- Manually run scraper again:
  ```powershell
  python C:\xampp\htdocs\homescraper\backend\scrapers\affordable_housing_scraper.py
  ```
- Refresh dashboard

---

## 📋 QUICK REFERENCE COMMANDS

```powershell
# Navigate to project
cd C:\xampp\htdocs\homescraper

# Install packages
pip install -r backend/requirements.txt

# Run scraper
python backend/scrapers/affordable_housing_scraper.py

# View scraper logs
type backend\logs\scraper.log

# Open dashboard
start http://localhost/homescraper/frontend/

# Open API
start http://localhost/homescraper/backend/api.php

# Open phpMyAdmin
start http://localhost/phpmyadmin
```

---

## 🎯 WHAT YOU'RE TESTING

| Component | What to Test | URL/Action |
|-----------|-------------|-----------|
| **Apache** | Server running | http://localhost |
| **MySQL** | Database working | phpMyAdmin interface |
| **Scraper** | Data collection | Run Python script |
| **Database** | Tables created | phpMyAdmin tables view |
| **API** | Data retrieval | http://localhost/homescraper/backend/api.php |
| **Dashboard** | UI rendering | http://localhost/homescraper/frontend/ |
| **Search** | Functionality | Type in search box |
| **Filters** | Functionality | Adjust sliders + click Apply |
| **Details** | Modal popup | Click property card |
| **Export** | CSV download | Click Export CSV button |
| **Mobile** | Responsiveness | F12 → Mobile view |

---

## ⏱️ TIMELINE

| Phase | Task | Time |
|-------|------|------|
| 1 | Start XAMPP | 2 min |
| 2 | Install Python | 3 min |
| 3 | Create Database | 2 min |
| 4 | Run Scraper | 5 min |
| 5 | Test API | 2 min |
| 6 | Test Dashboard | 3 min |
| 7 | Verify All | 1 min |
| **TOTAL** | **Complete Setup** | **18 min** |

---

## 🎯 SUCCESS CRITERIA

**You've succeeded when:**

1. ✅ You see property listings in the dashboard
2. ✅ You can search and filter properties
3. ✅ You can click a property and see full details
4. ✅ You can export data to CSV
5. ✅ Everything works on mobile (use F12)

**If you see all 5 of these working → System is ready! 🎉**

---

## 📝 NOTES

- **Auto-refresh:** Dashboard refreshes automatically every 5 minutes. No manual refresh needed.
- **Multiple runs:** You can run the scraper multiple times. It only adds NEW properties.
- **Save this guide:** Bookmark this file for future reference.
- **Firefox/Safari:** Works fine too, use any modern browser.
- **Internet required:** Only for scraper to access affordablehousing.com.
- **Keep XAMPP running:** While you're using the system.

---

## ❓ NEED HELP?

Having issues? Follow this order:

1. **Check basics:** XAMPP running? Python installed?
2. **Re-read relevant troubleshooting section** above
3. **Check logs:** `backend\logs\scraper.log`
4. **Check browser console:** F12 → Console tab
5. **Restart everything:** Stop XAMPP → Restart → Try again

---

**You're ready to go! Start with Phase 1 and follow through to Phase 7.** 🚀

*Estimated time to fully working system: 20 minutes*
