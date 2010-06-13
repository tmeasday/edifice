require 'ediface'

config.to_prepare do 
  Ediface.install_js_files
end

ActionController::Base.send :include, Ediface::Controller
ActionMailer::Base.send :include, Ediface::Controller
ActionView::Base.send :include, EdifaceHelper