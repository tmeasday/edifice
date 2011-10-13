require 'edifice'
require 'rails'

module Edifice
  class Engine < Rails::Engine
    rake_tasks do
      load "tasks/edifice.rake"
    end
  end
end
