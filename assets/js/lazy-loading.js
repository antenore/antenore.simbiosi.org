// Polyfill per il lazy loading in browser più vecchi
document.addEventListener('DOMContentLoaded', function() {
  // Verifica se il browser supporta nativamente il lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    // Il browser supporta il lazy loading nativo
    console.log('Browser supporta lazy loading nativo');
    return;
  }

  // Per browser che non supportano il lazy loading nativo
  console.log('Usando polyfill per lazy loading');
  
  // Seleziona tutte le immagini con attributo loading="lazy"
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  // Configura l'Intersection Observer
  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      // Se l'immagine è visibile
      if (entry.isIntersecting) {
        const image = entry.target;
        
        // Carica l'immagine impostando la src
        if (image.dataset.src) {
          image.src = image.dataset.src;
          delete image.dataset.src;
        }
        
        // Smetti di osservare l'immagine
        observer.unobserve(image);
      }
    });
  });
  
  // Osserva ogni immagine
  lazyImages.forEach(function(image) {
    // Salva la src originale in data-src e rimuovi src
    if (image.src) {
      image.dataset.src = image.src;
      image.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    
    // Osserva l'immagine
    imageObserver.observe(image);
  });
});
