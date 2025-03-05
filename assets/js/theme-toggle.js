/**
 * SolarBlog Theme Toggle
 * Manages switching between light and dark themes
 */

(function() {
  // DOM elements
  const body = document.body;
  const DARK_THEME_CLASS = 'dark-theme';
  const THEME_STORAGE_KEY = 'solarblog-theme-preference';

  // Check if browser supports prefers-color-scheme
  const supportsColorScheme = window.matchMedia('(prefers-color-scheme)').media !== 'not all';

  /**
   * Sets the theme based on preference
   * @param {string} theme - 'dark', 'light' or 'auto'
   */
  function setTheme(theme) {
    // Remove any existing theme class
    body.classList.remove(DARK_THEME_CLASS);

    if (theme === 'dark') {
      body.classList.add(DARK_THEME_CLASS);
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else if (theme === 'light') {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    } else {
      // Auto: follow system preference
      localStorage.removeItem(THEME_STORAGE_KEY);
      if (supportsColorScheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add(DARK_THEME_CLASS);
      }
    }

    // Update toggle icon if it exists
    updateToggleIcon(theme);
  }

  /**
   * Updates the toggle icon based on current theme
   */
  function updateToggleIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = theme || getCurrentTheme();

    // Update text/icon based on theme
    if (currentTheme === 'dark' ||
        (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
      themeToggle.setAttribute('title', 'Switch to light theme');
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
      themeToggle.setAttribute('title', 'Switch to dark theme');
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
  }

  /**
   * Gets the current theme
   * @returns {string} - 'dark', 'light' or 'auto'
   */
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme) {
      return savedTheme;
    }

    if (supportsColorScheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light'; // Default fallback
  }

  /**
   * Toggles theme between light and dark
   */
  function toggleTheme() {
    const isDark = body.classList.contains(DARK_THEME_CLASS);

    if (isDark) {
      body.classList.remove(DARK_THEME_CLASS);
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    } else {
      body.classList.add(DARK_THEME_CLASS);
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    }

    updateToggleIcon(isDark ? 'light' : 'dark');
  }

  /**
   * Creates theme toggle button if it doesn't exist
   */
  function createToggleButton() {
    // Check if toggle already exists
    if (document.getElementById('theme-toggle')) return;

    const nav = document.querySelector('.nav ul') || document.querySelector('header .social-links');

    if (nav) {
      const toggleItem = document.createElement('div');
      toggleItem.classList.add('theme-toggle-container');

      const button = document.createElement('button');
      button.id = 'theme-toggle';
      button.classList.add('theme-toggle');
      button.setAttribute('aria-label', 'Toggle theme');

      toggleItem.appendChild(button);
      nav.appendChild(toggleItem);

      // Update icon
      updateToggleIcon();

      // Add listener
      button.addEventListener('click', toggleTheme);
    }
  }

  // Initialization
  function init() {
    // Set initial theme
    setTheme(getCurrentTheme());

    // Create toggle button
    createToggleButton();

    // Add listener for existing toggle
    const existingToggle = document.getElementById('theme-toggle');
    if (existingToggle) {
      existingToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    if (supportsColorScheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
