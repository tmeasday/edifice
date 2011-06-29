module Edifice
  module Helper
    # put this in your layout somewhere
    def edifice_meta_tags
      %(<meta name='edifice-view_path' content='#{view_path_normalized}'/>
        <meta name='edifice-view_name' content='#{view_name_normalized}'/>
        <meta name='edifice-layout' content='#{layout_name}'/>).html_safe
    end
  
    # the default classes that get added to the body element when a view renders
    # the c_ in front of view_path is for historical reasons
    def edifice_body_classes
      %(c_#{view_path} v_#{view_name} l_#{layout_name}").html_safe
    end
  end
end