const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
    const iconSpan = toggleButton.querySelector('.theme-icon');

    if (theme === 'dark') {
        body.classList.add('dark');
        if (iconSpan) iconSpan.textContent = '☀️';
        toggleButton.setAttribute('aria-label', 'Switch to light mode');
    } else {
        body.classList.remove('dark');
        if (iconSpan) iconSpan.textContent = '🌙';
        toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Initialize from saved preference or system preference
const savedTheme = window.localStorage.getItem(THEME_KEY);
if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
} else {
    const prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
}

toggleButton.addEventListener('click', () => {
    const isDark = body.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
});

