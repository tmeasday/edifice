/* 
  This file contains our proto-framework for javascript using jQuery
*/

jQuery.noConflict();

(function($){
  // fire the view specific hookup code -- this code should set up live events 
  // etc that control the specific thing that this page does...
  function page_level_hookup(methodName) {
    var view_path = $('meta[name=ediface.view_path]').attr('content');
    var view_name = $('meta[name=ediface.view_name]').attr('content');    
    var layout    = $('meta[name=ediface.layout]').attr('content');
    
    hookup(methodName, view_path, view_name, layout);
  };
  
  function ajax_hookup(methodName, request) {
    var view_path = request.getResponseHeader('x-ediface-view_path');
    var view_name = request.getResponseHeader('x-ediface-view_name');
    var layout    = request.getResponseHeader('x-ediface-layout');
    
    hookup(methodName, view_path, view_name, layout);
  }
  
  function hookup(methodName, view_path, view_name, layout) {
    //capitalize the first character in a string
    function capitalize_first_chr(str) {
      if ((typeof(str) == 'undefined') || (str.length == 0)) {
        return "";
      }
      
      return str.charAt(0).toUpperCase().concat( str.substr(1) )
    }
    
    hookup_once(view_path + capitalize_first_chr(view_name), methodName); // hookup the view    
    hookup_once('layouts' + capitalize_first_chr(layout), methodName);
  };
  
  function hookup_once(objectName, methodName) {
    console.log(objectName + '[' + methodName + ']')
    if (typeof window[objectName] != 'undefined') { // check for undefined in js
      if (methodName in window[objectName]) {
        eval("window['" + objectName + "']." + methodName + "();");
      }
    }
  };

  //when the dom is ready
  $(document).ready(function() {
    page_level_hookup('onReady');
    $.attach_widgets();
    page_level_hookup('onWidgetsReady');
    $(document).trigger('widgetsReady');
  });
  
  //when the page is fully loaded (all frames, images, etc)
  $(window).load(function() {
    page_level_hookup('onLoad');
  });
  
  $(window).bind('ajaxComplete', function(event, request) {
    ajax_hookup('ajaxComplete', request);
    page_level_hookup('ajaxComplete');
    $.attach_widgets();
    ajax_hookup('onWidgetsReady', request);
    page_level_hookup('onWidgetsReady');
    $(document).trigger('widgetsReady');
  });
  
  // define this for our widgets to live in
  $.fn.ediface_widgets = {};
  
  // any element e that has data-widget=WIDGET set as an attribute will
  // have e.ediface_widgets.WIDGET() called.
  // also sets data-widget-attached to true, which is used to make sure that things
  // don't get attached twice
  $.attach_widgets = function() {
  // any element that has data-widget=something
   $('[data-widget]').each(function(){
     var e = $(this);
     if (!e.attr('data-widget-attached')) {
       var fn_name = e.attr('data-widget');

       if (!(fn_name in e.ediface_widgets)) {
         throw("ediface widget '" + fn_name + "'   is not defined.");
       }
       e.ediface_widgets[fn_name].call(e);
       e.attr('data-widget-attached', true)       
     }
   });
  };
    
  // set the default value of an option
  // to this to ensure that a value is set for the widget
  $.fn.ediface_widgets.REQUIRED = '*** VALUE REQUIRED ***';
  
  // updates options by examining a tag for data-widget-x attributes
  // note that attached is a reserved name
  // pass in the set of default options (all defaults must be defined)
  $.fn.read_options = function(defaults) {
    var that = this;
    var options = {};
    $.each(defaults, function(name, def) {
      // console.log('data-widget-' + name);
      var val = that.attr('data-widget-' + name);
      // console.log(val);
      if (val) {
        options[name] = val;
      } else {
        if (def === $.fn.ediface_widgets.REQUIRED) {
          throw("Widget argument required: " + name);
        }
        
        options[name] = def;
      }
    });
    
    return options;
  }
}(jQuery));
