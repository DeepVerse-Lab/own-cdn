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
            knob.style.left = '23px'; // 40 - 17 = 23
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
            // Full Sun Path
            // Simple Robust Sun Path
            icon.innerHTML = `<path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-7v2m0 16v2m-7-9H3m18 0h-2m-3.05-6.95l-1.42 1.42m-8.48 8.48l-1.42 1.42m1.42-11.32l1.42 1.42m8.48 8.48l1.42 1.42" stroke="currentColor" stroke-width="2" fill="currentColor"/>`;
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
                --pill-w: 40px;
                --pill-h: 12px;
                --knob-size: 17px;
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
                    inset 0 1px 4px rgba(0,0,0,0.1),
                    0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
                display: flex;
                align-items: center;
                transition: background-color 0.5s;
                padding: 0;
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
               display: none;
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
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: 0.2px solid rgba(255, 255, 255, 0.5);
                box-shadow: 
                    0 4px 10px rgba(0,0,0,0.3),
                    inset 0 0 5px rgba(255,255,255,0.4);
            }

            /* Inner Blob / Icon Container */
            .blob {
                position: absolute;
                inset: 2px; /* Decreased inset to give more space for icon */
                border-radius: 50%;
                background: #e0e2e5;
                box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .container.dark .blob {
                background: #111418;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
            }

            .icon {
                width: 12px;
                height: 12px;
                fill: #ff9f00; /* Warm Sun Amber */
                color: #ff9f00;
                display: block;
                filter: drop-shadow(0 0 2px rgba(255, 159, 0, 0.4));
                transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .container.dark .icon {
                fill: #fff;
                color: #fff;
                filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
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
