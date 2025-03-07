document.addEventListener('DOMContentLoaded', function() {
  let seconds = 5;
  const countdownElement = document.getElementById('countdown');
  
  const urlParams = new URLSearchParams(window.location.search);
  const fromUrl = urlParams.get('from');
  const targetUrl = fromUrl ? (window.location.origin + fromUrl) : (document.referrer || site_url);
  
  const interval = setInterval(function() {
    seconds--;
    countdownElement.textContent = seconds;
    
    if (seconds <= 0) {
      clearInterval(interval);
      window.location.href = targetUrl;
    }
  }, 1000);
});
