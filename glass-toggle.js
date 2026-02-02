class GlassThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else {
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    connectedCallback() {
        this.render();
        this.applyTheme(false); // Initial apply without transition if possible, but JS will trigger it anyway
    }

    applyTheme(animate = true) {
        const html = document.documentElement;
        const container = this.shadowRoot.getElementById('container');
        const knob = this.shadowRoot.getElementById('knob');
        const label = this.shadowRoot.getElementById('themeLabel');
        const liquid = this.shadowRoot.getElementById('liquid');
        const icon = this.shadowRoot.getElementById('icon');

        if (this.isDark) {
            html.classList.add('dark');
            container.classList.add('dark');
            knob.style.left = '76px'; // 120 - 44 = 76
            liquid.style.width = '100%';
            label.textContent = 'Dark';
            icon.innerHTML = `<path d="M21 12.8A9 9 0 0 1 11.2 3 7 7 0 1 0 21 12.8z"/>`;
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            container.classList.remove('dark');
            knob.style.left = '0px';
            liquid.style.width = '0%';
            label.textContent = 'Light';
            icon.innerHTML = `<path d="M12 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1z"/>`;
            localStorage.setItem('theme', 'light');
        }

        this.dispatchEvent(new CustomEvent('theme-change', {
            detail: { theme: this.isDark ? 'dark' : 'light' },
            bubbles: true,
            composed: true
        }));
    }

    toggle() {
        this.isDark = !this.isDark;
        this.applyTheme();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

            :host {
                display: inline-block;
                --pill-w: 120px;
                --pill-h: 48px;
                --knob-size: 60px;
                --bg-light: #d1d3d6;
                --bg-dark: #1f2328;
                --text-color: rgba(0, 0, 0, 0.4);
                --text-color-dark: rgba(255, 255, 255, 0.4);
                font-family: 'Inter', sans-serif;
            }

            .container {
                position: relative;
                width: var(--pill-w);
                height: var(--knob-size);
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
            }

            .pill {
                position: relative;
                width: 100%;
                height: var(--pill-h);
                background-color: var(--bg-light);
                border-radius: 999px;
                box-shadow: 
                    inset 0 2px 8px rgba(0,0,0,0.1),
                    0 8px 25px rgba(0,0,0,0.1);
                overflow: hidden;
                display: flex;
                align-items: center;
                transition: background-color 0.5s;
                padding: 0 20px; /* Space for labels */
                box-sizing: border-box;
            }

            .liquid {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0;
                background-color: var(--bg-dark);
                transition: width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .label {
                position: relative;
                z-index: 5;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: -0.5px;
                transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
                color: var(--text-color);
                width: 100%;
                text-align: center;
            }

            .container.dark .label {
                color: var(--text-color-dark);
                transform: translateX(-20px);
            }

            .container:not(.dark) .label {
                transform: translateX(20px);
            }

            .knob {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: var(--knob-size);
                height: var(--knob-size);
                border-radius: 50%;
                left: 0;
                z-index: 10;
                transition: left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
                
                /* Glass Effect */
                background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 0.5px solid rgba(255, 255, 255, 0.5);
                box-shadow: 
                    0 10px 30px rgba(0,0,0,0.3),
                    inset 0 0 20px rgba(255,255,255,0.4),
                    inset 0 0 5px rgba(255,255,255,0.6);
            }

            /* Inner Blob / Icon Container */
            .blob {
                position: absolute;
                inset: 8px;
                border-radius: 50%;
                background: #e0e2e5;
                box-shadow: 
                    inset 0 2px 4px rgba(0,0,0,0.1),
                    0 4px 10px rgba(0,0,0,0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .container.dark .blob {
                background: #111418;
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
            }

            .icon {
                width: 18px;
                height: 18px;
                fill: #000;
                transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .container.dark .icon {
                fill: #fff;
                filter: drop-shadow(0 0 8px rgba(255,255,255,0.8));
            }

            /* Refractions for more realism */
            .knob::after {
                content: '';
                position: absolute;
                top: 15%;
                left: 15%;
                width: 30%;
                height: 30%;
                background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
                border-radius: 50%;
                pointer-events: none;
            }

        </style>
        <div id="container" class="container \${this.isDark ? 'dark' : ''}">
            <div class="pill">
                <div id="liquid" class="liquid"></div>
                <span id="themeLabel" class="label">\${this.isDark ? 'Dark' : 'Light'}</span>
            </div>
            <div id="knob" class="knob">
                <div class="blob">
                    <svg id="icon" viewBox="0 0 24 24" class="icon"></svg>
                </div>
            </div>
        </div>
        `;

        this.shadowRoot.getElementById('container').addEventListener('click', () => this.toggle());
    }
}

customElements.define('glass-theme-toggle', GlassThemeToggle);
