// Load existing expenses
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Add Expense
document.getElementById('addExpenseBtn').addEventListener('click', () => {
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!description || isNaN(amount) || !category || !date) {
    alert("Please fill all fields correctly!");
    return;
  }

  const expense = {
    description,
    amount,
    category,
    date
  };

  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  loadExpenses();
  clearForm();
});

// Clear form after adding
function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').selectedIndex = 0;
  document.getElementById('date').value = '';
}

// Load Expenses
function loadExpenses(filteredExpenses = expenses) {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';

  let today = new Date().toISOString().slice(0, 10);
  let month = new Date().toISOString().slice(0, 7);

  let todayTotal = 0;
  let monthTotal = 0;

  filteredExpenses.forEach((exp, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${exp.description}</td>
      <td>₹${exp.amount.toFixed(2)}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td><button onclick="deleteExpense(${index})">🗑️ Delete</button></td>
    `;

    expenseList.appendChild(tr);

    if (exp.date === today) {
      todayTotal += exp.amount;
    }
    if (exp.date.startsWith(month)) {
      monthTotal += exp.amount;
    }
  });

  document.getElementById('todayTotal').innerText = todayTotal.toFixed(2);
  document.getElementById('monthTotal').innerText = monthTotal.toFixed(2);

  updateChart(filteredExpenses);
}

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  loadExpenses();
}

// Filter Expenses by Date
function filterExpenses() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  if (!start || !end) {
    alert('Please select both start and end date.');
    return;
  }

  const filtered = expenses.filter(exp => exp.date >= start && exp.date <= end);
  loadExpenses(filtered);
}

// Clear Filter
function clearFilter() {
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  loadExpenses();
}

// Chart
let chart;
function updateChart(expenseData) {
  const categoryTotals = {};

  expenseData.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });

  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#FF5722', '#795548'],
      }]
    },
    options: {
      responsive: true,
    }
  });
}

// Initialize
loadExpenses();

