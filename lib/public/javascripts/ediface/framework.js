/**
  * @fileOverview a proto-framework for javascript-rails integration using jQuery
  * @author Tom Coleman
  * @author Zoltan Olah
  * @author Joe Dollard
  */

jQuery.noConflict();

/** 
  @name $.fn 
  @namespace
  @description jQuery Plugins
*/
(function($){
  /**
   * Runs an 'event method' on a view object and a layout object defined by meta tags
   * we specially set in every layout.
   * 
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   */
  function page_level_hookup(methodName) {
    var view_path = $('meta[name=ediface.view_path]').attr('content');
    var view_name = $('meta[name=ediface.view_name]').attr('content');    
    var layout    = $('meta[name=ediface.layout]').attr('content');
    
    hookup(methodName, view_path, view_name, layout);
  };

  /**
   * Runs an 'event method' on a view object and a layout object defined by the headers
   * we specially set on ajax requests.
   * 
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   * @param {XMLHttpRequest} request The returning ajax request.
   */  
  function ajax_hookup(methodName, request) {
    var view_path = request.getResponseHeader('x-ediface-view_path');
    var view_name = request.getResponseHeader('x-ediface-view_name');
    var layout    = request.getResponseHeader('x-ediface-layout');
    
    hookup(methodName, view_path, view_name, layout);
  }
  
  /**
   * Runs an 'event method' on a view object and a layout object.
   * @example hookup('onLoad', 'annos', 'list', 'application);
   * Will call annosList.onLoad() and layoutsApplication.onLoad() if they exist.
   * 
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   * @param {String} view_path The camelcased path to the view, often the same as the controller name.
   * @param {String} view_name The name of the view being rendered.
   * @param {String} layout The layout being used. If there is no layout this is 'no_layout'
   */
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

  /**
   * Runs an 'event method' on a view object if it exists.
   * 
   * @param {String} objectName The name of the view object, e.g annosList.
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   */
  function hookup_once(objectName, methodName) {
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
  
  //after every ajax request
  $(window).bind('ajaxComplete', function(event, request) {
    ajax_hookup('onAjaxComplete', request);
    page_level_hookup('onAjaxComplete');
    $.attach_widgets();
    ajax_hookup('onWidgetsReady', request);
    page_level_hookup('onWidgetsReady');
    $(document).trigger('widgetsReady');
  });
  
  
  // *********** EDIFACE WIDGET CODE *********** //
    
  /**
    @name $.ediface_widgets 
    @namespace 
    @description Our widgets live here.
   */
  $.ediface_widgets = {};
  
  /**
   * Runs attach_widget() on any widget found in the html which isn't already attached.
   */  
  $.attach_widgets = function() {
   $('[data-widget]:not([data-widget-attached])').attach_widget();
  };
  
  /**
   * Call $.WIDGET_NAME on the matched elements where WIDGET_NAME is set in the
   * data-widget attribute.
   *
   * @param {Object} extra_options Use these options in addition to those specified
   * in the html as data-widget-OPTION_NAME=VALUE
   *
   * @throws {Exception} If a widget has already been attached.
   * @throws {Exception} If the type of widget doesn't exist.
   */
  $.fn.attach_widget = function(extra_options) {
    return this.each(function() {
      var $e = $(this), fn_name = $e.attr('data-widget');

      // error checking
      if ($e.attr('data-widget-attached')) {
        throw('attach_widget called on already attached widget.');
      }
      if (!(fn_name in $.ediface_widgets)) {
        throw("ediface widget '" + fn_name + "'   is not defined.");
      }

      // attach extra options to the widget
      if (typeof(extra_options) != 'undefined') {
        $.each(extra_options, function(name, def) {
          $e.data('widget-' + name, def);
        });      
      }

      // load the widget up
      $.ediface_widgets[fn_name].call($e);
      $e.attr('data-widget-attached', true);
    });
  };
  
  /**
   * Make a widget out of an element which doesn't already have data-widget set
   * in the html.
   *
   * @param {String} Type Type of widget, e.g 'ajax_form'
   * @param {Object} Options for widget.
   */
  $.fn.create_widget = function(type, options) {
    return $(this).attr('data-widget', type).attach_widget(options);
  };
    
  /**
   * @constant
   */
  $.ediface_widgets.REQUIRED = '*** VALUE REQUIRED ***';
  
  /**
   * Read the set of options attached to a widget via data-widget-OPTION_NAME
   * in the html.
   *
   * @param {Object} defaults Specifies the names and default values of 
   * applicable options. Set default value to $.ediface_widgets.REQUIRED to indicate
   * a mandatory value.
   *
   * @returns {Object} The options calculated.
   *
   * @throws {Exception} If a required option is not found.
   */  
  $.fn.read_options = function(defaults) {
    var that = this;
    var options = {};
    $.each(defaults, function(name, def) {
      var val = that.data('widget-' + name) || that.attr('data-widget-' + name);
      
      if (val) {
        options[name] = val;
      } else {
        if (def === $.ediface_widgets.REQUIRED) {
          throw("Widget argument required: " + name);
        }
        
        options[name] = def;
      }
    });
    
    return options;
  }
}(jQuery));
