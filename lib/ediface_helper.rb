module EdifaceHelper
  # put this in your layout somewhere
  def ediface_meta_tags
    "<meta name='ediface.view_path' content='#{view_path_normalized}'/>" + 
    "<meta name='ediface.view_name' content='#{view_name_normalized}'/>" +
    "<meta name='ediface.layout' content='#{layout_name}'/>" unless layout_name.nil?
  end
  
  # the default classes that get added to the body element when a view renders
  # the c_ in front of view_path is for historical reasons
  def ediface_body_classes
    "c_#{view_path} v_#{view_name}" + (layout_name.nil? ? '' : " l_#{layout_name}")
  end
end