const simulatorModule = {
    articleId: null,
    swatchId: null,
    articleName: 'Loading...',
    deviceId: '33333333-3333-3333-3333-333333333333',
    deviceKey: 'demo-secret-hash',
    
    init: async () => {
        const params = new URLSearchParams(window.location.search);
        simulatorModule.articleId = params.get('articleId');
        simulatorModule.swatchId = params.get('swatchId');
        
        if (simulatorModule.articleId) {
            try {
                const article = await window.api.get('/articles/' + simulatorModule.articleId);
                simulatorModule.articleName = `${article.article_code} • ${article.article_name}`;
            } catch(e) {}
        }
        
        simulatorModule.renderUI();
    },
    
    renderUI: () => {
        ui.setContent(`
            <div style="max-width: 900px; margin: 0 auto;">
                <div style="background-color: var(--color-warning-bg); color: var(--color-warning); padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; display:flex; justify-content:center; align-items:center; gap: 0.5rem; margin-bottom: 2rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    DEVICE SIMULATOR MODE — No physical sensor connected
                </div>
            
                <div class="page-header" style="text-align:center; margin-bottom: 3rem;">
                    <h1 style="margin-bottom:0.5rem;">Capture Master Standard</h1>
                    <div class="subtitle" style="font-size:1.125rem;">${simulatorModule.articleName}</div>
                </div>
                
                <div class="stepper">
                    <div class="step active" id="step1"><div class="step-circle">1</div> Prepare</div>
                    <div class="step-separator"></div>
                    <div class="step" id="step2"><div class="step-circle">2</div> Calibrate</div>
                    <div class="step-separator"></div>
                    <div class="step" id="step3"><div class="step-circle">3</div> Scan</div>
                    <div class="step-separator"></div>
                    <div class="step" id="step4"><div class="step-circle">4</div> Verify</div>
                    <div class="step-separator"></div>
                    <div class="step" id="step5"><div class="step-circle">5</div> Save</div>
                </div>
                
                <div class="card" id="sim-setup">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1.5rem;">
                        <div>
                            <div style="font-weight:600; font-size:1.125rem;">AS7341 Spectral Scanner</div>
                            <div style="color:var(--color-text-secondary); font-size:0.875rem;">Device: LAS-DEV-001</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:var(--color-success); font-weight:600; display:flex; align-items:center; gap:0.5rem;"><div style="width:8px;height:8px;background:var(--color-success);border-radius:50%;"></div> READY</div>
                            <div style="color:var(--color-text-secondary); font-size:0.875rem;">Temp: 28.5°C</div>
                        </div>
                    </div>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-bottom:2rem;">
                        <div>
                            <h4 style="margin-bottom:1rem;">Preparation Instructions:</h4>
                            <ul style="list-style-type: none; padding:0; margin:0; color: var(--color-text-secondary); font-size: 0.875rem; display:flex; flex-direction:column; gap:0.5rem;">
                                <li style="display:flex; align-items:flex-start; gap:0.5rem;"><span style="color:var(--color-primary)">•</span> Ensure scanning surface is completely clean.</li>
                                <li style="display:flex; align-items:flex-start; gap:0.5rem;"><span style="color:var(--color-primary)">•</span> Place scanner flat against approved swatch.</li>
                                <li style="display:flex; align-items:flex-start; gap:0.5rem;"><span style="color:var(--color-primary)">•</span> Apply firm, even pressure.</li>
                                <li style="display:flex; align-items:flex-start; gap:0.5rem;"><span style="color:var(--color-primary)">•</span> Avoid ambient light leakage.</li>
                            </ul>
                        </div>
                        <div style="background:var(--color-bg-soft); padding: 1.5rem; border-radius: 8px;">
                            <label style="font-size:0.875rem; font-weight:500; display:block; margin-bottom:0.5rem;">Simulation Noise Level</label>
                            <select id="sim-variation" class="form-control">
                                <option value="LOW">Low (Highly consistent)</option>
                                <option value="MEDIUM">Medium (Typical leather)</option>
                                <option value="HIGH">High (Aniline / Pull-up)</option>
                            </select>
                            <div style="font-size:0.75rem; color:var(--color-text-secondary); margin-top:0.5rem;">Adjusts variance in generated spectral data.</div>
                        </div>
                    </div>
                    
                    <div class="sim-box" id="sim-trigger">
                        <button class="btn btn-primary" style="font-size: 1.25rem; padding: 1.25rem 2.5rem; border-radius: 8px;" onclick="simulatorModule.runSimulation()">CAPTURE MASTER SCAN</button>
                    </div>
                    
                    <div class="status-console" id="sim-console"></div>
                </div>
                
                <div id="sim-result" style="display:none;">
                    <div class="card">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
                            <div>
                                <h3 style="margin-bottom:0.25rem; color:var(--color-success); display:flex; align-items:center; gap:0.5rem;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    SCAN STORED SUCCESSFULLY
                                </h3>
                                <div style="color:var(--color-text-secondary); font-size:0.875rem;" id="sim-scan-id"></div>
                            </div>
                            <div style="text-align:right; font-size:0.875rem; color:var(--color-text-secondary);">
                                <div>Reference scans: 1 / 5 recommended</div>
                            </div>
                        </div>
                        
                        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:2rem;">
                            <div>
                                <h4 style="margin-bottom:1rem;">Spectral Signature</h4>
                                <canvas id="spectralChart" height="250"></canvas>
                            </div>
                            <div>
                                <h4 style="margin-bottom:1rem;">Raw Channels</h4>
                                <table style="font-family: var(--font-mono); font-size:0.875rem; width:100%;">
                                    <tbody id="sim-data"></tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div style="margin-top:2rem; padding-top:2rem; border-top:1px solid var(--color-border); display:flex; justify-content:flex-end; gap:1rem;">
                            <button class="btn btn-secondary" onclick="window.location.reload()">Capture Another</button>
                            <a href="/article-detail.html?id=${simulatorModule.articleId}" class="btn btn-primary">Save Master Standard</a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    },
    
    log: (msg) => {
        const consoleEl = document.getElementById('sim-console');
        consoleEl.style.display = 'block';
        consoleEl.innerHTML += \`<div>> \${msg}</div>\`;
        consoleEl.scrollTop = consoleEl.scrollHeight;
    },
    
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    generateReadings: () => {
        return {
            f1: Math.floor(Math.random() * 50) + 100,
            f2: Math.floor(Math.random() * 50) + 150,
            f3: Math.floor(Math.random() * 50) + 200,
            f4: Math.floor(Math.random() * 100) + 300,
            f5: Math.floor(Math.random() * 100) + 350,
            f6: Math.floor(Math.random() * 100) + 320,
            f7: Math.floor(Math.random() * 50) + 250,
            f8: Math.floor(Math.random() * 50) + 180,
            clear: Math.floor(Math.random() * 200) + 400,
            nir: Math.floor(Math.random() * 50) + 50
        };
    },
    
    setStep: (stepNum) => {
        for(let i=1; i<=5; i++) {
            document.getElementById('step'+i).classList.remove('active');
        }
        for(let i=1; i<=stepNum; i++) {
            document.getElementById('step'+i).classList.add('active');
        }
    },
    
    runSimulation: async () => {
        document.getElementById('sim-trigger').style.display = 'none';
        
        simulatorModule.setStep(2);
        simulatorModule.log('INITIALIZING SENSOR CALIBRATION...');
        await simulatorModule.sleep(800);
        
        simulatorModule.setStep(3);
        simulatorModule.log('ILLUMINATION ACTIVE');
        await simulatorModule.sleep(800);
        simulatorModule.log('CAPTURING SPECTRAL DATA...');
        
        const spectralData = simulatorModule.generateReadings();
        await simulatorModule.sleep(1000);
        
        simulatorModule.setStep(4);
        simulatorModule.log('TRANSMITTING TO API...');
        
        let actualSwatchId = simulatorModule.swatchId;
        if (!actualSwatchId) {
            try {
                const newSwatch = await window.api.post('/master-swatches', {
                    article_id: simulatorModule.articleId,
                    swatch_code: 'MS-' + (simulatorModule.articleId ? simulatorModule.articleId.split('-')[0] : 'TEMP') + '-' + Math.floor(Math.random()*1000)
                });
                actualSwatchId = newSwatch.id;
            } catch (e) {
                simulatorModule.log('ERROR: Failed to create master swatch context');
                return;
            }
        }

        try {
            simulatorModule.setStep(5);
            const response = await fetch('/api/v1/device/scans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Device-ID': simulatorModule.deviceId,
                    'X-Device-Key': simulatorModule.deviceKey
                },
                body: JSON.stringify({
                    scan_type: 'MASTER',
                    article_id: simulatorModule.articleId,
                    master_swatch_id: actualSwatchId,
                    batch_id: null,
                    spectral: spectralData,
                    sensor_temperature: 28.5,
                    firmware_version: 'simulator-0.1',
                    captured_at: new Date().toISOString()
                })
            });
            
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'API rejected payload');
            }
            
            simulatorModule.log('SAVING COMPLETE - Scan ID: ' + result.data.scan_id);
            await simulatorModule.sleep(800);
            
            document.getElementById('sim-setup').style.display = 'none';
            document.getElementById('sim-result').style.display = 'block';
            document.getElementById('sim-scan-id').innerText = 'Scan ID: ' + result.data.scan_id;
            
            let tbody = '';
            const labels = [];
            const data = [];
            for (const [key, val] of Object.entries(spectralData)) {
                tbody += \`<tr><td style="padding:0.25rem 0; color:var(--color-text-secondary); text-transform:uppercase;">\${key}</td><td style="padding:0.25rem 0; text-align:right;">\${val}</td></tr>\`;
                if(key !== 'clear' && key !== 'nir') {
                    labels.push(key.toUpperCase());
                    data.push(val);
                }
            }
            document.getElementById('sim-data').innerHTML = tbody;
            
            // Render Chart
            const ctx = document.getElementById('spectralChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Spectral Reflectance',
                        data: data,
                        borderColor: '#2B3527',
                        backgroundColor: 'rgba(43, 53, 39, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#E2E6DF' } },
                        x: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
            
        } catch (e) {
            simulatorModule.log('ERROR: ' + e.message);
        }
    }
};
window.simulatorModule = simulatorModule;
