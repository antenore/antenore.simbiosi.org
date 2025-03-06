# Blog Improvement TODO

## Note Importanti
- Repository principale su **GitLab** (non GitHub)
- Repository attuale non contiene assets per limitazioni di spazio
- Gli interventi devono mantenere la compatibilità con la pipeline CI/CD GitLab

## Analisi Preliminare

### Template Issues
- [ ] Compatibilità Jekyll obsoleta
- [ ] Frammentazione CSS eccessiva
- [ ] Inconsistenze nei file tema (style.scss/style-dark.scss)
- [ ] Dark mode implementata in modo non standard
- [ ] Collegamenti obsoleti nel footer
- [ ] Implementazione FontAwesome troppo verbose

### Accessibilità
- [ ] Contrasto insufficiente in alcune sezioni
- [ ] Attributi alt mancanti per immagini
- [ ] Struttura heading non ottimale

### Design Responsivo
- [ ] UI mobile da migliorare
- [ ] Inconsistenze font e colori
- [ ] Spacing irregolare

### Contenuti
- [ ] Mancanza articoli su AWS/Cloud (competenza principale)
- [ ] Pochi progetti nel portfolio
- [x] Pagina About non allineata con competenze attuali
- [ ] Nessun tema unificante tra i post
- [ ] Pubblicazione irregolare

## TODO Priorità 1: Allineamento Contenuti (Q2 2025)

### 1.1 Aggiornare Pagina About
- [x] Aggiungere focus su cloud governance/AWS 
- [x] Evidenziare certificazioni attuali
- [x] Aggiornare skills per riflettere il CV

### 1.2 Pianificare Serie Articoli AWS
- [ ] Articolo #1: "Introduzione a AWS Organizations e Control Tower"
- [ ] Articolo #2: "Service Control Policies efficaci"
- [ ] Articolo #3: "Strategie multi-account per sicurezza"
- [ ] Articolo #4: "Ottimizzazione costi in AWS"

### 1.3 Riorganizzare Tassonomia
- [ ] Creare categoria "Cloud Governance"
- [ ] Creare categoria "AWS"
- [ ] Riorganizzare tag esistenti

## TODO Priorità 2: Fix Tecnici Critici (Q3 2025)

### 2.1 Aggiornamento Dipendenze
- [x] Aggiornare Gemfile e versioni Jekyll
- [x] Testare compatibilità con GitLab CI/CD
- [x] Verificare funzionamento con pipeline attuale
- [x] Migrated to Jekyll 4.3.4 and SCSS instead of SASS
- [x] Fix Deprecation warning  [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0§

### 2.2 Ottimizzazione Assets
- [ ] Implementare compressione immagini
- [ ] Configurare lazy loading
- [ ] Organizzare assets per dimensioni/tipo

### 2.3 Fix Accessibilità
- [ ] Correggere contrasti colore
- [ ] Aggiungere attributi alt mancanti
- [ ] Sistemare gerarchia heading

### 2.4 Pulizia Tema
- [x] Rimuovere Disqus (non utilizzato)
- [x] Rimuovere Google Analytics (non utilizzato)
- [x] Semplificare blocco autore (rimossi pulsanti social sharing)
- [x] Modernizzare implementazione favicon
- [x] Migliorare theme switcher
- [ ] Rimuovere CSS non utilizzato
- [ ] Ottimizzare caricamento font

## TODO Priorità 3: UX/UI Improvements (Q3-Q4 2025)

### 3.1 Consolidamento CSS
- [ ] Unificare file .scss ridondanti
- [ ] Implementare variabili CSS per tema
- [ ] Rimuovere stili non utilizzati

### 3.2 Reimplement Dark Mode
- [ ] Usare approccio con CSS variables
- [ ] Aggiungere transizioni fluide
- [ ] Fix rendering inconsistenze

### 3.3 Responsive Design
- [ ] Ottimizzare layout mobile
- [ ] Migliorare navigazione su schermi piccoli
- [ ] Testare su vari dispositivi

## TODO Priorità 4: Multilingua (Q4 2025)

### 4.1 Setup Plugin i18n
- [ ] Scegliere plugin compatibile con GitLab
- [ ] Configurare struttura directory
- [ ] Testare build su GitLab CI

### 4.2 Struttura Contenuti Multilingua
- [ ] Creare template internazionalizzati
- [ ] Definire routing per lingue
- [ ] Setup selettore lingua

### 4.3 Traduzione Contenuti Base
- [ ] Tradurre UI (navigazione, footer)
- [ ] Tradurre About e homepage
- [ ] Tradurre almeno 2 articoli fondamentali

## TODO Priorità 5: Consolidamento (Q1 2026)

### 5.1 Editorial Planning
- [ ] Definire cadenza pubblicazione (mensile)
- [ ] Creare calendario editoriale trimestrale
- [ ] Impostare promemoria automatici

### 5.2 Ottimizzare GitLab CI/CD
- [ ] Migliorare pipeline di build
- [ ] Aggiungere test automatici
- [ ] Implementare ambiente staging

### 5.3 Analytics Privacy-Friendly
- [ ] Implementare soluzione rispettosa privacy
- [ ] Configurare dashboard KPI
- [ ] Setup tracciamento conversioni

## Roadmap

```
Q2 2025: Priorità 1 (Allineamento Contenuti)
├── Aggiornamento About
├── Primo articolo AWS
└── Riorganizzazione categorie

Q3 2025: Priorità 2 (Fix Tecnici) + inizio Priorità 3
├── Aggiornamento dipendenze
├── Ottimizzazione assets
├── Fix accessibilità
└── Inizio consolidamento CSS

Q4 2025: Fine Priorità 3 + Priorità 4 (Multilingua)
├── Completamento UX/UI
├── Setup i18n
└── Traduzione contenuti base

Q1 2026: Priorità 5 (Consolidamento)
├── Piano editoriale
├── Ottimizzazione GitLab CI/CD
└── Implementazione analytics
```

## Metriche di Successo
- [ ] 4+ nuovi articoli su AWS/cloud entro fine 2025
- [ ] Score PageSpeed migliorato di 20+ punti
- [ ] Blog completamente bilingue (IT/EN) per contenuti principali
- [ ] Aumento 50% visite su sezioni cloud/AWS
