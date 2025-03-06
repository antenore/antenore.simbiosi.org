/**
 * SolarBlog Theme Toggle - Complete rewrite based on working example
 */

(function() {
    // Constants
    const DARK = 'Dark';
    const LIGHT = 'Light';
    const STORAGE_KEY = 'solarblog-color-scheme';

    // DOM Elements
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const toggleText = document.querySelector('[data-js-appearance-toggle-text]');

    // Initialize state
    let currentTheme = null;

    // Setup theme based on storage or system preference
    function initializeTheme() {
        const storedTheme = localStorage.getItem(STORAGE_KEY);

        if (storedTheme) {
            currentTheme = storedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = DARK;
            localStorage.setItem(STORAGE_KEY, DARK);
        } else {
            currentTheme = LIGHT;
            localStorage.setItem(STORAGE_KEY, LIGHT);
        }

        applyTheme(currentTheme);

        // Setup event listener
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Watch for system preference changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (darkModeMediaQuery.addListener) {
            // For older browsers
            darkModeMediaQuery.addListener(handleSystemThemeChange);
        }
    }

    function handleSystemThemeChange(e) {
        // Only change theme automatically if user hasn't explicitly set it
        if (!localStorage.getItem(STORAGE_KEY)) {
            const newTheme = e.matches ? DARK : LIGHT;
            applyTheme(newTheme);
        }
    }

    // Apply theme to DOM
    function applyTheme(theme) {
        // Clear existing theme classes
        html.classList.remove(DARK.toLowerCase());
        html.classList.remove(LIGHT.toLowerCase());

        // Add current theme class
        html.classList.add(theme.toLowerCase());

        // Update toggle button state
        updateToggleButton(theme);

        // Update meta theme color for mobile browsers
        updateMetaThemeColor(theme);

        // Store current theme
        currentTheme = theme;
    }

    // Update theme toggle button appearance
    function updateToggleButton(theme) {
        if (!themeToggle) return;

        // Update checkbox state
        if (theme === DARK) {
            themeToggle.checked = true;
        } else {
            themeToggle.checked = false;
        }

        // Update label text if exists
        if (toggleText) {
            toggleText.textContent = theme;
        }

        // Update icon (optional)
        const icon = themeToggle.querySelector('i') || themeToggle.querySelector('svg');
        if (icon) {
            if (theme === DARK) {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    }

    // Update meta theme color for mobile browsers
    function updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === DARK ? '#121212' : '#ffffff');
        }
    }

    // Toggle between light and dark themes
    function toggleTheme() {
        const newTheme = currentTheme === DARK ? LIGHT : DARK;
        localStorage.setItem(STORAGE_KEY, newTheme);
        applyTheme(newTheme);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }
})();
