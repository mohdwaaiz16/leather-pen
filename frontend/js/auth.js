const auth = {
    login: async () => {
        try {
            const data = await window.api.post('/auth/login', {});
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/articles.html';
        } catch (err) {
            alert('Login failed: ' + err.message);
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },
    checkAuth: () => {
        if (!localStorage.getItem('token') && !window.location.pathname.includes('login.html')) {
            window.location.href = '/login.html';
        }
    }
};

window.auth = auth;
