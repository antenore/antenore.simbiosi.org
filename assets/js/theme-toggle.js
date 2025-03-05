/**
 * SolarBlog Theme Toggle
 * Manages theme switching with explicit light/dark modes and system preference support
 */

(function() {
    // DOM Elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    // Theme constants
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    };

    const STORAGE_KEY = 'solarblog-theme-preference';
    const DARK_THEME_CLASS = 'dark-theme';

    /**
     * Get the current theme preference
     * @returns {string} Current theme preference
     */
    function getThemePreference() {
        return localStorage.getItem(STORAGE_KEY) || THEMES.AUTO;
    }

    /**
     * Determine if dark mode is active based on system preference
     * @returns {boolean} Whether dark mode is preferred by the system
     */
    function isSystemDarkMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Set the theme
     * @param {string} theme - Theme to set (light/dark/auto)
     */
    function setTheme(theme) {
        // Remove existing theme classes
        body.classList.remove(DARK_THEME_CLASS);

        switch(theme) {
            case THEMES.DARK:
                body.classList.add(DARK_THEME_CLASS);
                localStorage.setItem(STORAGE_KEY, THEMES.DARK);
                break;
            case THEMES.LIGHT:
                localStorage.setItem(STORAGE_KEY, THEMES.LIGHT);
                break;
            default: // AUTO
                localStorage.removeItem(STORAGE_KEY);
                if (isSystemDarkMode()) {
                    body.classList.add(DARK_THEME_CLASS);
                }
                break;
        }

        updateThemeToggleIcon(theme);
    }

    /**
     * Update the theme toggle button icon
     * @param {string} theme - Current theme
     */
    function updateThemeToggleIcon(theme) {
        if (!themeToggle) return;

        const currentTheme = theme || getThemePreference();

        const icon = currentTheme === THEMES.DARK
            ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';

        const label = currentTheme === THEMES.DARK
            ? 'Switch to Light Theme'
            : 'Switch to Dark Theme';

        themeToggle.innerHTML = icon;
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);
    }

    /**
     * Cycle through theme modes
     */
    function cycleTheme() {
        const currentTheme = getThemePreference();
        const themeOrder = [THEMES.LIGHT, THEMES.DARK, THEMES.AUTO];
        const currentIndex = themeOrder.indexOf(currentTheme);
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];

        setTheme(nextTheme);
    }

    /**
     * Initialize theme toggle functionality
     */
    function initThemeToggle() {
        // Set initial theme
        const savedTheme = getThemePreference();
        setTheme(savedTheme);

        // Add theme toggle listener
        if (themeToggle) {
            themeToggle.addEventListener('click', cycleTheme);
        }

        // Listen for system theme changes when in auto mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            if (getThemePreference() === THEMES.AUTO) {
                setTheme(THEMES.AUTO);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();
