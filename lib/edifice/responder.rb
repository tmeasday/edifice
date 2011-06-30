# Basically a standard responder, but if 
module Edifice
  class Responder < ActionController::Responder
  protected 
    # add the :u_e header to xhr error requests
    def to_html
      if controller.request.xhr? && !get? and has_errors? && default_action
        render :action => default_action, :status => :unprocessable_entity, :layout => nil
      else
        super
      end
    end
    
    # actually render something on successful updates
    def to_format
      unless get? or has_errors? or post?
        display resource, :status => :ok
      else
        super
      end
    end
  end
end