/* Seller Dashboard */

function setGreeting() {
  const h = new Date().getHours();
  let g = 'Good morning!';
  if (h >= 12 && h < 17) g = 'Good afternoon!';
  else if (h >= 17) g = 'Good evening!';
  const el = document.getElementById('greeting');
  if (el) el.textContent = g;
}

function updateCounters() {
  const activeFood = state.foodOrders.filter(o => o.status !== 'Delivered').length;
  const activePackage = state.packages.filter(p => p.status !== 'Delivered').length;
  const activeTask = state.tasks.filter(t => t.status !== 'Completed').length;
  document.getElementById('active-food-count').textContent = activeFood;
  document.getElementById('active-package-count').textContent = activePackage;
  document.getElementById('active-task-count').textContent = activeTask;
  document.getElementById('completed-today-count').textContent = state.completedToday;
  document.getElementById('total-revenue').textContent = Math.round(state.totalRevenue);
}

function renderActivityPreview() {
  const preview = document.getElementById('activity-preview');
  if (!preview) return;
  const log = loadActivityLog();
  const recent = log.slice(0, 3);
  if (recent.length === 0) preview.innerHTML = '<p class="empty-state">No activity yet</p>';
  else preview.innerHTML = recent.map(e => `<div class="activity-preview-item">${e.message} · ${e.time}</div>`).join('');
}

function init() {
  loadState();
  setGreeting();
  updateCounters();
  renderActivityPreview();
  setInterval(() => { runSimulation(); updateCounters(); renderActivityPreview(); }, 20000);
}

document.addEventListener('DOMContentLoaded', init);
