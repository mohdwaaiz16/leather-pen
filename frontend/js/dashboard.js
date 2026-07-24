const dashboardModule = {
    init: async () => {
        ui.setContent(`
            <div class="page-header header-flex">
                <div>
                    <h1>Production Overview</h1>
                    <div class="subtitle">Monitor color consistency, production batches and connected scanning devices.</div>
                </div>
                <div style="display:flex; gap:1rem;">
                    <button class="btn btn-secondary" onclick="window.location.href='/master-scan.html'">Start Scan</button>
                    <button class="btn btn-primary" onclick="window.location.href='/batches.html'">+ New Batch</button>
                </div>
            </div>
            
            <div class="kpi-grid" id="dashboard-kpis">
                <div class="kpi-card"><div style="height:60px; background:var(--color-bg-soft); border-radius:4px; animation: pulse 2s infinite;"></div></div>
                <div class="kpi-card"><div style="height:60px; background:var(--color-bg-soft); border-radius:4px; animation: pulse 2s infinite;"></div></div>
                <div class="kpi-card"><div style="height:60px; background:var(--color-bg-soft); border-radius:4px; animation: pulse 2s infinite;"></div></div>
                <div class="kpi-card"><div style="height:60px; background:var(--color-bg-soft); border-radius:4px; animation: pulse 2s infinite;"></div></div>
            </div>
            
            <div style="display:flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
                <div class="card" style="flex: 2; min-width: 400px; margin-bottom: 0;">
                    <div class="header-flex" style="margin-bottom: 1rem;">
                        <h3 style="margin:0;">Production Status</h3>
                        <a href="/batches.html" style="font-size:0.875rem; font-weight:500;">View All →</a>
                    </div>
                    <div id="dashboard-batches">Loading...</div>
                </div>
                
                <div class="card" style="flex: 1; min-width: 250px; margin-bottom: 0;">
                    <h3 style="margin-bottom: 1rem;">Scanner Status</h3>
                    <div id="dashboard-device">Loading...</div>
                </div>
            </div>
            
            <div class="card">
                <div class="header-flex" style="margin-bottom: 1rem;">
                    <h3 style="margin:0;">Recent Scans</h3>
                    <a href="/scans.html" style="font-size:0.875rem; font-weight:500;">View All Scans →</a>
                </div>
                <div id="dashboard-scans">Loading...</div>
            </div>
        `);
        
        await dashboardModule.loadData();
    },
    
    loadData: async () => {
        try {
            const [articles, batches, scans, devices] = await Promise.all([
                window.api.get('/articles'),
                window.api.get('/batches'),
                window.api.get('/scans'),
                window.api.get('/device')
            ]);
            
            document.getElementById('dashboard-kpis').innerHTML = `
                <div class="kpi-card">
                    <div class="kpi-label">Active Articles</div>
                    <div class="kpi-value">${articles.length}</div>
                    <div class="kpi-context">In catalog</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Batches In Production</div>
                    <div class="kpi-value">${batches.length}</div>
                    <div class="kpi-context">Currently active</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Scans Today</div>
                    <div class="kpi-value">${scans.length}</div>
                    <div class="kpi-context">Last 24 hours</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Color Pass Rate</div>
                    <div class="kpi-value" style="color:var(--color-text-muted); font-size:1.5rem; line-height: 2.25rem;">—</div>
                    <div class="kpi-context">Requires model data</div>
                </div>
            `;
            
            let batchHtml = `
                <table class="table-clickable">
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>Article</th>
                            <th>Stage</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (batches.length === 0) {
                batchHtml += `<tr><td colspan="4" class="empty-state" style="padding: 1.5rem; border:none;">No batches in production</td></tr>`;
            } else {
                batches.slice(0, 5).forEach(b => {
                    batchHtml += `
                        <tr onclick="window.location.href='/batch-detail.html?id=${b.id}'">
                            <td style="font-family: var(--font-mono); font-weight: 500;">${b.batch_code}</td>
                            <td>${b.articles?.article_name || '-'}</td>
                            <td>${b.process_stage || '-'}</td>
                            <td><span class="badge badge-neutral">${b.status}</span></td>
                        </tr>
                    `;
                });
            }
            batchHtml += `</tbody></table>`;
            document.getElementById('dashboard-batches').innerHTML = batchHtml;
            
            let scanHtml = `
                <table class="table-clickable">
                    <thead>
                        <tr>
                            <th>Scan ID</th>
                            <th>Type</th>
                            <th>Article</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (scans.length === 0) {
                scanHtml += `<tr><td colspan="4" class="empty-state" style="padding: 1.5rem; border:none;">No recent scans</td></tr>`;
            } else {
                scans.slice(0, 5).forEach(s => {
                    scanHtml += `
                        <tr onclick="window.location.href='/scan-detail.html?id=${s.id}'">
                            <td style="font-family: var(--font-mono); font-size:0.75rem; color:var(--color-text-secondary);">${s.id.substring(0,8)}...</td>
                            <td><span class="badge badge-neutral">${s.scan_type}</span></td>
                            <td>${s.articles?.article_name || '-'}</td>
                            <td>${new Date(s.captured_at).toLocaleString()}</td>
                        </tr>
                    `;
                });
            }
            scanHtml += `</tbody></table>`;
            document.getElementById('dashboard-scans').innerHTML = scanHtml;
            
            if (devices.length > 0) {
                const d = devices[0];
                const isConn = d.status === 'CONNECTED';
                document.getElementById('dashboard-device').innerHTML = `
                    <div style="font-weight: 500; font-size: 1.125rem; margin-bottom: 0.25rem;">${d.name}</div>
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem; font-family: var(--font-mono);">${d.device_code}</div>
                    <div style="margin-bottom: 1.5rem;"><span class="badge ${isConn ? 'badge-success' : 'badge-danger'}">${d.status}</span></div>
                    <div style="display:flex; justify-content:space-between; font-size: 0.875rem; border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
                        <span style="color:var(--color-text-secondary)">Firmware</span>
                        <span style="font-family: var(--font-mono);">${d.firmware_version || 'Unknown'}</span>
                    </div>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="window.location.href='/devices.html'">Open Device</button>
                `;
            } else {
                document.getElementById('dashboard-device').innerHTML = `<div class="empty-state" style="padding: 1.5rem; border:none;">No devices found</div>`;
            }
            
        } catch (e) {
            console.error(e);
            ui.setContent('<div class="empty-state" style="color:var(--color-danger)">Error loading dashboard data.</div>');
        }
    }
};
window.dashboardModule = dashboardModule;
