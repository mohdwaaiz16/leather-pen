const batchesModule = {
    init: async () => {
        ui.setContent(`
            <div class="page-header header-flex">
                <div>
                    <h1>Production Batches</h1>
                    <div class="subtitle">Monitor and track active leather production batches.</div>
                </div>
                <div>
                    <button class="btn btn-primary">+ New Batch</button>
                </div>
            </div>
            
            <div class="card">
                <div style="margin-bottom: 1.5rem; display:flex; gap: 1rem;">
                    <select class="form-control" style="max-width: 200px;">
                        <option value="">All Statuses</option>
                        <option value="In Production">In Production</option>
                        <option value="Awaiting Scan">Awaiting Scan</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <input type="date" class="form-control" style="max-width: 200px;">
                </div>
                <div id="batches-list">
                    <div class="empty-state">Loading batches...</div>
                </div>
            </div>
        `);
        await batchesModule.loadBatches();
    },
    
    loadBatches: async () => {
        try {
            const batches = await window.api.get('/batches');
            let html = `
                <table class="table-clickable">
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>Article</th>
                            <th>Color</th>
                            <th>Weight</th>
                            <th>Created</th>
                            <th>Production Stage</th>
                            <th>Latest ΔE</th>
                            <th>Quality Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (batches.length === 0) {
                html += `<tr><td colspan="8" class="empty-state" style="border:none;">No batches found.</td></tr>`;
            }
            batches.forEach(b => {
                let statusBadge = 'badge-neutral';
                if (b.status === 'IN PRODUCTION') statusBadge = 'badge-info';
                if (b.status === 'COMPLETED') statusBadge = 'badge-success';
                
                html += `
                    <tr onclick="window.location.href='/batch-detail.html?id=${b.id}'">
                        <td style="font-family: var(--font-mono); font-weight: 500;">${b.batch_code}</td>
                        <td><strong>${b.articles?.article_name || '-'}</strong></td>
                        <td>${b.articles?.target_color || '-'}</td>
                        <td>${b.batch_weight ? b.batch_weight + ' kg' : '—'}</td>
                        <td>${new Date(b.created_at).toLocaleDateString()}</td>
                        <td>${b.process_stage || '—'}</td>
                        <td style="color:var(--color-text-secondary)">—</td>
                        <td><span class="badge ${statusBadge}">${b.status}</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
            document.getElementById('batches-list').innerHTML = html;
        } catch (e) {
            document.getElementById('batches-list').innerHTML = `<div class="empty-state" style="color:var(--color-danger); border:none;">Error loading batches</div>`;
        }
    }
};
window.batchesModule = batchesModule;
