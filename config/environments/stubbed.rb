Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.seconds.to_i}"
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Setup S3
  config.s3_enabled = !ENV['AWS_BUCKET_NAME'].nil?
  config.s3_bucket_name = "caseflow-cache"

  # Set to true to get the documents from efolder running locally on port 4000.
  config.use_efolder_locally = false

  # for now disable using local for sqs. This should be enabled when everyone
  # has a docker setup
  config.sqs_create_queues = false
  config.sqs_endpoint = nil

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true
  #
  ENV["CASEFLOW_FEEDBACK_URL"] = "https://dsva-appeals-feedback-demo-1748368704.us-gov-west-1.elb.amazonaws.com/"

  ENV["METRICS_USERNAME"] ||= "caseflow"
  ENV["METRICS_PASSWORD"] ||= "caseflow"
  ENV["SIDEKIQ_USERNAME"] ||= "caseflow"
  ENV["SIDEKIQ_PASSWORD"] ||= "caseflow"

  # eFolder API URL to retrieve appeal documents
  config.efolder_url = "http://localhost:4000"
  config.efolder_key = "token"

  config.google_analytics_account = "UA-74789258-5"

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # configure pry
  silence_warnings do
    begin
      require 'pry'
      config.console = Pry
      unless defined? Pry::ExtendCommandBundle
        Pry::ExtendCommandBundle = Module.new
      end
      require "rails/console/app"
      require "rails/console/helpers"
      require_relative "../../lib/helpers/console_methods"

      TOPLEVEL_BINDING.eval('self').extend ::Rails::ConsoleMethods
      TOPLEVEL_BINDING.eval('self').extend ConsoleMethods
    rescue LoadError
    end
  end

  # permit using the web console for dev environments not named "development"
  config.web_console.development_only = false
end
