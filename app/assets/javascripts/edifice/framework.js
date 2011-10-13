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
   * Extract the view_path/name and layout from the meta tags (as put down by Edifice::Helper::edifice_meta_tags)
   *
   */
  function extract_page_details_from_meta_tags() {
    return {
      view_path: $('meta[name=edifice-view_path]').attr('content'),
      view_name: $('meta[name=edifice-view_name]').attr('content'),
      layout: $('meta[name=edifice-layout]').attr('content')
    };
  }
  /**
   * Runs an 'event method' on a view object and a layout object defined by meta tags
   * we specially set in every layout.
   * 
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   */
  function page_level_hookup(methodName) {
    hookup(methodName, extract_page_details_from_meta_tags());
  };
  
  /**
   * Extract the view_path/name and layout from the headers of an ajax request
   *
   * @param {XMLHttpRequest} request The ajax request
   */
  function extract_page_details_from_ajax(request) {
    return {
      view_path: request.getResponseHeader('x-edifice-view_path'),
      view_name: request.getResponseHeader('x-edifice-view_name'),
      layout: request.getResponseHeader('x-edifice-layout')
    };
  }

  /**
   * Runs an 'event method' on a view object and a layout object defined by the headers
   * we specially set on ajax requests.
   * 
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   * @param {XMLHttpRequest} request The returning ajax request.
   */  
  function ajax_hookup(methodName, request) {
    hookup(methodName, extract_page_details_from_ajax(request));
  }
  
  /**
   * Runs an 'event method' on a view object and a layout object.
   * @example hookup('onLoad', 'annos', 'list', 'application);
   * Will call annosList.onLoad() and layoutsApplication.onLoad() if they exist.
   * 
   * @param {String} methodName The method to call on the view object corresponding to event that's happening.
   * @param {Object} page_details The page details as returned by extract_page_details_from methods. Contains:
   *   view_path The camelcased path to the view, often the same as the controller name.
   *   view_name The name of the view being rendered.
   *   layout The layout being used. If there is no layout this is 'no_layout'
   */
  function hookup(methodName, page_details) {
    //capitalize the first character in a string
    function capitalize_first_chr(str) {
      if ((typeof(str) == 'undefined') || (str.length == 0)) {
        return "";
      }
      
      return str.charAt(0).toUpperCase().concat( str.substr(1) )
    }
    
    // sometimes, on errors, etc these may not be set
    var view_path = page_details.view_path || 'no_controller',
      view_name = page_details.view_name || 'no_view',
      layout = page_details.layout || 'no_layout';
    
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
  
  /**
   * Updates classes set on the body tag (as set by Edifice::Helper::edifice_body_classes), 
   * and meta tags (as set by Edifice::Helper::edifice_meta_tags)
   *
   * @param {Object} page_details The page details as used in hookup above.
   */
  function update_page_details(page_details) {
    function ucc(string) {
      return string.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
    
    $('meta[name=edifice-view_path]').attr('content', page_details.view_path);
    $('meta[name=edifice-view_name]').attr('content', page_details.view_name);
    $('meta[name=edifice-layout]').attr('content', page_details.layout);
    
    $('body').attr('class', function(i, classes) {
      // remove any other classes beginning with c_, v_ or l_
      classes = classes.replace(/[cvl]_.*/g, '')
      return classes + ' c_' + ucc(page_details.view_path) +
        ' v_' + ucc(page_details.view_name) + ' l_' + ucc(page_details.layout);
    });
  }
  
  //when the dom is ready
  $(document).ready(function() {
    page_level_hookup('onReady');
    $('body').attach_widgets().attach_traits();
    page_level_hookup('onWidgetsReady');
    $(document).trigger('widgetsReady');
  });
  
  //when the page is fully loaded (all frames, images, etc)
  $(window).load(function() {
    page_level_hookup('onLoad');
  });
  
  //after every ajax request
  $(function() {
    $('body').ajaxComplete(function(event, request) {
      ajax_hookup('onAjaxComplete', request);
      page_level_hookup('onAjaxComplete');
      $('body').attach_widgets().attach_traits();
      ajax_hookup('onWidgetsReady', request);
      page_level_hookup('onWidgetsReady');
      $(document).trigger('widgetsReady');
    });    

    // special code for dealing with pjax requests
    $('body').bind('pjax:end', function(event, request) {
      // we need to update any body classes based on the request headers
      update_page_details(extract_page_details_from_ajax(request));
    });
  });
  
  // *********** EDIFICE TRAIT CODE ************ //
  
  /**
    @name $.edifice_traits 
    @namespace 
    @description Traits live here.
   */
  $.edifice_traits = {};
  
  /**
   *  Runs $.edifice.traits.X on all contained elements with data-trait containing X
   *
   * @param {Boolean} Reset the checks to see if things have already been attached
   *                   [use this if you have clone an element without copying events]
   *
   *  Records which elements have already been 'traited' via data-trait-attached
   */
  $.fn.attach_traits = function(reset) {
    if (reset) { this.find('[data-trait]').removeAttr('data-trait-attached'); }
    
    for (trait in $.edifice_traits) {
      var $els = this.find('[data-trait~=' + trait + ']:not([data-trait-attached~=' + trait + '])');
      $els.attr('data-trait-attached', function(i, val) { 
        return (val ? val + ' ' : '') + trait; 
      });
      $.edifice_traits[trait].call($els);
    }
    return this;
  }
  

  // *********** EDIFICE WIDGET CODE *********** //

  /**
    @name $.edifice_widgets 
    @namespace 
    @description Our widgets live here.
   */
  $.edifice_widgets = {};

  /**
   * Runs attach_widget() on any widget found in the html which isn't already attached.
   *
   * @param {Boolean} Reset the checks to see if things have already been attached
   *                   [use this if you have clone an element without copying events]
   *
   */  
  $.fn.attach_widgets = function(reset) {
    if (reset) { this.find('[data-widget]').removeAttr('data-widget-attached'); }

    this.find('[data-widget]:not([data-widget-attached])').attach_widget();

    return this;
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
      if (!(fn_name in $.edifice_widgets)) {
        throw("edifice widget '" + fn_name + "'   is not defined.");
      }

      // attach extra options to the widget
      if (typeof(extra_options) != 'undefined') {
        $.each(extra_options, function(name, def) {
          $e.data('widget-' + name, def);
        });      
      }

      // load the widget up
      $.edifice_widgets[fn_name].call($e);
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
  $.edifice_widgets.REQUIRED = '*** VALUE REQUIRED ***';
  
  /**
   * Read the set of options attached to a widget via data-widget-OPTION_NAME
   * in the html.
   *
   * @param {Object} defaults Specifies the names and default values of 
   * applicable options. Set default value to $.edifice_widgets.REQUIRED to indicate
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
        if (def === $.edifice_widgets.REQUIRED) {
          throw("Widget argument required: " + name);
        }
        
        options[name] = def;
      }
    });
    
    return options;
  }
}(jQuery));
