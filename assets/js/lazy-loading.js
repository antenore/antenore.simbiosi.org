/* Enhanced lazy loading with priority loading based on image size */
document.addEventListener('DOMContentLoaded', function() {
  /* Check if the browser natively supports lazy loading */
  if ('loading' in HTMLImageElement.prototype) {
    /* Even with native support, we'll prioritize critical images */
    prioritizeCriticalImages();
    return;
  }

  /* For browsers that do not natively support lazy loading */
  console.log('Using polyfill for lazy loading');
  
  /* Select all images with loading="lazy" attribute */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  /* Configure Intersection Observer with different thresholds based on image importance */
  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      /* If the image is visible */
      if (entry.isIntersecting) {
        const image = entry.target;
        
        /* Load the image by setting the src */
        if (image.dataset.src) {
          image.src = image.dataset.src;
          
          /* If there's a srcset defined, load that too */
          if (image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
            delete image.dataset.srcset;
          }
          
          delete image.dataset.src;
        }
        
        /* Stop observing the image */
        observer.unobserve(image);
      }
    });
  }, {
    /* Adjust root margin based on connection speed */
    rootMargin: getOptimalRootMargin(),
    threshold: 0.1
  });
  
  /* Observe each image */
  lazyImages.forEach(function(image) {
    /* Save original src in data-src and remove src */
    if (image.src && !image.src.startsWith('data:')) {
      image.dataset.src = image.src;
      
      /* Save srcset if it exists */
      if (image.srcset) {
        image.dataset.srcset = image.srcset;
        image.srcset = '';
      }
      
      /* Use a tiny transparent placeholder */
      image.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    
    /* Observe the image */
    imageObserver.observe(image);
  });
  
  /* Prioritize critical images */
  prioritizeCriticalImages();
});

/* Function to prioritize loading of critical images (e.g., above the fold) */
function prioritizeCriticalImages() {
  /* Get all images that are marked as critical (no lazy loading) */
  const criticalImages = document.querySelectorAll('img:not([loading="lazy"])');
  
  /* Preload critical images */
  criticalImages.forEach(function(image) {
    /* If the image is in the viewport and has a data-src */
    if (isInViewport(image) && image.dataset.src) {
      image.src = image.dataset.src;
      delete image.dataset.src;
      
      if (image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
        delete image.dataset.srcset;
      }
    }
  });
}

/* Helper function to check if element is in viewport */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* Function to determine optimal root margin based on connection speed */
function getOptimalRootMargin() {
  /* Use the Network Information API if available */
  if ('connection' in navigator && navigator.connection.effectiveType) {
    const connectionType = navigator.connection.effectiveType;
    
    /* Adjust root margin based on connection speed */
    switch(connectionType) {
      case '4g':
        return '400px';
      case '3g':
        return '200px';
      case '2g':
      case 'slow-2g':
        return '50px';
      default:
        return '200px';
    }
  }
  
  /* Default root margin if Network Information API is not available */
  return '200px';
}
