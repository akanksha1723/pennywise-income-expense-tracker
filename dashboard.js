'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const items = getTransactions();
  const totals = calculateTotals(items);
  document.getElementById('balance-value').textContent = formatCurrency(totals.balance);
  document.getElementById('income-value').textContent = formatCurrency(totals.income);
  document.getElementById('expense-value').textContent = formatCurrency(totals.expenses);
  document.getElementById('today-label').textContent = new Intl.DateTimeFormat('en-IN', { weekday:'long', day:'numeric', month:'long' }).format(new Date()).toUpperCase();
  const list = document.getElementById('recent-list');
  const empty = document.getElementById('recent-empty');
  const recent = [...items].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
  if (recent.length) {
    empty.classList.add('hidden');
    recent.forEach(item => {
      const row = document.createElement('div'); row.className = 'recent-row';
      const icon = document.createElement('span'); icon.className = `transaction-symbol ${item.type}`; icon.textContent = item.type === 'income' ? '↗' : '↘';
      const info = document.createElement('div'); info.className = 'transaction-info';
      const title = document.createElement('strong'); title.textContent = item.description;
      const meta = document.createElement('small'); meta.textContent = `${item.category} · ${formatDate(item.date)}`; info.append(title,meta);
      const amount = document.createElement('b'); amount.className = `transaction-amount ${item.type}`; amount.textContent = `${item.type === 'income' ? '+' : '−'}${formatCurrency(item.amount)}`;
      row.append(icon,info,amount); list.append(row);
    });
  } else empty.classList.remove('hidden');
});
