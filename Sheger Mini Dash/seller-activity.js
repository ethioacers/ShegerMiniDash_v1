/* Seller Activity Log */

function render() {
  const list = document.getElementById('activity-log');
  if (!list) return;
  const log = loadActivityLog();
  if (log.length === 0) {
    list.innerHTML = '<p class="empty-state">No activity yet</p>';
    return;
  }
  list.innerHTML = log.map(e => `
    <div class="activity-item ${e.type || 'general'}">
      ${e.message}
      <span class="activity-time">${e.time}</span>
    </div>
  `).join('');
}

function init() {
  loadState();
  render();
  setInterval(() => { runSimulation(); render(); }, 20000);
}

document.addEventListener('DOMContentLoaded', init);
