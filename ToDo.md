# Blog Improvement TODO

## Important Notes
- Main repository on **GitLab** (not GitHub)
- Current repository does not contain assets due to space limitations
- Changes must maintain compatibility with GitLab CI/CD pipeline

## Completed Tasks
- [x] Fix blog title highlighting issue
- [x] Update About page with focus on cloud governance/AWS
- [x] Highlight current certifications
- [x] Update skills to reflect CV
- [x] Update Gemfile and Jekyll versions
- [x] Migrate to Jekyll 4.3.4 and SCSS instead of SASS
- [x] Fix Sass @import deprecation warnings
- [x] Test compatibility with GitLab CI/CD
- [x] Implement image compression
- [x] Configure lazy loading
- [x] Remove Disqus (not used)
- [x] Remove Google Analytics (not used)
- [x] Simplify author block (removed social sharing buttons)
- [x] Modernize favicon implementation
- [x] Improve theme switcher
- [x] Implement cookie consent with options for "Accept All" and "Necessary Only"
- [x] Remove unused CSS (social-share.css, subscribe.css, related-posts.css)
- [x] Optimize font loading
- [x] Organize assets by size/type
- [x] Fix image display issues in blog posts
- [x] Improve default layout for better space utilization
- [x] Fix duplicated content on home page
- [x] Update AWS Access Key blog post with cautionary notes and updated date
- [x] Move pages to directory structure (about.md, blog.html, projects.html, tags.html, 404.html)
- [x] Fix theme flickering when changing pages
- [x] Refactor Interactive Diabetes Guide for better performance and integration
- [x] Improve Diabetes Guide styling to match blog theme
- [x] Implement responsive images with srcset
- [x] Implement WebP image format with fallbacks
- [x] Create image gallery component
- [x] Add missing alt attributes to images
- [x] Implement automatic fallback alt text generation
- [x] Add skip-to-content link for keyboard users
- [x] Improve ARIA attributes in navigation and interactive elements
- [x] Add proper roles and ARIA labels to components
- [x] Create dedicated accessibility CSS file
- [x] Fix color contrasts
- [x] Replace FontAwesome with Simple Icons for brand icons
- [x] Improve theme switcher with better labels and positioning
- [x] Style social share buttons and footer social links
- [x] Unify icon styles using text-based icons for consistency
- [x] Remove unnecessary includes (related-posts.html, subscribe.html)
- [x] Improve navigation link contrast for better accessibility
- [x] Implement minimalist black & white theme
- [x] Update critical CSS for essential styles
- [x] Simplify theme switcher CSS
- [x] Simplify icons CSS
- [x] Update cookie consent CSS to match minimalist theme
- [x] Unify redundant .scss files
- [x] Implement CSS variables for theme
- [x] Remove unused styles
- [x] Use CSS variables approach for dark mode with smooth transitions
- [x] Implement Material Design touches (elevation, spacing grid, transitions)
- [x] Improve focus states for better keyboard accessibility
- [x] Enhance contrast for WCAG 2.1 AA compliance
- [x] Create consistent spacing using 8px grid system
- [x] Add subtle elevation shadows for interactive elements
- [x] Implement smooth transitions for state changes
- [x] Replace deprecated Sass @import with @use
- [x] Fix Sass color functions to work with CSS variables
- [x] Improve navigation styling for better usability and accessibility
- [x] Fix avatar styling with proper clip-path and object-fit
- [x] Simplify CSS structure by removing redundant critical CSS file
- [x] Fix SCSS lint error in main.scss
- [x] Create a fully responsive fluid navigation bar that works in both themes
- [x] Improve header styling for better readability and spacing
- [x] Enhance avatar appearance with proper sizing and subtle effects
- [x] Fix content alignment and responsiveness across different screen sizes
- [x] Refactor main content typography and spacing for better readability
- [x] Enhance footer styling with improved spacing and layout
- [x] Modernize cookie consent banner with Material Design principles
- [x] Improve social links hover effects and spacing
- [x] Fix Sass compilation error with CSS variables and darken() function
- [x] Remove jemoji dependency to avoid nokogiri installation issues on Windows
- [x] Simplify Gemfile by removing unused gems (jekyll-gist, jekyll-spaceship)
- [x] Add Ruby 3.4+ compatibility gems (csv, base64, bigdecimal, stringio)

## In Progress
- [ ] Test accessibility improvements on various devices

## Immediate Focus

### Performance Optimization
- [ ] Run image optimization script on all assets
- [ ] Implement preloading for critical images

### Accessibility Improvements
- [ ] Fix heading hierarchy
- [ ] Remove unused components from post layout

## Medium-Term Goals

### CSS and Design Improvements
- [ ] Fix outdated links in footer
- [ ] Test on various devices

### Content Development
- [ ] Create "Cloud Governance" category
- [ ] Create "AWS" category
- [ ] Reorganize existing tags
- [ ] Plan and write first AWS article ("Introduction to AWS Organizations and Control Tower")

## Future Considerations

### Dark Mode Enhancement
- [ ] Fix rendering inconsistencies

### Multilingual Support (Optional)
- [ ] Choose plugin compatible with GitLab
- [ ] Configure directory structure
- [ ] Translate UI elements (navigation, footer)

### Content Strategy (If Needed)
- [ ] Define publication frequency
- [ ] Create editorial calendar
- [ ] Implement privacy-respecting analytics solution

## Success Metrics
- [ ] New articles on AWS/cloud
- [ ] Improved PageSpeed score
- [ ] Increased visits to cloud/AWS sections
