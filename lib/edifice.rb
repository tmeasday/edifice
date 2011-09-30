require 'edifice/helper'
require 'edifice/controller'
require 'edifice/renderer'
require 'edifice/form_model'
require 'edifice/responder'

module Edifice
  require 'edifice/railtie' if defined?(Rails)
  
  def self.install_js_files
    install_dir = ::Rails.application.paths.public.javascripts.first
    edifice_js_dir = File.join(File.dirname(__FILE__), 'public', 'javascripts', 'edifice')
    
    FileUtils.rm_r File.join(install_dir, 'edifice')
    FileUtils.cp_r edifice_js_dir, install_dir
  end
end

ActionController::Base.send :include, Edifice::Controller
ActionMailer::Base.send :include, Edifice::Controller
ActionView::Base.send :include, Edifice::Helper
ActionView::Renderer.send :include, Edifice::Renderer