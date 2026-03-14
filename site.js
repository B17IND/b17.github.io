(async function () {
  const rows = document.getElementById('rows');
  const filter = document.getElementById('filter');
  const updatedEl = document.getElementById('last-updated');

  // This file will be written by the GitHub Action
  const url = './data/earnings.json';

  try {
    const resp = await fetch(url, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const payload = await resp.json();

    const data = payload.data || []; // [{date, symbol, epsEstimated, revenueEstimated, ...}]
    const lastUpdated = payload.generatedAt || new Date().toISOString();
    updatedEl.textContent = `Last updated: ${new Date(lastUpdated).toLocaleString()}`;

    function render(list) {
      rows.innerHTML = list.map(item => `
        <tr>
          <td>${item.date}</td>
          <td>${item.symbol}</td>
          <td>${item.epsEstimated ?? ''}</td>
          <td>${item.revenueEstimated ? item.revenueEstimated.toLocaleString() : ''}</td>
        </tr>
      `).join('') || `<tr><td colspan="4">No results</td></tr>`;
    }

    render(data);

    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      if (!q) return render(data);
      render(data.filter(d => d.symbol.toLowerCase().includes(q)));
    });

  } catch (err) {
    rows.innerHTML = `<tr><td colspan="4">Failed to load data: ${err.message}</td></tr>`;
  }
})();
