# 📑 HomeScraper - Complete File Index

Complete listing of all project files with descriptions.

---

## 📁 Root Directory Files

### Documentation Files
| File | Purpose |
|------|---------|
| **README.md** | Complete project documentation - START HERE |
| **PROJECT_SUMMARY.md** | Executive summary of what was built |
| **INSTALLATION.md** | Step-by-step setup instructions for Windows |
| **DEPLOYMENT.md** | Complete guide to deploying on client's server |
| **ADVANCED_FEATURES.md** | Optional enhancements and customizations |
| **QUICK_START.html** | User-friendly guide for end users (client) |
| **FILE_INDEX.md** | This file - complete file listing |

### Configuration Files
| File | Purpose |
|------|---------|
| **.env** | Environment variables (database, scraper settings) |
| **.htaccess** | Apache server configuration (CORS, redirects, caching) |
| **manifest.json** | Progressive Web App (PWA) configuration |
| **PWA_CONFIG.txt** | Instructions for PWA setup |
| **requirements.txt** | Python package dependencies |

### Core Application Files
| File | Purpose |
|------|---------|
| **sw.js** | Service Worker for offline support & notifications |

---

## 📂 /frontend - User Dashboard

### HTML
| File | Purpose | Size |
|------|---------|------|
| **index.html** | Main dashboard interface | ~5KB |
| - Navigation bar | Top menu with branding | - |
| - Sidebar | Filters and quick actions | - |
| - Statistics cards | Overview metrics | - |
| - Search bar | Property search input | - |
| - Properties grid | Main listing display | - |
| - Property modal | Detail popup window | - |
| - Pagination | Navigation between pages | - |

### CSS Styling
| File | Purpose | Size |
|------|---------|------|
| **css/styles.css** | Complete styling (2,000+ lines) | ~35KB |
| - Global variables | Color scheme, shadows, transitions | - |
| - Navbar styles | Top navigation bar | - |
| - Sidebar styles | Filter panel | - |
| - Statistics cards | Metric displays | - |
| - Search section | Search bar styling | - |
| - Property cards | Individual property display | - |
| - Modal styles | Detail popup | - |
| - Animations | Keyframes and transitions | - |
| - Responsive layouts | Mobile, tablet, desktop | - |

### JavaScript
| File | Purpose | Size |
|------|---------|------|
| **js/app.js** | Main application logic (800+ lines) | ~40KB |
| - HomeScraper class | Core application logic | - |
| - Event listeners | User interaction handlers | - |
| - API integration | Fetch data from backend | - |
| - Data rendering | Display properties | - |
| - Search/filter logic | Search and filter functions | - |
| - Modal display | Property detail popup | - |
| - Export functionality | CSV export handler | - |
| - Notifications | Toast and alert system | - |
| - Auto-refresh | Periodic data updates | - |

