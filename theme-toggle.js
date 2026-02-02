const html = document.documentElement;
const btn = document.getElementById('themeToggle');
const knob = document.getElementById('knob');
const label = document.getElementById('themeLabel');
const liquid = document.getElementById('liquid');
const icon = document.getElementById('icon');

let isDark = localStorage.getItem('theme') === 'dark';

function applyTheme() {
    if (isDark) {
        html.classList.add('dark');
        knob.style.left = 'auto';
        knob.style.right = '8px';
        liquid.style.width = '50%';
        label.textContent = 'Dark';
        icon.innerHTML = `<path d="M21 12.8A9 9 0 0 1 11.2 3 7 7 0 1 0 21 12.8z"/>`;
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        knob.style.right = 'auto';
        knob.style.left = '8px';
        liquid.style.width = '0%';
        label.textContent = 'Light';
        icon.innerHTML = `<path d="M12 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1z"/>`;
        localStorage.setItem('theme', 'light');
    }
}

applyTheme();
btn.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
});
