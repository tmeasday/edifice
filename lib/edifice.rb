module Edifice
  require 'edifice/engine' if defined?(Rails)
end

ActionController::Base.send :include, Edifice::Controller
ActionMailer::Base.send :include, Edifice::Controller
ActionView::Base.send :include, Edifice::Helper
ActionView::Renderer.send :include, Edifice::Renderer
