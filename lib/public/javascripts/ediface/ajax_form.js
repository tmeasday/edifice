/*
  Turn a standard form into an 'ajax' form. 
  
    -- Relies on the action that the form points to to return a 422 with a new,
    'errored' form if there is a (server-side) validation problem. 
    Otherwise calls the various callbacks..
    
    Extra arguments:
      - status_sel: the selector of an element to set the classes 'submitting/success/error'
          on depending on the state of the form. Defaults to the form itself.
      - validators: a hash of input selectors to validation functions (or names)
          for client-side validation. 
*/

(function($){
  // you don't need to make it a widget via html, you can simply call ajax_form on the form
  $.fn.ajax_form = function(options) {
    $(this).attr('data-widget', 'ajax_form')
      .attach_widget(options);
  };
  
  $.fn.ediface_widgets.ajax_form = function() {
    return this.each(function(){
      var settings = $(this).read_options({
        status_sel: this, // element to set to .submitting/.success/.error as we submit
        //default callbacks
        error: function(x, t, e, form){
          if (x.status >= 400 && x.status < 500) { // a CLIENT ERROR
            //validation failed replace form with new one
            var $new_form = $(x.responseText);
            $(form).replaceWith($new_form);
            // -- not sure this is the best way to pass extra settings through, but it seems to work.
            $new_form.ajax_form(settings);
          } else if (x.status >= 500 && x.status < 600) { // a SERVER ERROR
            // replace the whole page -- FIXME -- do this properly
            $('body').replaceWith(x.responseText);
          } else {
            alert('Form failed. Please try again.');
          }
        },
        success: function(d, s, form){},
        complete: function(x, t, form){},
        submit: function(e){}, // return false to cancel submit
        validators: {}
      });
      
      // prepare the validators that are references
      for (var selector in settings.validators) {
        var validator = settings.validators[selector];
        if (typeof(validator) === 'string') {
          validator = settings.validators[selector] = $.ediface_widgets.ajax_form.validators[validator];
        }
        $(selector).bind('change.ajax_form focusout.ajax_form', function(event) {
          validate($(this), validator);
        });
      }
      
      
      function set_status_class(name) {
        $.each(['form_submitting', 'form_success', 'form_error'], function(i, old_name) {
          $(settings.status_sel).removeClass(old_name);
        });
        $(settings.status_sel).addClass(name);
      };
      
      $(this).bind("submit.ajax_form", function(ev){
        var form = this;
        
        ev.preventDefault();
        
        // do client-side validations
        var valid = true, $first_error;
        for (var selector in settings.validators) {
          if (!validate($(selector), settings.validators[selector])) {
            if (valid) { valid = false; $first_error = $(selector); }
          }
        }
        if (!valid) { $first_error.focus(); return false; }
        
        // run the user defined submit function
        if (settings.submit(ev) === false) return false;
        
        // disable the first submit button on the form
        $(form).find('input[type=submit]:first').attr('disabled', true);
        
        // set the status
        set_status_class('form_submitting');
        
        // send up the form and process the results
        $.ajax({
          cache: false,
          data: $.param($(form).serializeArray()),          
          type: form.method,
          url: form.action,
          error: function (x, t, e) {
            // console.log('error');
            settings.error(x, t, e, form); 
            set_status_class('form_error');
          },
          success: function (d, s) {
            // console.log('success');
            settings.success(d, s, form);
            set_status_class('form_success');
          },
          complete: function (x, t) {
            // console.log('complete');
            // enable the first submit button on the form
            $(form).find('input[type=submit]:first').attr('disabled', false);
            
            settings.complete(x, t, form); 
          }
        });
        
        return false;
      });
    });    
  };
  
  // call this on a div that represents a form element.
  // sets the right classes and enables disables actual form elements
  $.fn.form_element_state = function(command) {
    switch (command) {
      case 'disabled':
        this.addClass('disabled')
          .find('input, select').attr('disabled', true);
        break;
      case 'enabled':
        this.removeClass('disabled')
          .find('input, select').removeAttr('disabled');
        break;
    }
    return this;
  };
  
  function clearError(id) {
    // run over the input and the label pointing to it
    $('.fieldWithErrors').find('> #' + id + ', > label[for=' + id + ']').unwrap();
    $('label[for=' + id  + ']').next('.formError').remove();
  };
  
  function addError(id, error) {
    // right now this is causing focus issues and we don't need it, so I won't waste time
    // fixing it.... but it could be used for different form layouts...
    // $('#' + id + ', label[for=' + id + ']').wrap('<div class="fieldWithErrors"></div>');
    $('label[for=' + id  + ']').after('<div class="formError">' + error + '</div>');
  };
  
  // calls a validator, and takes care of setting the errors string
  function validate($input, validator) {
    var id = $input.attr('id');
    // clear existing validations
    clearError(id);
    
    var error = validator($input);
    if (error === true) {
      return true;
    } else {
      addError(id, error);
      return false;
    }      
  }
  
  // validators expect a form element and return true or an error message
  $.ediface_widgets.ajax_form = {};
  $.ediface_widgets.ajax_form.validators = {
    not_empty: function($input) {
      return $input.val() ? true : 'must not be empty';
    }
  };

  // standardize .focus() for input tags. IE doesn't place the focus at the 
  // end of the input box, this fixes it
  $.fn.inputFocus = function() {
    return this.each(function(){
      if ($.browser.msie) {
        if (this.createTextRange) {
          var FieldRange = this.createTextRange();
          FieldRange.moveStart('character', this.value.length);
          FieldRange.collapse();
          FieldRange.select();
        }
      } else {
        this.focus();
      }
    });
  };
}(jQuery));

