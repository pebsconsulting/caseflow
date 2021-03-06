# rubocop:disable Metrics/LineLength
source ENV["GEM_SERVER_URL"] || "https://rubygems.org"

gem "caseflow", git: "https://github.com/department-of-veterans-affairs/caseflow-commons", ref: "be1ad2d0cc70a55e7040ea193ad9f3f84c7b35cb"

gem "moment_timezone-rails"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "5.1.6"
# Use sqlite3 as the database for Active Record
gem "activerecord-jdbcsqlite3-adapter", platforms: :jruby
gem "sqlite3", platforms: [:ruby, :mswin, :mingw, :mswin, :x64_mingw]
# Use SCSS for stylesheets
gem "sass-rails", "~> 5.0"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", ">= 1.3.0"

# Use jquery as the JavaScript library
gem "jquery-rails"

# React
gem "react_on_rails", "8.0.6"

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.0"
# bundle exec rake doc:rails generates the API under doc/api.
gem "sdoc", "~> 0.4.0", group: :doc

gem "active_model_serializers", "~> 0.10.0"

# soft delete gem
gem "paranoia", "~> 2.2"

gem "dogstatsd-ruby"

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Application server: Puma
# Puma was chosen because it handles load of 40+ concurrent users better than Unicorn and Passenger
# Discussion: https://github.com/18F/college-choice/issues/597#issuecomment-139034834
gem "puma", "~> 2.16.0"

# use to_b method to convert string to boolean
gem "wannabe_bool"

# Style
gem "uswds-rails", git: "https://github.com/18F/uswds-rails-gem.git"

# BGS
gem "bgs", git: "https://github.com/department-of-veterans-affairs/ruby-bgs.git", ref: "07a398fb0102ad93684f5423e73be68ba97c74d2"

# PDF Tools
gem "pdf-forms"
#
gem "pdfjs_viewer-rails", git: "https://github.com/senny/pdfjs_viewer-rails.git", ref: "a4249eacbf70175db63b57e9f364d0a9a79e2b43"

# Error reporting to Sentry
gem "sentry-raven"

gem "newrelic_rpm"

# Used to colorize output for rake tasks
gem "rainbow"

# Used to speed up reporting
gem "parallel"

# execjs runtime
gem "therubyracer", platforms: :ruby

gem "pg", platforms: :ruby

gem "connect_vbms", git: "https://github.com/department-of-veterans-affairs/connect_vbms.git", ref: "fd9771bafc48d98b56909c4466721da312a22739"

gem "redis-rails", "~> 5.0.2"

gem "prometheus-client", "~> 0.7.1"

gem "request_store"

# State machine
gem "aasm", "4.11.0"

gem "font-awesome-sass"

gem "redis-namespace"

# catch problematic migrations at development/test time
gem "zero_downtime_migrations"

group :production, :staging, :ssh_forwarding, :development, :test do
  # Oracle DB
  gem "activerecord-oracle_enhanced-adapter"
  gem "ruby-oci8"
end

# Development was ommited due to double logging issue (https://github.com/heroku/rails_stdout_logging/issues/1)
group :production, :staging do
  gem "rails_stdout_logging"
end

group :stubbed, :test, :development do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: :ruby
  gem "pry"
  gem "pry-byebug"
  gem "rb-readline"

  # Linters
  gem "jshint", platforms: :ruby
  gem "rubocop", "~> 0.52.1", require: false
  gem "scss_lint", require: false

  # Security scanners
  gem "brakeman"
  gem "bundler-audit"

  # Testing tools
  gem "faker"
  gem "rspec"
  gem "rspec-rails"
  # gem 'guard-rspec', '4.7.1' # removed because downstream dep requires ruby 2.5
  gem "capybara"
  gem "capybara-screenshot"
  gem "simplecov", git: "https://github.com/colszowka/simplecov.git", require: false
  gem "sniffybara", git: "https://github.com/department-of-veterans-affairs/sniffybara.git", branch: "master"
  gem "timecop"

  gem "database_cleaner"

  # to save and open specific page in capybara tests
  gem "launchy"

  gem "activerecord-import"

  gem "danger", "5.5.5"

  # For CircleCI test metadata analysis
  gem "rspec_junit_formatter"
end

group :stubbed, :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem "dotenv-rails"
  gem "foreman"
  gem "web-console", "~> 3.0", platforms: :ruby

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # gem 'spring', platforms: :ruby

  # Include the IANA Time Zone Database on Windows, where Windows doesn't ship with a timezone database.
  # POSIX systems should have this already, so we're not going to bring it in on other platforms
  gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
end

gem "shoryuken", "3.1.11"

gem "paper_trail", "8.1.2"
# rubocop:enable Metrics/LineLength
