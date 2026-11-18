'use strict';
const STORAGE_KEY = 'pennywise_transactions_v1';
const THEME_KEY = 'pennywise_theme_v1';

function getTransactions() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data.filter(item => item && typeof item.id === 'string' &&
      typeof item.description === 'string' && Number.isFinite(Number(item.amount)) &&
      ['income', 'expense'].includes(item.type)) : [];
  } catch (error) { console.error('Could not read saved data:', error); return []; }
}
function saveTransactions(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return true; }
  catch (error) { console.error('Could not save data:', error); showToast('Unable to save data in this browser.'); return false; }
}
function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
}
function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}
function calculateTotals(items = getTransactions()) {
  return items.reduce((total, item) => {
    if (item.type === 'income') total.income += Number(item.amount);
    else total.expenses += Number(item.amount);
    total.balance = total.income - total.expenses;
    return total;
  }, { income: 0, expenses: 0, balance: 0 });
}
function showToast(message) {
  const element = document.getElementById('toast');
  if (!element) return;
  element.textContent = message; element.classList.add('show');
  clearTimeout(window.pennywiseToastTimer);
  window.pennywiseToastTimer = setTimeout(() => element.classList.remove('show'), 2500);
}
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const button = document.getElementById('theme-toggle');
  if (button) { button.textContent = theme === 'dark' ? '☀' : '☾'; button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }
}
function initializeShared() {
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(theme); localStorage.setItem(THEME_KEY, theme);
  });
}
document.addEventListener('DOMContentLoaded', initializeShared);
