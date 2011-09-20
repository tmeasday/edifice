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
      @view.controller.set_edifice_names(template.virtual_path.name, 
        template.virtual_path.prefix, (layout_name.nil? ? '' : layout_name.split('/').last))
      
      super(template, layout_name, locals)
    end
  end
end