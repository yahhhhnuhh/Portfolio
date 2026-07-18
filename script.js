const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const THEME_KEY = 'portfolio-theme';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyTheme(theme) {
    const label = toggleButton.querySelector('.theme-label');

    if (theme === 'dark') {
        body.classList.add('dark');
        if (label) label.textContent = 'DARK';
        toggleButton.setAttribute('aria-label', 'Switch to light mode');
    } else {
        body.classList.remove('dark');
        if (label) label.textContent = 'LIGHT';
        toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    }
}

const savedTheme = window.localStorage.getItem(THEME_KEY);
if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
} else {
    applyTheme('dark');
}

toggleButton.addEventListener('click', () => {
    const isDark = body.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
});

/* Boot loader */
function initBootLoader() {
    const loader = document.getElementById('boot-loader');
    if (!loader || prefersReducedMotion) {
        body.classList.remove('is-booting');
        if (loader) loader.classList.add('is-hidden');
        return;
    }

    body.classList.add('is-booting');
    window.setTimeout(() => {
        loader.classList.add('is-hidden');
        body.classList.remove('is-booting');
    }, 1100);
}

/* Section heading scramble */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function scrambleText(element) {
    const finalText = element.dataset.scrambleText || element.textContent;
    element.dataset.scrambleText = finalText;
    if (prefersReducedMotion) return;

    let frame = 0;
    const totalFrames = 18;

    const interval = window.setInterval(() => {
        element.textContent = finalText
            .split('')
            .map((char, index) => {
                if (char === ' ') return ' ';
                if (index < (frame / totalFrames) * finalText.length) return finalText[index];
                return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join('');

        frame += 1;
        if (frame > totalFrames) {
            window.clearInterval(interval);
            element.textContent = finalText;
        }
    }, 35);
}

function initHeadingScramble() {
    const headings = document.querySelectorAll('[data-scramble]');
    if (!headings.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                    entry.target.dataset.scrambled = 'true';
                    scrambleText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.6 }
    );

    headings.forEach((heading) => observer.observe(heading));
}

/* Skill bar animation */
function initSkillBars() {
    const rows = document.querySelectorAll('.skill-row');
    if (!rows.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    rows.forEach((row) => observer.observe(row));
}

/* Command palette */
const commands = [
    { name: 'about', label: 'Go to About Me', action: () => scrollToSection('about-me') },
    { name: 'education', label: 'Go to Education', action: () => scrollToSection('academics') },
    { name: 'org', label: 'Go to Organization', action: () => scrollToSection('organization') },
    { name: 'certs', label: 'Go to Certifications', action: () => scrollToSection('achievements') },
    { name: 'projects', label: 'Go to Projects', action: () => scrollToSection('projects') },
    { name: 'contact', label: 'Go to Contact', action: () => scrollToSection('contact') },
    { name: 'theme dark', label: 'Switch to dark mode', action: () => setTheme('dark') },
    { name: 'theme light', label: 'Switch to light mode', action: () => setTheme('light') },
    { name: 'github', label: 'Open GitHub', action: () => window.open('https://github.com/yahhhhnuhh', '_blank', 'noopener,noreferrer') },
    { name: 'linkedin', label: 'Open LinkedIn', action: () => window.open('https://www.linkedin.com/in/julliana-louise-onor-40a442250/', '_blank', 'noopener,noreferrer') },
    { name: 'email', label: 'Send email', action: () => { window.location.href = 'mailto:jlOnor@mcm.edu.ph'; } },
    { name: 'help', label: 'Show all commands', action: () => {
        window.setTimeout(() => {
            const paletteEl = document.getElementById('command-palette');
            const inputEl = document.getElementById('command-input');
            if (paletteEl) paletteEl.hidden = false;
            if (inputEl) {
                inputEl.value = '';
                inputEl.dispatchEvent(new Event('input'));
                inputEl.focus();
            }
        }, 0);
    } },
];

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

function setTheme(theme) {
    applyTheme(theme);
    window.localStorage.setItem(THEME_KEY, theme);
}

function initCommandPalette() {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('command-input');
    const results = document.getElementById('command-results');
    if (!palette || !input || !results) return;

    let selectedIndex = 0;
    let filtered = commands;

    function openPalette() {
        palette.hidden = false;
        input.value = '';
        selectedIndex = 0;
        renderCommands('');
        window.requestAnimationFrame(() => input.focus());
    }

    function closePalette() {
        palette.hidden = true;
        selectedIndex = 0;
    }

    function renderCommands(query) {
        const q = query.trim().toLowerCase();
        filtered = q
            ? commands.filter((cmd) => cmd.name.includes(q) || cmd.label.toLowerCase().includes(q))
            : commands;

        if (selectedIndex >= filtered.length) selectedIndex = 0;

        results.innerHTML = filtered.length
            ? filtered.map((cmd, index) =>
                `<li class="${index === selectedIndex ? 'is-selected' : ''}" data-index="${index}">${cmd.name} <span>— ${cmd.label}</span></li>`
            ).join('')
            : '<li>No commands found</li>';
    }

    function runCommand(index) {
        const cmd = filtered[index];
        if (!cmd) return;
        closePalette();
        cmd.action();
    }

    input.addEventListener('input', () => {
        selectedIndex = 0;
        renderCommands(input.value);
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
            renderCommands(input.value);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            renderCommands(input.value);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            runCommand(selectedIndex);
        } else if (event.key === 'Escape') {
            closePalette();
        }
    });

    results.addEventListener('click', (event) => {
        const item = event.target.closest('li[data-index]');
        if (!item) return;
        runCommand(Number(item.dataset.index));
    });

    palette.querySelector('[data-command-close]')?.addEventListener('click', closePalette);

    document.addEventListener('keydown', (event) => {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const modifier = isMac ? event.metaKey : event.ctrlKey;

        if (modifier && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            palette.hidden ? openPalette() : closePalette();
        }

        if (event.key === '/' && document.activeElement !== input && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            event.preventDefault();
            openPalette();
        }
    });
}

initBootLoader();
initHeadingScramble();
initSkillBars();
initCommandPalette();
