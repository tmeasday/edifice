/**
  * @fileOverview a proto-framework for javascript-rails integration using jQuery
  * @author Tom Coleman
  * @author Zoltan Olah
  * @author Joe Dollard
  */

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
      classes = classes.replace(/[cvl]_\w*/g, '')
      return classes + ' c_' + ucc(page_details.view_path) +
        ' v_' + ucc(page_details.view_name) + ' l_' + ucc(page_details.layout);
    });
  }
  
  // when the dom is ready
  //  - tell the page that it's ready
  //  - then tell the page that widgets have loaded
  $(document).ready(function() {
    page_level_hookup('onReady');
  });
  
  // when the page is fully loaded (all frames, images, etc)
  $(window).load(function() {
    page_level_hookup('onLoad');
  });
  
  // after every ajax request
  //  - treat the ajax'ed page as if it's loaded normally
  //  - tell the original page that some ajax has happened
  $(function() {
    $('body').ajaxComplete(function(event, request) {
      ajax_hookup('onReady', request);
      page_level_hookup('onAjaxComplete');
    });
    
    // special code for dealing with pjax requests
    $('body').bind('pjax:end', function(event, request) {
      // we need to update any body classes based on the request headers
      update_page_details(extract_page_details_from_ajax(request));
    });
  });
}(jQuery));
