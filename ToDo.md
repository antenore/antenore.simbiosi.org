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
- [x] Remove unused components from post layout
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
- [x] Replace FontAwesome with Simple Icons for brand icons and Feather for UI icons
- [x] Improve theme switcher with better labels and positioning

## Immediate Focus

### Performance Optimization
- [ ] Run image optimization script on all assets
- [ ] Implement preloading for critical images

### Accessibility Improvements
- [ ] Fix heading hierarchy

## Medium-Term Goals

### CSS and Design Improvements
- [ ] Unify redundant .scss files
- [ ] Implement CSS variables for theme
- [ ] Remove unused styles
- [ ] Fix outdated links in footer
- [ ] Optimize mobile layout
- [ ] Improve navigation on small screens
- [ ] Test on various devices

### Content Development
- [ ] Create "Cloud Governance" category
- [ ] Create "AWS" category
- [ ] Reorganize existing tags
- [ ] Plan and write first AWS article ("Introduction to AWS Organizations and Control Tower")

## Future Considerations

### Dark Mode Enhancement
- [ ] Use CSS variables approach
- [ ] Add smooth transitions
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
