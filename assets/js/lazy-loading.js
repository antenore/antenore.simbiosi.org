/* Polyfill for lazy loading in older browsers */
document.addEventListener('DOMContentLoaded', function() {
  /* Check if the browser natively supports lazy loading */
  if ('loading' in HTMLImageElement.prototype) {
    /* Browser natively supports lazy loading */
    console.log('Browser supports native lazy loading');
    return;
  }

  /* For browsers that do not natively support lazy loading */
  console.log('Using polyfill for lazy loading');
  
  /* Select all images with loading="lazy" attribute */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  /* Configure Intersection Observer */
  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      /* If the image is visible */
      if (entry.isIntersecting) {
        const image = entry.target;
        
        /* Load the image by setting the src */
        if (image.dataset.src) {
          image.src = image.dataset.src;
          delete image.dataset.src;
        }
        
        /* Stop observing the image */
        observer.unobserve(image);
      }
    });
  });
  
  /* Observe each image */
  lazyImages.forEach(function(image) {
    /* Save original src in data-src and remove src */
    if (image.src) {
      image.dataset.src = image.src;
      image.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    
    /* Observe the image */
    imageObserver.observe(image);
  });
});
