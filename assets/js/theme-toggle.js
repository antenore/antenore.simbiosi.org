document.addEventListener('DOMContentLoaded', function() {
  /* DOM elements */
  const themeToggle = document.getElementById('checkbox');
  if (!themeToggle) return;

  try {
    /* Check for saved theme preference and set checkbox state */
    const savedTheme = localStorage.getItem('theme');
    
    /* Set checkbox state based on current theme */
    if (savedTheme === 'dark') {
      themeToggle.checked = true;
    } else {
      themeToggle.checked = false;
    }

    /* Toggle theme when the checkbox is clicked */
    themeToggle.addEventListener('change', function() {
      try {
        if (this.checked) {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark-theme');
          document.documentElement.classList.add('light-theme');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        /* Handle case where localStorage is not available */
        if (this.checked) {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.remove('dark-theme');
          document.documentElement.classList.add('light-theme');
        }
      }
    });
  } catch (e) {
    /* If localStorage is not available, just set up the toggle without persistence */
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.add('light-theme');
      }
    });
  }
});
