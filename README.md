# Pennywise — Personal Finance Tracker

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
├── .gitignore
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

## Run Locally

1. Open the Pennywise project folder in VS Code.
2. Open `index.html` with Live Server.
3. Use the sidebar navigation to move between pages.

No framework, package installation, backend or build step is required.

## Data Storage

Transaction data and theme preference are stored in browser localStorage. Data is local to the current browser/device; export CSV backups when needed.

## AI Assistance Disclosure

AI tools were used for brainstorming, implementation guidance and debugging support. The student should review and understand all submitted code and be prepared to explain the page structure, shared storage, validation, DOM updates and calculations during a viva.

## Deployment

Push the project files to GitHub, then enable GitHub Pages from **Settings → Pages → Deploy from a branch → main → /(root)**. Add the published URL here.

## Author

**Akanksha Raj**

- Course: Master of Computer Applications (MCA)
- Batch: 2027
- Institute: G.L. Bajaj Institute of Technology and Management
