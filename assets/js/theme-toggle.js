/**
 * SolarBlog Theme Toggle
 * Gestisce il passaggio tra tema chiaro e scuro
 */

(function() {
  // Elementi DOM
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const DARK_THEME_CLASS = 'dark-theme';
  const THEME_STORAGE_KEY = 'solarblog-theme-preference';

  // Verifica se il browser supporta prefers-color-scheme
  const supportsColorScheme = window.matchMedia('(prefers-color-scheme)').media !== 'not all';

  /**
   * Imposta il tema in base alla preferenza
   * @param {string} theme - 'dark', 'light' o 'auto'
   */
  function setTheme(theme) {
    // Rimuovi qualsiasi classe tema esistente
    body.classList.remove(DARK_THEME_CLASS);

    if (theme === 'dark') {
      body.classList.add(DARK_THEME_CLASS);
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else if (theme === 'light') {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    } else {
      // Auto: segue la preferenza del sistema
      localStorage.removeItem(THEME_STORAGE_KEY);
      if (supportsColorScheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add(DARK_THEME_CLASS);
      }
    }

    // Aggiorna l'icona del toggle se esiste
    updateToggleIcon(theme);
  }

  /**
   * Aggiorna l'icona del toggle in base al tema attuale
   */
  function updateToggleIcon(theme) {
    if (!themeToggle) return;

    const currentTheme = theme || getCurrentTheme();

    // Aggiorna il testo/icona in base al tema
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
      themeToggle.setAttribute('title', 'Passa al tema chiaro');
      themeToggle.setAttribute('aria-label', 'Passa al tema chiaro');
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
      themeToggle.setAttribute('title', 'Passa al tema scuro');
      themeToggle.setAttribute('aria-label', 'Passa al tema scuro');
    }
  }

  /**
   * Ottiene il tema corrente
   * @returns {string} - 'dark', 'light' o 'auto'
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
   * Alterna il tema tra chiaro e scuro
   */
  function toggleTheme() {
    document.body.classList.toggle(DARK_THEME_CLASS);
    if (document.body.classList.contains(DARK_THEME_CLASS)) {
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }

  // Inizializzazione
  function init() {
    // Imposta il tema iniziale
    setTheme(getCurrentTheme());

    // Aggiungi listener per il toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Listener per i cambiamenti nella preferenza del sistema
    if (supportsColorScheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Crea il pulsante toggle se non esiste
    if (!themeToggle) {
      createToggleButton();
    }
  }

  /**
   * Crea il pulsante di toggle del tema se non esiste
   */
  function createToggleButton() {
    const nav = document.querySelector('.nav ul') || document.querySelector('nav ul');

    if (nav) {
      const li = document.createElement('li');
      li.classList.add('theme-toggle-item');

      const button = document.createElement('button');
      button.id = 'theme-toggle';
      button.classList.add('theme-toggle');
      button.setAttribute('aria-label', 'Cambia tema');

      li.appendChild(button);
      nav.appendChild(li);

      // Aggiorna l'icona
      updateToggleIcon();

      // Aggiungi listener
      button.addEventListener('click', toggleTheme);
    }
  }

  // Esegui l'inizializzazione quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
