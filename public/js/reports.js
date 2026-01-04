const dailySales = JSON.parse(
  document.getElementById("daily-sales-data").textContent
);

const labels = dailySales.map(item => item.day);
const totals = dailySales.map(item => item.amount);

// Setup Chart.js line chart for Daily Sales
const ctx = document.getElementById('DailySalesChart').getContext('2d');
const dailySalesChart = new Chart(ctx, {
    type: 'line', 
    data: {
        labels: labels,
        datasets: [{
            label: 'المبيعات اليومية',
            data: totals,
            backgroundColor: 'rgba(60, 163, 231, 0.37)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: true,
            tension: .2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true 
            }
        }
    }
});

