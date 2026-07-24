const API_BASE = '/api/v1';

const api = {
    getToken: () => localStorage.getItem('token'),
    
    headers: function() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    },

    request: async function(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.headers(),
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error?.message || 'API Error');
            }
            return data.data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    },

    get: function(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    post: function(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
};

window.api = api;
