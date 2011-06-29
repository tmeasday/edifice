# Basically a standard responder, but if 
module Edifice
  class Responder < ActionController::Responder
  protected 
    def to_html
      if controller.request.xhr? && !get? and has_errors? && default_action
        render :action => default_action, :status => :unprocessable_entity, :layout => nil
      else
        super
      end
    end
  end
end