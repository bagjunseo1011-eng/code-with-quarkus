function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        btn.textContent = 'DARK';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-theme');
        btn.textContent = 'LIGHT';
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        btn.textContent = 'LIGHT';
    }
});
