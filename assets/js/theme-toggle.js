document.addEventListener('DOMContentLoaded', function() {
  /* DOM elements */
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  /* Check for saved theme preference */
  const savedTheme = localStorage.getItem('theme');
  
  /* Set initial theme based on saved preference only */
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
    themeToggle.checked = true;
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light-theme');
    themeToggle.checked = false;
  } else {
    /* If no saved preference, check system preference */
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      themeToggle.checked = true;
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.add('light-theme');
      themeToggle.checked = false;
    }
    /* Save the initial theme preference */
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  }

  /* Toggle theme when the checkbox is clicked */
  themeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  });
});
