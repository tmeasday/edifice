require 'edifice'

ActionController::Base.send :include, Edifice::Controller
# ActionMailer::Base.send :include, Edifice::Controller
ActionView::Base.send :include, EdificeHelper