require 'edifice'

config.to_prepare do 
  Edifice.install_js_files
end

ActionController::Base.send :include, Edifice::Controller
# ActionMailer::Base.send :include, Edifice::Controller
ActionView::Base.send :include, EdificeHelper