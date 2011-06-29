(function($) {
var defaults = {
  status_element: this, // element to set to .submitting/.success/.error as we submit
  // a hash of input selector -> validation functions/names
  validators: {},
  // type of data to pass around (and thus what's seen by e.g. success)
  dataType: 'html'
};

// EVENTS that fire during the course of the life of the submission:
//  submit, invalid, success | error (+ user_error | server_error), complete
//
// -> success,errors + complete are all passed the data you would expect from 
// jQuery.ajax

$.edifice_widgets.ajax_form = function() { return this.each(ajax_form); }
  
function ajax_form() {
  var $form = $(this).edifice_form();
  $form.settings = $form.read_options(defaults); 
  $.extend($form, methods);
  
  $form.initialize();
}
var methods = {
  initialize: function() {
    this.prepare_validators();
    this.prepare_submit();
  },
  
  prepare_validators: function() {
    var $form = this;
    
    // setup validators from settings
    for (var selector in $form.settings.validators) {
      $form.set_validator($(selector), $form.settings.validators[selector]);
    }
    
    // setup validators from html
    $form.fields().filter('[data-widget-validator]').each(function() {
      $form.set_validator($(this), $(this).attr('data-widget-validator'));
    });
    
    // listen to validator
    this.fields().live('change.ajax_form focusout.ajax_form', function() { 
      $form.validate($(this)); 
    });
  },
  
  prepare_submit: function() {
    var $form = this;
    this.submit(function(event) {
      event.preventDefault();
      
      // do pre-submit validations
      if (!$form.valid()) {
        $form.trigger('invalid');
        $form.error_fields().eq(0).focus(); // focus the first error
        return false; // we are done.
      }
      
      $form.submits().attr('disabled', true); // disable submit buttons
      
      // TODO - set status class
      
      // send up the form and process the results
      $.ajax({
        url: $form.attr('action'), type: $form.attr('method'),
        dataType: $form.settings.dataType,
        data: $.param($form.serializeArray()),
        cache: false,
        error: function (x, t, e) { $form.error(x, t, e); },
        success: function (data, status) {
          $form.trigger('success', data, status);
        },
        complete: function (request, text_status) {
          $form.trigger('complete', request, text_status);
          
          $form.submits().removeAttr('disabled');
        }
      });
      
      return false;
    });
  },
  
  error: function(request, text_status, error) {
    this.trigger('error', request, status, error);
    
    // handle the different possible errors that we can see
    if (request.status >= 400 && request.status < 500) { 
      // CLIENT ERROR -- server-side validation failed.
      this.trigger('client_error', request, status, error);
      
      // if data is html, we replace this content of the form with the content
      // of the form that we've just received back
      if (this.settings.dataType === 'html') {
        // wrap in a div incase there are a bunch of floating elements, pull the form out
        var $new_form = $('<div>').append(request.responseText).find('#' + this.attr('id'));
        
        this.html($new_form.html());
        this.prepare_validators();
        
      } else if (this.settings.dataType === 'json') {
        // we will be receiving an error object back, we can pass it straight into form.js
        this.set_errors($.parseJSON(request.responseText));
      } else {
        throw "Don't know how to handle dataType " + this.settings.dataType;
      }
    } else if (x.status >= 500 && x.status < 600) { 
      // a SERVER ERROR -- something unrecoverable happened on the server
      this.trigger('server_error', request, status, error);
      
      // we aren't going to do anything here.
      // FIXME: we should probably have a way to set this behaviour at the application level.
      // for instance, you probably just want to redirect to somewhere, or show a dialog,
      // or popup something or.....?
    } else {
      // some other kind of error. Revisit
      alert('Form failed. Please try again.');
    }
    
    
  },
}
  
}(jQuery));