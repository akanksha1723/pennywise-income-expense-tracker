'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('transaction-form');
    const description = document.getElementById('description');
    const amount = document.getElementById('amount');
    const type = document.getElementById('type');
    const category = document.getElementById('category');
    const date = document.getElementById('date');

    const id = document.getElementById('transaction-id');
    const list = document.getElementById('transaction-list');

    const search = document.getElementById('search-input');
    const filter = document.getElementById('filter-type');

    let items = getTransactions();

    const today = () => {
        const d = new Date();

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    date.value = today();


    // DISPLAY ERRORS
    function setError(field, message) {
        document.getElementById(`${field}-error`).textContent = message;
    }

    function clearErrors() {
        ['description', 'amount', 'date'].forEach(field => {
            setError(field, '');
        });
    }


    // UPDATE SUMMARY CARDS
    function totals() {
        const t = calculateTotals(items);

        document.getElementById('balance-value').textContent =
            formatCurrency(t.balance);

        document.getElementById('income-value').textContent =
            formatCurrency(t.income);

        document.getElementById('expense-value').textContent =
            formatCurrency(t.expenses);
    }


    // RESET FORM
    function resetForm() {
        form.reset();

        id.value = '';
        date.value = today();

        document.getElementById('form-heading').textContent =
            'Add a transaction';

        document.getElementById('submit-button').textContent =
            '＋ Save transaction';

        document.getElementById('cancel-edit').classList.add('hidden');

        clearErrors();
    }


    // VALIDATE FORM
    function validate() {
        clearErrors();

        let valid = true;
        const value = Number(amount.value);

        if (!description.value.trim()) {
            setError('description', 'Please enter a description.');
            valid = false;
        }

        if (!amount.value || !Number.isFinite(value) || value <= 0) {
            setError('amount', 'Enter an amount greater than ₹0.');
            valid = false;
        }

        if (!date.value) {
            setError('date', 'Please select a date.');
            valid = false;
        } else if (date.value > today()) {
            setError('date', 'Date cannot be in the future.');
            valid = false;
        }

        return valid;
    }


    // ADD OR UPDATE TRANSACTION
    form.addEventListener('submit', event => {

        event.preventDefault();

        if (!validate()) return;

        const oldId = id.value;

        const entry = {
            id: oldId || (
                crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}`
            ),

            description: description.value.trim(),

            amount: Number(Number(amount.value).toFixed(2)),

            type: type.value,

            category: category.value,

            date: date.value
        };

        if (oldId) {

            items = items.map(item =>
                item.id === oldId ? entry : item
            );

            showToast('Transaction updated.');

        } else {

            items.push(entry);

            showToast('Transaction added.');
        }

        saveTransactions(items);

        resetForm();
        render();
    });


    // EDIT TRANSACTION
    function editTransaction(transactionId) {

        const item = items.find(entry => entry.id === transactionId);

        if (!item) return;

        id.value = item.id;
        description.value = item.description;
        amount.value = item.amount;
        type.value = item.type;
        category.value = item.category;
        date.value = item.date;

        document.getElementById('form-heading').textContent =
            'Edit transaction';

        document.getElementById('submit-button').textContent =
            'Save changes';

        document.getElementById('cancel-edit').classList.remove('hidden');

        document.getElementById('add-transaction').scrollIntoView({
            behavior: 'smooth'
        });

        description.focus();
    }


    // DELETE TRANSACTION
    function deleteTransaction(transactionId) {

        const item = items.find(entry => entry.id === transactionId);

        if (
            !item ||
            !confirm(`Delete "${item.description}"? This cannot be undone.`)
        ) return;

        items = items.filter(entry => entry.id !== transactionId);

        saveTransactions(items);

        if (id.value === transactionId) {
            resetForm();
        }

        render();

        showToast('Transaction deleted.');
    }


    // RENDER TRANSACTIONS
    function render() {

        list.replaceChildren();

        const query = search.value.trim().toLowerCase();

        const visible = [...items]
            .filter(item =>
                filter.value === 'all' || item.type === filter.value
            )
            .filter(item =>
                `${item.description} ${item.category}`
                    .toLowerCase()
                    .includes(query)
            )
            .sort((a, b) => b.date.localeCompare(a.date));

        document.getElementById('transaction-count').textContent =
            `${items.length} ${items.length === 1 ? 'record' : 'records'}`;

        document.getElementById('showing-label').textContent =
            `Showing ${visible.length} of ${items.length} transactions`;


        if (!visible.length) {

            const empty = document.createElement('div');
            empty.className = 'empty-state';

            const icon = document.createElement('div');
            icon.className = 'empty-illustration';
            icon.textContent = items.length ? '⌕' : '↗';

            const heading = document.createElement('strong');

            heading.textContent = items.length
                ? 'No matching transactions'
                : 'No transactions yet';

            const p = document.createElement('p');

            p.textContent = items.length
                ? 'Try changing your search or filter.'
                : 'Add your first transaction using the form.';

            empty.append(icon, heading, p);

            list.append(empty);

            totals();

            return;
        }


        visible.forEach(item => {

            const row = document.createElement('div');
            row.className = 'transaction-item';

            const symbol = document.createElement('div');

            symbol.className = `transaction-symbol ${item.type}`;

            symbol.textContent =
                item.type === 'income' ? '↗' : '↘';


            const info = document.createElement('div');
            info.className = 'transaction-info';

            const title = document.createElement('strong');
            title.textContent = item.description;

            const meta = document.createElement('small');

            meta.textContent =
                `${item.category} · ${formatDate(item.date)}`;

            info.append(title, meta);


            const money = document.createElement('div');

            money.className = `transaction-amount ${item.type}`;

            money.textContent =
                `${item.type === 'income' ? '+' : '−'}${formatCurrency(item.amount)}`;


            const actions = document.createElement('div');
            actions.className = 'item-actions';


            const edit = document.createElement('button');

            edit.type = 'button';
            edit.textContent = '✎';
            edit.title = 'Edit transaction';

            edit.setAttribute(
                'aria-label',
                `Edit ${item.description}`
            );

            edit.addEventListener('click', () => {
                editTransaction(item.id);
            });


            const del = document.createElement('button');

            del.type = 'button';
            del.textContent = '×';
            del.title = 'Delete transaction';

            del.setAttribute(
                'aria-label',
                `Delete ${item.description}`
            );

            del.addEventListener('click', () => {
                deleteTransaction(item.id);
            });


            actions.append(edit, del);

            row.append(symbol, info, money, actions);

            list.append(row);
        });

        totals();
    }


    // GENERATE 100 DEMO TRANSACTIONS
    
function generate100Transactions() {

    const incomeData = [
        { description: 'Monthly salary', category: 'Salary', min: 28000, max: 32000 },
        { description: 'Freelance project', category: 'Freelance', min: 4000, max: 7000 },
        { description: 'Monthly allowance', category: 'Allowance', min: 2500, max: 4000 },
        { description: 'Freelance payment', category: 'Freelance', min: 3000, max: 6000 },
        { description: 'Monthly salary', category: 'Salary', min: 28000, max: 32000 },
        { description: 'Gift received', category: 'Other', min: 1000, max: 2500 },
        { description: 'Monthly allowance', category: 'Allowance', min: 2500, max: 4000 },
        { description: 'Freelance project', category: 'Freelance', min: 4000, max: 7000 },
        { description: 'Monthly salary', category: 'Salary', min: 28000, max: 32000 },
        { description: 'Cashback received', category: 'Other', min: 300, max: 1000 },
        { description: 'Monthly allowance', category: 'Allowance', min: 2500, max: 4000 },
        { description: 'Freelance payment', category: 'Freelance', min: 3000, max: 6000 },
        { description: 'Bonus received', category: 'Other', min: 1000, max: 2500 },
        { description: 'Monthly allowance', category: 'Allowance', min: 2500, max: 4000 },
        { description: 'Freelance project', category: 'Freelance', min: 4000, max: 7000 }
    ];

    const expenseData = [
        { description: 'Grocery shopping', category: 'Food', min: 300, max: 1200 },
        { description: 'Restaurant bill', category: 'Food', min: 200, max: 900 },
        { description: 'Cab fare', category: 'Transport', min: 100, max: 500 },
        { description: 'Fuel expenses', category: 'Transport', min: 400, max: 1200 },
        { description: 'Online shopping', category: 'Shopping', min: 300, max: 1500 },
        { description: 'Clothing purchase', category: 'Shopping', min: 500, max: 1800 },
        { description: 'College supplies', category: 'Education', min: 200, max: 900 },
        { description: 'Books purchase', category: 'Education', min: 300, max: 1000 },
        { description: 'Electricity bill', category: 'Bills', min: 500, max: 1500 },
        { description: 'Internet bill', category: 'Bills', min: 400, max: 900 },
        { description: 'Medical expenses', category: 'Health', min: 200, max: 1000 },
        { description: 'Pharmacy purchase', category: 'Health', min: 150, max: 700 },
        { description: 'Movie tickets', category: 'Other', min: 200, max: 600 },
        { description: 'Personal expenses', category: 'Other', min: 200, max: 800 }
    ];

    const demoTransactions = [];

    function randomAmount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomDate() {
        const d = new Date();

        d.setDate(
            d.getDate() - Math.floor(Math.random() * 90)
        );

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function createId(index) {
        return crypto.randomUUID
            ? crypto.randomUUID()
            : `demo-${Date.now()}-${index}`;
    }

    // Generate 15 income transactions
    incomeData.forEach((item, index) => {

        demoTransactions.push({
            id: createId(index),
            description: item.description,
            amount: randomAmount(item.min, item.max),
            type: 'income',
            category: item.category,
            date: randomDate()
        });

    });

    // Generate 85 expense transactions
    for (let i = 0; i < 85; i++) {

        const item = expenseData[
            Math.floor(Math.random() * expenseData.length)
        ];

        demoTransactions.push({
            id: createId(i + 15),
            description: item.description,
            amount: randomAmount(item.min, item.max),
            type: 'expense',
            category: item.category,
            date: randomDate()
        });

    }

    // Shuffle transactions so income and expenses are mixed
    demoTransactions.sort(() => Math.random() - 0.5);

    // Calculate demo income and expense totals
    const demoIncome = demoTransactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const demoExpenses = demoTransactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    // Keep demo expenses below demo income
    const expenseLimit = demoIncome * 0.75;

    if (demoExpenses > expenseLimit) {

        const scale = expenseLimit / demoExpenses;

        demoTransactions.forEach(item => {

            if (item.type === 'expense') {
                item.amount = Math.max(
                    1,
                    Math.floor(item.amount * scale)
                );
            }

        });

    }

    // Add generated records to existing transactions
    items = [...items, ...demoTransactions];

    saveTransactions(items);

    render();

    showToast('100 balanced demo transactions generated successfully!');
  }


    // CONNECT GENERATE BUTTON
    const generateButton = document.getElementById('generate-demo-button');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const confirmed = confirm(
                'Generate 100 sample transactions? They will be added to your existing transactions.'
            );

            if (confirmed) {
                generate100Transactions();
            }
        });
    }


    // CANCEL EDITING
    document.getElementById('cancel-edit').addEventListener('click', resetForm);


    // SEARCH AND FILTER
    search.addEventListener('input', render);
    filter.addEventListener('change', render);


    // EXPORT CSV
    document.getElementById('export-button').addEventListener('click', () => {

        if (!items.length) {
            showToast('There are no transactions to export.');
            return;
        }

        const rows = [
            ['Description', 'Amount (INR)', 'Type', 'Category', 'Date'],
            ...items.map(i => [
                i.description,
                i.amount,
                i.type,
                i.category,
                i.date
            ])
        ];

        const csv = rows.map(row =>
            row.map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(',')
        ).join('\n');

        const url = URL.createObjectURL(
            new Blob(['\uFEFF' + csv], {
                type: 'text/csv;charset=utf-8;'
            })
        );

        const link = document.createElement('a');
        link.href = url;
        link.download = 'pennywise-transactions.csv';
        link.click();

        URL.revokeObjectURL(url);

        showToast('CSV downloaded.');
    });


    // INITIAL DISPLAY
    totals();
    render();

});
