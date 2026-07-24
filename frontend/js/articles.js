const articlesModule = {
    init: async () => {
        ui.setContent(`
            <div class="page-header header-flex">
                <div>
                    <h1>Articles</h1>
                    <div class="subtitle">Manage leather articles and their master color standards.</div>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="articlesModule.showCreateForm()">+ New Article</button>
                </div>
            </div>
            
            <div id="articles-content">
                <div class="card" id="articles-list-container">
                    <div style="margin-bottom: 1rem; display:flex; gap: 1rem;">
                        <input type="text" class="form-control" style="max-width: 300px;" placeholder="Search articles...">
                        <select class="form-control" style="max-width: 200px;">
                            <option value="">All Leather Types</option>
                            <option value="Cowhide">Cowhide</option>
                            <option value="Calf">Calf</option>
                            <option value="Sheep">Sheep</option>
                        </select>
                    </div>
                    <div id="articles-list">
                        <div class="empty-state">Loading articles...</div>
                    </div>
                </div>
            </div>
            
            <!-- Create Article Modal -->
            <div id="create-article-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(28, 33, 26, 0.6); z-index:100; justify-content:center; align-items:center; padding: 2rem;">
                <div class="card" style="width: 800px; max-width: 100%; max-height: 90vh; overflow-y: auto; margin:0; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                    <h2 style="margin-bottom: 2rem;">Create New Article</h2>
                    
                    <form onsubmit="event.preventDefault(); articlesModule.createArticle();">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
                            <!-- Basic Information -->
                            <div>
                                <h4 style="margin-bottom: 1.5rem; color:var(--color-text-secondary); border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.05em;">Basic Information</h4>
                                <div class="form-group">
                                    <label>Article Code *</label>
                                    <input type="text" id="article_code" class="form-control" required placeholder="e.g. ART-001">
                                </div>
                                <div class="form-group">
                                    <label>Article Name *</label>
                                    <input type="text" id="article_name" class="form-control" required placeholder="e.g. Classic Brown">
                                </div>
                                <div class="form-group">
                                    <label>Customer (Optional)</label>
                                    <input type="text" id="customer_name" class="form-control">
                                </div>
                            </div>
                            
                            <!-- Leather Specification -->
                            <div>
                                <h4 style="margin-bottom: 1.5rem; color:var(--color-text-secondary); border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.05em;">Leather Specification</h4>
                                <div class="form-group">
                                    <label>Leather Type *</label>
                                    <select id="leather_type" class="form-control" required>
                                        <option value="Cowhide">Cowhide</option>
                                        <option value="Calf">Calf</option>
                                        <option value="Sheep">Sheep</option>
                                        <option value="Goat">Goat</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Thickness (mm) *</label>
                                    <input type="text" id="thickness" class="form-control" required placeholder="e.g. 1.2-1.4">
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 1.5rem;">
                            <!-- Color Standard -->
                            <h4 style="margin-bottom: 1.5rem; color:var(--color-text-secondary); border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.05em;">Color Standard</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
                                <div class="form-group">
                                    <label>Target Color Name *</label>
                                    <input type="text" id="target_color" class="form-control" required placeholder="e.g. Dark Walnut">
                                </div>
                                <div class="form-group">
                                    <label>Color Reference / Code (Optional)</label>
                                    <input type="text" id="color_reference" class="form-control" placeholder="e.g. PANTONE 19-1234">
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
                            <button type="button" class="btn btn-secondary" onclick="articlesModule.hideCreateForm()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Create Article</button>
                        </div>
                    </form>
                </div>
            </div>
        `);
        
        await articlesModule.loadArticles();
    },
    
    loadArticles: async () => {
        try {
            const articles = await window.api.get('/articles');
            let html = `
                <table class="table-clickable">
                    <thead>
                        <tr>
                            <th>Article Code</th>
                            <th>Article Name</th>
                            <th>Leather Type</th>
                            <th>Target Color</th>
                            <th>Last Updated</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (articles.length === 0) {
                html += `<tr><td colspan="6" class="empty-state" style="border:none;">No articles found. Create one to get started.</td></tr>`;
            } else {
                articles.forEach(a => {
                    html += `
                        <tr onclick="window.location.href='/article-detail.html?id=${a.id}'">
                            <td style="font-family: var(--font-mono); font-weight: 500;">${a.article_code}</td>
                            <td><strong>${a.article_name}</strong></td>
                            <td>${a.leather_type}</td>
                            <td>${a.target_color || '-'}</td>
                            <td>${new Date(a.updated_at).toLocaleDateString()}</td>
                            <td><span class="badge badge-success">ACTIVE</span></td>
                        </tr>
                    `;
                });
            }
            html += `</tbody></table>`;
            document.getElementById('articles-list').innerHTML = html;
        } catch (e) {
            document.getElementById('articles-list').innerHTML = `<div class="empty-state" style="color:var(--color-danger); border:none;">Error loading articles</div>`;
        }
    },
    
    showCreateForm: () => {
        document.getElementById('create-article-modal').style.display = 'flex';
    },
    
    hideCreateForm: () => {
        document.getElementById('create-article-modal').style.display = 'none';
    },
    
    createArticle: async () => {
        const payload = {
            article_code: document.getElementById('article_code').value,
            article_name: document.getElementById('article_name').value,
            customer_name: document.getElementById('customer_name').value,
            leather_type: document.getElementById('leather_type').value,
            thickness: document.getElementById('thickness').value,
            target_color: document.getElementById('target_color').value,
            color_reference: document.getElementById('color_reference').value
        };
        
        try {
            const result = await window.api.post('/articles', payload);
            articlesModule.hideCreateForm();
            window.location.href = '/article-detail.html?id=' + result.id;
        } catch (e) {
            alert('Failed to create article: ' + e.message);
        }
    }
};
window.articlesModule = articlesModule;
