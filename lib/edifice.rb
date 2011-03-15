module Edifice
  def self.install_js_files
    install_dir = ::Rails.application.paths.public.javascripts.first
    edifice_js_dir = File.join(File.dirname(__FILE__), 'public', 'javascripts', 'edifice')
    
    FileUtils.cp_r edifice_js_dir, install_dir
  end
  
  module Controller
    def self.included(controller)
      controller.helper_method(:view_path, :view_path_normalized, 
        :view_name, :view_name_normalized, :layout_name)
      
      unless (controller == ActionMailer::Base)
        controller.after_filter(:write_edifice_headers)
        controller.alias_method_chain(:_render_template, :edifice)
      end
    end
    
    def _render_template_with_edifice(options)
      @view_path = options[:prefix]
      @view_name = options[:template]
      @layout = options[:layout] ? File.split(options[:layout]).last : nil
      
      _render_template_without_edifice(options)
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
