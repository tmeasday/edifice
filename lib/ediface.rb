module Ediface
  def self.install_js_files
    install_dir = "#{RAILS_ROOT}/public/javascripts"
    ediface_js_dir = File.join(File.dirname(__FILE__), 'public', 'javascripts', 'ediface')
    
    FileUtils.cp_r ediface_js_dir, install_dir
  end
  
  module Controller
    def self.included(controller)
      controller.after_filter(:write_ediface_headers)
      controller.helper_method(:view_path, :view_path_normalized, 
        :view_name, :view_name_normalized, :layout_name)
        
      controller.alias_method_chain :render_for_file, :ediface
    end
    
    def render_for_file_with_ediface(template_path, status = nil, layout = nil, locals = {})
      path = template_path.respond_to?(:path_without_format_and_extension) ? template_path.path_without_format_and_extension : template_path
      @view_path, @view_name = File.split(path)
      
      render_for_file_without_ediface(template_path, status, layout, locals)
    end
    
    def write_ediface_headers
      response.headers['x-ediface-view_path'] = view_path_normalized
      response.headers['x-ediface-view_name'] = view_name_normalized
      response.headers['x-ediface-layout'] = layout_name
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
      response.layout.nil? ? 'no_layout' : File.split(response.layout).last
    end
  end
end