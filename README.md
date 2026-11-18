# Pennywise — Multi-Page Personal Finance Tracker

A responsive personal income and expense tracking website built with HTML5, CSS3 and Vanilla JavaScript (ES6+).

## Pages
- **Overview (`index.html`)** — financial summary, recent transactions and shortcuts.
- **Transactions (`transactions.html`)** — add, edit, delete, search, filter and export transaction records.
- **Insights (`insights.html`)** — income/expense comparison, category-wise spending and top expense category.

All pages share the same `localStorage` data, so transactions created on the Transactions page appear on Overview and Insights automatically.

## Features
- Live income, expense and balance calculations
- Form validation
- Browser localStorage persistence
- Edit and delete transactions
- Search and type filters
- CSV export
- Spending insights by category
- Dark/light theme preference
- Responsive desktop, tablet and mobile layouts
- Shared navigation between all pages

## Project Structure
```text
Pennywise/
├── index.html
├── transactions.html
├── insights.html
├── style.css
├── common.js
├── dashboard.js
├── transactions.js
├── insights.js
└── README.md
```

## Run locally
1. Extract the project ZIP.
2. Open the extracted folder in VS Code.
3. Open `index.html` with Live Server.
4. Use the sidebar navigation to move between pages.

No framework, package installation, backend or build step is required.

## Data storage
Transaction data and theme preference are stored in browser localStorage. Data is local to the current browser/device; export CSV backups when needed.

## AI assistance disclosure
AI tools were used for brainstorming, implementation guidance and debugging support. The student should review and understand all submitted code and be prepared to explain the page structure, shared storage, validation, DOM updates and calculations during a viva.

## Deployment
Push the project files to GitHub, then enable GitHub Pages from **Settings → Pages → Deploy from a branch → main → /(root)**. Add the published URL here.

## Author
Add your name, batch and institute details before submission.
