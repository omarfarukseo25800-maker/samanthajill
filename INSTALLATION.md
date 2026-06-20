# Installation & Setup Guide

## Local Development Setup

### Prerequisites
- **XAMPP** (Apache + MySQL + PHP)
- **Python 3.7+** with pip
- **Git** (optional)
- **Chrome/Chromium** browser

### Step 1: Extract Files
Extract the `homescraper` folder to:
```
C:\xampp\htdocs\homescraper
```

### Step 2: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Verify they show "Running" status

### Step 3: Create Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. The database will be created automatically on first API call
3. Or manually:
   ```sql
   CREATE DATABASE homescraper_db;
   ```

### Step 4: Install Python Dependencies
Open Command Prompt and run:
```bash
cd C:\xampp\htdocs\homescraper\backend
pip install -r requirements.txt
```

This installs:
- selenium
- beautifulsoup4
- mysql-connector-python
- requests
- Other dependencies

### Step 5: Configure Environment
Edit `.env` file in root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=homescraper_db
```

### Step 6: Access the Application
Open in your browser:
```
http://localhost/homescraper/frontend/
```

### Step 7: Test the Scraper (Optional)
Run scraper manually:
```bash
cd C:\xampp\htdocs\homescraper\backend\scrapers
python affordable_housing_scraper.py
```

## Windows Task Scheduler Setup

To run the scraper automatically every hour on Windows:

1. **Open Task Scheduler**
   - Win + R → `taskschd.msc`

2. **Create Basic Task**
   - Click "Create Basic Task" on right panel
   - Name: "HomeScraper"
   - Description: "Run affordable housing scraper"

3. **Set Trigger**
   - Trigger Tab → New
   - Begin the task: On a schedule
   - Repeat task: Daily
   - Or Hourly for more frequent updates

4. **Set Action**
   - Action Tab → New
   - Program/script: `C:\Python39\python.exe`
   - Add arguments: `C:\xampp\htdocs\homescraper\backend\scrapers\affordable_housing_scraper.py`
   - Start in: `C:\xampp\htdocs\homescraper\backend`

5. **Conditions & Settings**
   - Conditions Tab:
     - Uncheck "Stop if computer switches to battery power"
     - Uncheck "Start only if computer is on AC power"
   - Settings Tab:
     - Check "Run task as soon as possible if a scheduled start is missed"
     - Check "If the running task does not end when requested, force it to stop"
     - Set timeout to 5 minutes

6. **Click OK**
   - Enter Windows password if prompted

## Alternative: Cron Job via HTTP (Windows IIS or Linux)

Set up a scheduled HTTP request instead:

### Windows Task Scheduler (HTTP call)
```bash
Program: C:\Windows\System32\curl.exe
Arguments: http://localhost/homescraper/backend/cron.php
```

### Linux Crontab
```bash
# Edit crontab
crontab -e

# Add line to run every hour
0 * * * * curl http://yourdomain.com/homescraper/backend/cron.php > /dev/null 2>&1
```

## Troubleshooting

### Issue: "Cannot find module 'selenium'"
**Solution:**
```bash
pip install selenium --upgrade
```

### Issue: "Chrome driver not found"
**Solution:** Selenium will auto-download ChromeDriver
- Or manually download from: https://chromedriver.chromium.org/

### Issue: "Connection refused" to database
**Solution:**
1. Check MySQL is running in XAMPP
2. Verify database credentials in `backend/config/database.php`
3. Check database exists: `CREATE DATABASE homescraper_db;`

### Issue: "Permission denied" on logs folder
**Solution (Linux/Mac):**
```bash
chmod -R 755 backend/logs
```

### Issue: Scraper doesn't find properties
**Solution:**
1. Check sight layout hasn't changed
2. Verify internet connection
3. Check scraper logs: `backend/logs/scraper.log`
4. Update CSS selectors if needed

## Testing the API

### Get all properties
```bash
curl http://localhost/homescraper/backend/api.php
```

Expected response:
```json
{
    "success": true,
    "data": [...],
    "pagination": { "page": 1, "limit": 20, "total": 0, "pages": 0 }
}
```

### Search properties
```bash
curl http://localhost/homescraper/backend/api.php/search?q=atlanta
```

### Get statistics
```bash
curl http://localhost/homescraper/backend/api.php/stats
```

### Export as CSV
```bash
curl -o properties.csv http://localhost/homescraper/backend/api.php/export?format=csv
```

## Verify Installation

Checklist:
- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database created: `homescraper_db`
- [ ] Python dependencies installed
- [ ] Cannot access: `http://localhost/homescraper/frontend/`
- [ ] API responds: `http://localhost/homescraper/backend/api.php`
- [ ] Scraper runs without errors

## Next Steps

1. **Configure for Atlanta**
   - Verify `backend/config/areas.json` contains Atlanta neighborhoods
   - Check map boundaries match client's map

2. **Run First Scrape**
   - Execute scraper to populate initial data
   - Check for any errors in logs

3. **Set Up Automation**
   - Configure Task Scheduler or Cron
   - Test scheduled runs

4. **Customize UI**
   - Update colors in `frontend/css/styles.css`
   - Add client branding/logo

5. **Set Up Notifications**
   - Configure email settings
   - Test notification delivery

6. **Deploy to Production**
   - Transfer to client's server
   - Update database credentials
   - Configure SSL/HTTPS

## Support

For issues or questions:
1. Check README.md for full documentation
2. Review scraper logs: `backend/logs/scraper.log`
3. Check browser console for JavaScript errors
4. Verify PHP errors in XAMPP logs

---

**Quick Start Commands:**
```bash
# Install Python packages
pip install -r backend/requirements.txt

# Run scraper once
python backend/scrapers/affordable_housing_scraper.py

# View scraper logs
type backend\logs\scraper.log
```

**Access Points:**
- Frontend: http://localhost/homescraper/frontend/
- API: http://localhost/homescraper/backend/api.php
- phpMyAdmin: http://localhost/phpmyadmin
