const devicesModule = {
    init: async () => {
        ui.setContent(`
            <div class="page-header header-flex">
                <div>
                    <h1>Devices</h1>
                    <div class="subtitle">Manage hardware spectral scanners and their calibration status.</div>
                </div>
            </div>
            
            <div id="devices-list">
                <div class="empty-state">Loading devices...</div>
            </div>
        `);
        await devicesModule.loadDevices();
    },
    
    loadDevices: async () => {
        try {
            const devices = await window.api.get('/device');
            let html = ``;
            
            if (devices.length === 0) {
                html = `<div class="empty-state">No devices found.</div>`;
            } else {
                html = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">`;
                devices.forEach(d => {
                    let isConn = d.status === 'CONNECTED';
                    html += `
                        <div class="card" style="margin-bottom:0;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 1rem;">
                                <div>
                                    <h3 style="margin-bottom:0.25rem;">${d.name}</h3>
                                    <div style="font-family:var(--font-mono); font-size:0.875rem; color:var(--color-text-secondary);">${d.device_code}</div>
                                </div>
                                <span class="badge ${isConn ? 'badge-success' : 'badge-danger'}">${d.status}</span>
                            </div>
                            
                            <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.875rem; margin-bottom: 1.5rem;">
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:var(--color-text-secondary)">Sensor</span>
                                    <strong>AS7341 Spectral Scanner</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:var(--color-text-secondary)">Firmware</span>
                                    <strong>${d.firmware_version || '—'}</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:var(--color-text-secondary)">Last Seen</span>
                                    <strong>Just now</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:var(--color-text-secondary)">Calibration Status</span>
                                    <strong>Valid</strong>
                                </div>
                            </div>
                            
                            <div style="display:flex; gap:1rem; border-top: 1px solid var(--color-border); padding-top: 1rem;">
                                <button class="btn btn-secondary" style="flex:1;">Test Connection</button>
                                <a href="/calibration.html" class="btn btn-primary" style="flex:1;">Calibrate</a>
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            }
            
            document.getElementById('devices-list').innerHTML = html;
        } catch (e) {
            document.getElementById('devices-list').innerHTML = `<div class="empty-state" style="color:var(--color-danger)">Error loading devices</div>`;
        }
    }
};
window.devicesModule = devicesModule;
