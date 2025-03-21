source 'https://rubygems.org'

gem 'jekyll', '~> 4.3.4'
gem 'webrick'

# Ruby 3.4+ compatibility - standard libraries that were moved to gems
gem 'csv'      # Required for CSV parsing
gem 'base64'   # Required for Base64 encoding/decoding
gem 'bigdecimal' # Required for BigDecimal
gem 'stringio'  # Required for StringIO

group :jekyll_plugins do
  gem 'kramdown-parser-gfm'
  gem 'jekyll-feed'
  #gem 'jekyll-gist'
  gem 'jekyll-seo-tag'
  #gem 'jemoji'
  #gem 'jekyll-spaceship'
  gem 'rouge'
end

# For local testing on Windows
gem 'wdm', '>= 0.1.0' if Gem.win_platform?
gem 'tzinfo-data' if Gem.win_platform?
