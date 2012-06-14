module Edifice
  module Renderer
    def self.included(renderer)
      renderer.class_eval do
        def _template_renderer #:nodoc:
          @_template_renderer ||= Edifice::TemplateRenderer.new(@lookup_context)
        end
      end
    end
  end

  class TemplateRenderer < ActionView::TemplateRenderer
    def render_template(template, layout_name = nil, locals = {})
      layout_name = layout_name.call if layout_name.is_a? Proc
      layout = if layout_name.is_a? String then layout_name.split('/').last else '' end
      
      # ensure we aren't rendering e.g. text
      if template.respond_to?(:virtual_path) and @view.controller and @view.controller.respond_to?(:set_edifice_names)
        @view.controller.set_edifice_names(template.virtual_path.name, 
          template.virtual_path.prefix, layout)
      end
      
      super(template, layout_name, locals)
    end
  end
end