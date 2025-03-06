---
layout: post
title: "Esempio di Immagine Responsive"
date: 2025-03-06
category: esempi
author: antenore
tags: [jekyll, ottimizzazione, immagini]
---

# Esempio di Utilizzo delle Immagini Responsive

Questo è un esempio di come utilizzare le immagini responsive nel blog con il nostro approccio ottimizzato.

## Immagine Standard

{% include responsive-image.html 
   src="/assets/images/Antenore.jpg" 
   srcset="/assets/images/Antenore.webp 1x, /assets/images/Antenore@2x.webp 2x" 
   sizes="(max-width: 800px) 100vw, 800px"
   alt="Antenore Gatta" 
   class="post-image" 
%}

## Immagine Post con Solo WebP

{% include responsive-image.html 
   src="/assets/images/Antenore.jpg" 
   srcset="/assets/images/Antenore.webp" 
   alt="Antenore Gatta" 
   class="post-image large" 
%}

## Immagine Thumbnail

{% include responsive-image.html 
   src="/assets/images/Antenore.jpg" 
   srcset="/assets/images/Antenore-small.webp 1x, /assets/images/Antenore.webp 2x" 
   sizes="(max-width: 400px) 100vw, 400px"
   alt="Antenore Gatta" 
   class="thumbnail" 
%}

## Immagine Avatar

{% include responsive-image.html 
   src="/assets/images/Antenore.jpg" 
   srcset="/assets/images/Antenore-avatar.webp" 
   alt="Antenore Gatta" 
   class="avatar" 
%}

## Utilizzo Diretto del Tag HTML

<img 
  src="/assets/images/Antenore.jpg" 
  srcset="/assets/images/Antenore.webp 1x, /assets/images/Antenore@2x.webp 2x"
  sizes="(max-width: 800px) 100vw, 800px"
  alt="Antenore Gatta" 
  loading="lazy"
  class="post-image"
>

## Benefici delle Immagini Responsive

1. **Prestazioni migliori**: Le immagini vengono caricate alla dimensione appropriata per il dispositivo
2. **Risparmio di larghezza di banda**: I dispositivi mobili scaricano immagini più piccole
3. **Formati moderni**: Utilizzo di WebP quando supportato dal browser
4. **Lazy loading**: Le immagini vengono caricate solo quando necessario

## Come Funziona

Il nostro approccio ottimizzato per le immagini responsive:

1. **Ottimizzazione delle immagini**: Utilizziamo uno script Node.js per comprimere e convertire le immagini in WebP
2. **Responsive HTML**: Utilizziamo `srcset` e `sizes` per servire la dimensione corretta dell'immagine
3. **Lazy loading**: Le immagini vengono caricate solo quando diventano visibili nello schermo
4. **Fallback**: Forniamo sempre un'immagine JPG/PNG di fallback per browser più vecchi
