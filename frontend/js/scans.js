const scansModule = {
    init: async () => {
        ui.setContent(`
            <div class="page-header header-flex">
                <div>
                    <h1>Scan History</h1>
                    <div class="subtitle">Complete database of all captured spectral scans.</div>
                </div>
            </div>
            
            <div class="card">
                <div style="margin-bottom: 1.5rem; display:flex; gap: 1rem;">
                    <select class="form-control" style="max-width: 200px;">
                        <option value="">All Scan Types</option>
                        <option value="MASTER">Master Standard</option>
                        <option value="BATCH">Batch Production</option>
                    </select>
                    <select class="form-control" style="max-width: 200px;">
                        <option value="">All Results</option>
                        <option value="PASS">Pass</option>
                        <option value="WARNING">Warning</option>
                        <option value="FAIL">Fail</option>
                    </select>
                </div>
                <div id="scans-list">
                    <div class="empty-state">Loading scans...</div>
                </div>
            </div>
        `);
        await scansModule.loadScans();
    },
    
    loadScans: async () => {
        try {
            const scans = await window.api.get('/scans');
            let html = `
                <table class="table-clickable">
                    <thead>
                        <tr>
                            <th>Scan ID</th>
                            <th>Type</th>
                            <th>Article</th>
                            <th>Batch</th>
                            <th>Device</th>
                            <th>Captured At</th>
                            <th>ΔE</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (scans.length === 0) {
                html += `<tr><td colspan="8" class="empty-state" style="border:none;">No scans found.</td></tr>`;
            }
            scans.forEach(s => {
                let articleName = s.articles?.article_name || '-';
                let deviceName = s.devices?.name || s.device_id.substring(0,8);
                
                html += `
                    <tr onclick="window.location.href='/scan-detail.html?id=${s.id}'">
                        <td style="font-family:var(--font-mono); font-size:0.75rem; color:var(--color-text-secondary);">${s.id.substring(0,8)}...</td>
                        <td><span class="badge ${s.scan_type === 'MASTER' ? 'badge-info' : 'badge-neutral'}">${s.scan_type}</span></td>
                        <td><strong>${articleName}</strong></td>
                        <td>${s.batch_id ? 'BATCH' : '—'}</td>
                        <td>${deviceName}</td>
                        <td>${new Date(s.captured_at).toLocaleString()}</td>
                        <td style="color:var(--color-text-secondary)">—</td>
                        <td><span class="badge badge-success">SAVED</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
            document.getElementById('scans-list').innerHTML = html;
        } catch (e) {
            document.getElementById('scans-list').innerHTML = `<div class="empty-state" style="color:var(--color-danger); border:none;">Error loading scans</div>`;
        }
    }
};
window.scansModule = scansModule;
