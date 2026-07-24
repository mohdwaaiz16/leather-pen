const ui = {
    renderShell: (title) => {
        auth.checkAuth();
        const user = JSON.parse(localStorage.getItem('user'));
        
        document.body.innerHTML = `
            <div class="app-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <div class="brand">LEATHER INTELLIGENCE</div>
                        <div class="subtitle">PRODUCTION OS</div>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="/index.html" id="nav-dashboard">Dashboard</a>
                        
                        <div class="sidebar-nav-section">Production</div>
                        <a href="/articles.html" id="nav-articles">Articles</a>
                        <a href="/batches.html" id="nav-batches">Batches</a>
                        
                        <div class="sidebar-nav-section">Quality</div>
                        <a href="/scans.html" id="nav-scans">Scan History</a>
                        
                        <div class="sidebar-nav-section">System</div>
                        <a href="/devices.html" id="nav-devices">Devices</a>
                        <a href="/calibration.html" id="nav-calibration">Calibration</a>
                        <a href="/intelligence.html" id="nav-intelligence">Intelligence</a>
                        
                        <div class="sidebar-nav-section">Preferences</div>
                        <a href="/settings.html" id="nav-settings">Settings</a>
                        <a href="#" id="nav-help">Help / Docs</a>
                    </nav>
                    <div class="sidebar-footer">
                        <a href="#" onclick="auth.logout()" style="color:rgba(255,255,255,0.7); display:block;">Logout</a>
                    </div>
                </aside>
                <main class="main-content">
                    <header class="topbar">
                        <div class="topbar-left">
                            <div class="breadcrumb">Overview <span>/</span> <span style="color:var(--color-text)">${title}</span></div>
                        </div>
                        <div class="topbar-right">
                            <div class="device-indicator">
                                <div class="dot"></div>
                                Scanner Connected
                            </div>
                            <div class="user-profile">
                                ${user?.organizations?.name || 'Demo Tannery'}
                                <span style="color:var(--color-border)">|</span>
                                ${user?.full_name || 'Demo Operator'}
                            </div>
                        </div>
                    </header>
                    <div class="content-wrapper" id="app-content">
                    </div>
                </main>
            </div>
        `;
        
        const path = window.location.pathname;
        let navId = 'nav-dashboard';
        if (path.includes('article')) navId = 'nav-articles';
        else if (path.includes('batch')) navId = 'nav-batches';
        else if (path.includes('scan') && !path.includes('master-scan')) navId = 'nav-scans';
        else if (path.includes('device')) navId = 'nav-devices';
        else if (path.includes('calibration')) navId = 'nav-calibration';
        else if (path.includes('intelligence')) navId = 'nav-intelligence';
        else if (path.includes('settings')) navId = 'nav-settings';
        
        const navEl = document.getElementById(navId);
        if (navEl) navEl.classList.add('active');
    },
    
    setContent: (html) => {
        document.getElementById('app-content').innerHTML = html;
    }
};
window.ui = ui;
