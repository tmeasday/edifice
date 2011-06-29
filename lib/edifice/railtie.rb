require 'edifice'
require 'rails'

module Edifice
  class Railtie < Rails::Railtie
    rake_tasks do
      load "tasks/edifice.rake"
    end
  end
end
