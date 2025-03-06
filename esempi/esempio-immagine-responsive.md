---
layout: post
title: "Esempio di Immagine Responsive"
date: 2025-03-06
category: esempi
author: antenore
tags: [jekyll, ottimizzazione, immagini]
---

# Esempio di Utilizzo delle Immagini Responsive

Questo u00e8 un esempio di come utilizzare le immagini responsive nel blog.

## Immagine Standard (Preset Default)

{% include responsive-image.html src="Antenore.png" alt="Antenore Gatta" %}

## Immagine Post (Preset Post)

{% include responsive-image.html src="Antenore.png" alt="Antenore Gatta" preset="post" %}

## Immagine Thumbnail (Preset Thumbnail)

{% include responsive-image.html src="Antenore.png" alt="Antenore Gatta" preset="thumbnail" %}

## Immagine Avatar (Preset Avatar)

{% include responsive-image.html src="Antenore.png" alt="Antenore Gatta" preset="avatar" %}

## Utilizzo Diretto del Tag Picture

{% picture post Antenore.png --alt "Antenore Gatta" %}

## Benefici delle Immagini Responsive

1. **Prestazioni migliori**: Le immagini vengono caricate alla dimensione appropriata per il dispositivo
2. **Risparmio di larghezza di banda**: I dispositivi mobili scaricano immagini piu00f9 piccole
3. **Formati moderni**: Utilizzo automatico di WebP quando supportato dal browser
4. **Lazy loading**: Le immagini vengono caricate solo quando necessario

## Come Funziona

Il plugin `jekyll-picture-tag` genera automaticamente:

- Versioni delle immagini in diversi formati (WebP + originale)
- Dimensioni multiple per diversi dispositivi
- Tag HTML ottimizzati per il caricamento
- Fallback per browser piu00f9 vecchi
