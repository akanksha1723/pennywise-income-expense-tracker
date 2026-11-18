'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const items=getTransactions(), totals=calculateTotals(items);
  document.getElementById('balance-value').textContent=formatCurrency(totals.balance);
  document.getElementById('income-value').textContent=formatCurrency(totals.income);
  document.getElementById('expense-value').textContent=formatCurrency(totals.expenses);
  document.getElementById('chart-income').textContent=formatCurrency(totals.income);
  document.getElementById('chart-expense').textContent=formatCurrency(totals.expenses);
  const max=Math.max(totals.income,totals.expenses,1);
  document.getElementById('income-bar').style.width=`${totals.income/max*100}%`;
  document.getElementById('expense-bar').style.width=`${totals.expenses/max*100}%`;
  document.getElementById('chart-note').textContent=items.length?`Your balance is ${formatCurrency(totals.balance)} across ${items.length} transactions.`:'Add transactions to see your financial overview.';
  document.getElementById('transaction-total').textContent=items.length;
  const groups=items.filter(item=>item.type==='expense').reduce((out,item)=>{out[item.category]=(out[item.category]||0)+Number(item.amount);return out;},{});
  const sorted=Object.entries(groups).sort((a,b)=>b[1]-a[1]);
  const categoryList=document.getElementById('category-list'), empty=document.getElementById('category-empty');
  if(sorted.length){
    empty.classList.add('hidden');
    sorted.forEach(([name,value])=>{
      const row=document.createElement('div');row.className='category-row';
      const top=document.createElement('div');top.className='category-row-top';
      const label=document.createElement('strong');label.textContent=name;
      const amount=document.createElement('b');amount.textContent=formatCurrency(value);top.append(label,amount);
      const track=document.createElement('div');track.className='bar-track';
      const bar=document.createElement('div');bar.className='bar-fill expense-fill';bar.style.width=`${value/totals.expenses*100}%`;track.append(bar);
      row.append(top,track);categoryList.append(row);
    });
    document.getElementById('top-category').textContent=sorted[0][0];
    document.getElementById('top-category-detail').textContent=`${formatCurrency(sorted[0][1])} spent in this category.`;
  } else {
    empty.classList.remove('hidden');
    document.getElementById('top-category').textContent='No data yet';
    document.getElementById('top-category-detail').textContent='Your top expense category will appear here.';
  }
});
