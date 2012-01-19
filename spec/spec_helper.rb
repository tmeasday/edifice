ENV['RAILS_ENV'] = 'test'
ENV['RAILS_ROOT'] = File.join(File.dirname(__FILE__), 'rails3.1')

require File.expand_path('config/environment', ENV['RAILS_ROOT'])

require 'rspec/rails'
require 'capybara/rails'