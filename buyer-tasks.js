/* Buyer Tasks - pre-listed: fix a bug, clean, grocery, etc. */

const TASK_ITEMS = [
  { id: 't1', title: 'Fix a bug', emoji: '🐛', category: 'Repairs', budget: 200 },
  { id: 't2', title: 'Clean house', emoji: '🧹', category: 'Cleaning', budget: 250 },
  { id: 't3', title: 'Grocery shopping', emoji: '🛒', category: 'Shopping', budget: 150 },
  { id: 't4', title: 'Document delivery', emoji: '📄', category: 'Delivery', budget: 120 },
  { id: 't5', title: 'Install app', emoji: '📱', category: 'Repairs', budget: 100 },
  { id: 't6', title: 'Move furniture', emoji: '🪑', category: 'Delivery', budget: 400 },
  { id: 't7', title: 'Pet care', emoji: '🐕', category: 'Other', budget: 180 }
];

function addTaskRequest(item) {
  const task = {
    id: 'TASK-' + Date.now(),
    title: item.title,
    description: `Need help with ${item.title}`,
    budget: item.budget,
    location: 'Your location',
    category: item.category,
    status: 'Open'
  };
  state.tasks.unshift(task);
  saveState();
  addActivity(`Task posted: ${item.title}`, 'task');
  renderBuyerTasks();
}

function renderBuyerTasks() {
  const list = document.getElementById('buyer-tasks-list');
  if (!list) return;
  if (state.tasks.length === 0) {
    list.innerHTML = '<p class="empty-state">No tasks posted. Click one above to hire!</p>';
    return;
  }
  list.innerHTML = state.tasks.slice(0, 20).map(task => {
    const statusClass = task.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="item-card">
        <div class="item-card-header">
          <span class="item-id">${task.id}</span>
          <span class="status-badge status-${statusClass}">${task.status}</span>
        </div>
        <div class="item-details">
          <p><strong>${task.title}</strong> · ${task.budget} ETB</p>
        </div>
      </div>
    `;
  }).join('');
}

function init() {
  loadState();
  const grid = document.getElementById('task-items-grid');
  if (grid) {
    grid.innerHTML = TASK_ITEMS.map(item => `
      <button class="item-card clickable" data-id="${item.id}" type="button">
        <span class="item-emoji">${item.emoji}</span>
        <span class="item-name">${item.title}</span>
        <span class="item-meta">${item.category} · ${item.budget} ETB</span>
      </button>
    `).join('');
    grid.querySelectorAll('button').forEach(btn => {
      const id = btn.dataset.id;
      const item = TASK_ITEMS.find(i => i.id === id);
      if (item) btn.addEventListener('click', () => addTaskRequest(item));
    });
  }
  renderBuyerTasks();
}

document.addEventListener('DOMContentLoaded', init);
