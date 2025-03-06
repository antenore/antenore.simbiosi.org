/**
 * SolarBlog Theme Toggle - Improved version
 * Handles light/dark theme switching with proper system preference detection
 */

(function() {
    // Theme constants
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    };

    const STORAGE_KEY = 'solarblog-theme';
    const DARK_CLASS = 'dark-theme';

    // DOM Elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY) || THEMES.AUTO;
        applyTheme(savedTheme);

        // Set up event listeners
        if (themeToggle) {
            themeToggle.addEventListener('click', cycleTheme);
        }

        // Watch for system preference changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Use addEventListener if supported (modern browsers)
        if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', (e) => {
                if (getCurrentTheme() === THEMES.AUTO) {
                    applyThemeClass(e.matches);
                }
            });
        // Fallback for older browsers
        } else if (darkModeMediaQuery.addListener) {
            darkModeMediaQuery.addListener((e) => {
                if (getCurrentTheme() === THEMES.AUTO) {
                    applyThemeClass(e.matches);
                }
            });
        }
    }

    // Get current theme setting
    function getCurrentTheme() {
        return localStorage.getItem(STORAGE_KEY) || THEMES.AUTO;
    }

    // Apply theme setting
    function applyTheme(theme) {
        const isDark = theme === THEMES.DARK ||
                      (theme === THEMES.AUTO && window.matchMedia('(prefers-color-scheme: dark)').matches);

        applyThemeClass(isDark);
        updateToggleButton(isDark);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    // Apply or remove dark theme class
    function applyThemeClass(isDark) {
        if (isDark) {
            body.classList.add(DARK_CLASS);
        } else {
            body.classList.remove(DARK_CLASS);
        }
    }

    // Update toggle button appearance
    function updateToggleButton(isDark) {
        if (!themeToggle) return;

        const icon = isDark ?
            '<i class="fa-solid fa-sun" aria-hidden="true"></i>' :
            '<i class="fa-solid fa-moon" aria-hidden="true"></i>';

        const label = isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme';

        themeToggle.innerHTML = icon;
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);
    }

    // Cycle through themes (light -> dark -> auto)
    function cycleTheme() {
        const currentTheme = getCurrentTheme();
        let newTheme;

        switch (currentTheme) {
            case THEMES.LIGHT:
                newTheme = THEMES.DARK;
                break;
            case THEMES.DARK:
                newTheme = THEMES.AUTO;
                break;
            default:
                newTheme = THEMES.LIGHT;
        }

        applyTheme(newTheme);

        // Log theme change (can be removed in production)
        console.log('Theme changed to:', newTheme);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