### Assets
| Directory | Purpose |
|-----------|---------|
| **assets/** | Images, icons, and media files |
| - icon-192.png | PWA icon (192x192) |
| - icon-512.png | PWA icon (512x512) |
| - maskable-icon.png | Maskable PWA icon |

---

## 📂 /backend - Server Logic

### Main API
| File | Purpose | Lines |
|------|---------|-------|
| **api.php** | RESTful API endpoints (300+ lines) | 300+ |
| - Properties endpoints | GET/POST/PUT/DELETE properties | - |
| - Search endpoint | Property search functionality | - |
| - Statistics endpoint | Aggregate statistics | - |
| - Notifications endpoint | User alerts | - |
| - Export endpoint | CSV/JSON export | - |

### Scheduler
| File | Purpose | Lines |
|------|---------|-------|
| **cron.php** | Automated scraper scheduler (100+ lines) | 100+ |
| - Cron trigger | Runs scraper on schedule | - |
| - Logging | Records execution history | - |
| - Polling system | HTTP trigger support | - |
| - Log rotation | Cleanup old logs | - |

### 📂 /backend/config - Configuration

| File | Purpose | Size |
|------|---------|------|
| **database.php** | MySQL database setup (100+ lines) | ~5KB |
| - Database connection | PDO/MySQLi setup | - |
| - Table creation | Schema definitions | - |
| - Index creation | Query optimization | - |
| - Error handling | Connection error management | - |
| **areas.json** | Target areas configuration | ~2KB |
| - Atlanta details | City settings | - |
| - Neighborhoods | Target areas list | - |
| - Geographic bounds | Map boundaries | - |

### 📂 /backend/scrapers - Web Scraping

| File | Purpose | Lines |
|------|---------|-------|
| **affordable_housing_scraper.py** | Main scraper (400+ lines) | 400+ |
| - AffordableHousingScraper class | Scraper logic | - |
| - Selenium setup | Browser automation | - |
| - HTML parsing | BeautifulSoup | - |
| - Data extraction | Property details | - |
| - Phone number retrieval | Click-through functionality | - |
| - Location filtering | Atlanta area validation | - |
| - Database saving | Property insertion | - |
| - Error handling | Logging and recovery | - |
| - Scheduling support | Cron integration | - |

### 📂 /backend/logs - Execution Logs

| Directory | Purpose |
|-----------|---------|
| **logs/** | Scraper execution logs |
| - scraper.log | Current scraper output |
| - cron.log | Scheduler execution log |
| (auto-generated) | Created during runs |

---

## 📊 Database Tables Schema

### properties
```
id (PK)              - Auto-increment ID
listing_id           - Unique listing identifier
address              - Full property address
phone                - Contact phone number
price                - Listing price
bedrooms             - Number of bedrooms
bathrooms            - Number of bathrooms
square_feet          - Property size
lot_size             - Lot size
property_type        - Type (Single Family, etc)
description          - Long description
latitude             - GPS latitude
longitude            - GPS longitude
image_url            - Main image URL
listing_url          - Original listing URL
status               - active/sold/deleted
scraped_date         - When first scraped
last_updated         - Last update timestamp
Indexes: address, listing_id, status, price
```

### users
```
id (PK)              - User ID
username             - Login name
email                - Email address
password_hash        - Hashed password
is_admin             - Admin flag
created_at           - Account creation date
Unique: username, email
```

### notifications
```
id (PK)              - Notification ID
user_id (FK)         - User ID
property_id (FK)     - Property ID
message              - Alert message
is_read              - Read status
created_at           - Creation timestamp
```

### scrape_logs
```
id (PK)              - Log entry ID
scrape_date          - When scrape ran
properties_found     - Total found
properties_new       - New listings
duration_seconds     - Execution time
status               - success/error
error_message        - Error details
```

---

## 🔌 API Endpoints Reference

### Properties
```
GET  /api.php                      - Get all properties (paginated)
POST /api.php                      - Create new property
GET  /api.php/{id}                - Get specific property
PUT  /api.php/{id}                - Update property
DELETE /api.php/{id}              - Delete property
```

### Search & Filter
```
GET  /api.php/search?q=address    - Search properties
GET  /api.php?page=1&limit=20     - Pagination
GET  /api.php?status=active       - Filter by status
GET  /api.php?min_price=100000    - Filter by price (custom)
```

### Statistics
```
GET  /api.php/stats               - Get aggregate statistics
```

### Notifications
```
GET  /api.php/notifications       - Get user notifications
POST /api.php/notifications       - Create notification
```

### Export
```
GET  /api.php/export?format=csv   - Export as CSV
GET  /api.php/export?format=json  - Export as JSON
```

### Scheduler
```
GET  /cron.php                    - Trigger scraper run
```

---

## 🔐 Directory Structure with Permissions

```
homescraper/                       (755)
├── frontend/                       (755 - public)
│   ├── index.html                 (644)
│   ├── css/                       (755)
│   │   └── styles.css             (644)
│   ├── js/                        (755)
│   │   └── app.js                 (644)
│   └── assets/                    (755)
│
├── backend/                        (755)
│   ├── api.php                    (644)
│   ├── cron.php                   (644)
│   ├── config/                    (755)
│   │   ├── database.php           (644)
│   │   └── areas.json             (644)
│   ├── scrapers/                  (755)
│   │   └── affordable_housing_scraper.py (755)
│   └── logs/                      (777 - writable)
│
├── .env                           (600 - sensitive)
├── .htaccess                      (644)
├── README.md                      (644)
├── PROJECT_SUMMARY.md             (644)
├── INSTALLATION.md                (644)
├── DEPLOYMENT.md                  (644)
├── ADVANCED_FEATURES.md           (644)
├── QUICK_START.html               (644)
├── manifest.json                  (644)
├── requirements.txt               (644)
├── sw.js                          (644)
└── PWA_CONFIG.txt                 (644)
```

---

## 📋 File Dependencies

### Frontend (index.html) Requires:
- ✅ css/styles.css
- ✅ js/app.js
- ✅ Font Awesome (CDN)
- ✅ API: /backend/api.php

### Backend (api.php) Requires:
- ✅ config/database.php
- ✅ MySQL database
- ✅ PHP 7.4+

### Scraper (affordable_housing_scraper.py) Requires:
- ✅ config/database.php (config credentials)
- ✅ Python 3.7+
- ✅ selenium
- ✅ beautifulsoup4
- ✅ mysql-connector-python
- ✅ requests
- ✅ Chrome/Chromium browser

### Scheduler (cron.php) Requires:
- ✅ config/database.php
- ✅ PHP CLI
- ✅ Python installed
- ✅ scrapers/affordable_housing_scraper.py

---

## 🔒 Sensitive Files

These files contain sensitive information:
- **.env** - Database credentials, API keys
- **.htaccess** - Blocked in htaccess (.env not accessible)
- **config/database.php** - Database credentials
- **.git/** - Version control (excluded from deployment)

**Protection:**
```
# In .htaccess:
<FilesMatch "\.env|\.git|composer\.lock|package-lock\.json">
    Order allow,deny
    Deny from all
</FilesMatch>
```

---

## 📦 File Size Summary

| Category | Files | Total Size |
|----------|-------|-----------|
| **Frontend** | 3 main files | ~80KB |
| - HTML | 1 file | ~5KB |
| - CSS | 1 file | ~35KB |
| - JavaScript | 1 file | ~40KB |
| **Backend** | 2 main files | ~50KB |
| - PHP API | 1 file | ~15KB |
| - Python Scraper | 1 file | ~20KB |
| **Documentation** | 7 files | ~200KB |
| - Markdown docs | 6 files | ~150KB |
| - Client guide | 1 file | ~50KB |
| **Configuration** | 5 files | ~20KB |
| **Total** | 24+ files | ~400KB |

---

## 🔄 File Update Frequency

### Frequently Updated
- **logs/** - Updated on every scraper run (hourly)
- **MySQL database** - Updated on every scraper run (hourly)

### Rarely Updated
- **index.html** - Only for feature changes
- **styles.css** - Only for design changes
- **app.js** - Only for feature changes

### Never Auto-Updated
- **.env** - Manual configuration
- **database.php** - Manual configuration
- **areas.json** - Manual area changes
- **api.php** - Core functionality
- **scraper .py** - Core functionality

---

## 📝 How to Find Files You Need

### I want to...

**Change colors/design**
→ Edit: `frontend/css/styles.css` (look for :root variables)

**Add new API endpoint**
→ Edit: `backend/api.php` (add case statement)

**Modify scraper logic**
→ Edit: `backend/scrapers/affordable_housing_scraper.py`

**Change database credentials**
→ Edit: `.env` or `backend/config/database.php`

**Add/remove target neighborhoods**
→ Edit: `backend/config/areas.json`

**Customize client documentation**
→ Edit: `QUICK_START.html`

**Fix a bug in dashboard**
→ Edit: `frontend/js/app.js`

**Change notifications settings**
→ Edit: `.env` file

**Set up scheduling**
→ Configure: `backend/cron.php` or system cron

**Deploy to new server**
→ Follow: `DEPLOYMENT.md`

**Understand the project**
→ Read: `README.md` then `PROJECT_SUMMARY.md`

---

## 🚀 Deployment Checklist

Files to update before deployment:
- ✅ .env (database credentials)
- ✅ backend/config/database.php (connection details)
- ✅ .htaccess (domain settings)
- ✅ frontend/js/app.js (API URL if not root)
- ✅ Set file permissions (755 dirs, 644 files)
- ✅ Create database and user
- ✅ Install Python packages
- ✅ Set up cron job/scheduler

Files that don't need updating:
- ✅ index.html
- ✅ styles.css
- ✅ app.js (if API in standard path)
- ✅ api.php
- ✅ scraper.py
- ✅ All documentation

---

## 📞 Support Reference

**If you can't find something:**
1. Check README.md
2. Search this file (File Index)
3. Check folder structure above
4. Search for keyword in project files
5. Check ADVANCED_FEATURES.md for customizations

**If something is broken:**
1. Check error logs: `backend/logs/scraper.log`
2. Browser console (F12) for JavaScript errors
3. Check database credentials
4. Verify Python packages installed
5. Check file permissions
6. Review TROUBLESHOOTING.md

---

**Total Project Size:** ~400KB  
**Total Files:** 24+  
**Total Lines of Code:** 2,500+  
**Ready for Production:** ✅ YES

---

*Complete File Index - Version 1.0.0*  
*Last Updated: February 28, 2026*
