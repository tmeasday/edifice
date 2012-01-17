module Edifice
  
  module Controller
    def self.included(controller)
      controller.helper_method(:view_path, :view_path_normalized, 
        :view_name, :view_name_normalized, :layout_name)
      
      unless (controller == ActionMailer::Base)
        controller.after_filter(:write_edifice_headers)
      end
    end
    
    # this will get called once per template. So we make sure it only writes for the first
    def set_edifice_names(view_name, view_path, layout)
      unless @edifice_names_set
        @view_name = view_name
        @view_path = view_path
        @layout = layout
        
        @edifice_names_set = true
      end
    end
    
    def write_edifice_headers
      response.headers['x-edifice-view_path'] = view_path_normalized
      response.headers['x-edifice-view_name'] = view_name_normalized
      response.headers['x-edifice-layout'] = layout_name
    end
    
    def view_path
      (@view_path || 'no_controller').gsub('/', '_')
    end
    
    def view_path_normalized
      view_path.camelcase(:lower)
    end

    def view_name
      @view_name || 'no_view'
    end
    
    def view_name_normalized
      view_name.camelcase(:lower)
    end
    
    def layout_name
      @layout || 'no_layout'
    end
  end
end