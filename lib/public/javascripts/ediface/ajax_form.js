/*
  Turn a standard form into an 'ajax' form. 
  
    -- Relies on the action that the form points to to return a 422 with a new,
    'errored' form if there is a validation problem. Otherwise calls the various
    callbacks..
*/

(function($){
  // you don't need to make it a widget via html, you can simply call ajax_form on the form
  $.fn.ajax_form = function(options) {
    console.log('ajax_form');
    $(this).attr('data-widget', 'ajax_form')
      .attach_widget(options);
  };
  
  $.fn.ediface_widgets.ajax_form = function() {
    return this.each(function(){
      console.log('creating ajax_form');
      var settings = $(this).read_options({
        status_sel: this, // element to set to .submitting/.success/.error as we submit
        //default callbacks
        error: function(x, t, e, form){
          if (x.status == 422) {
            //validation failed replace form with new one
            var $new_form = $(x.responseText);
            $(form).replaceWith($new_form);
            // -- not sure this is the best way to pass extra settings through, but it seems to work.
            $new_form.ajax_form(settings);
          } else {
            alert('Form failed. Please try again.');
          }
        },
        success: function(d, s, form){},
        complete: function(x, t, form){},
        submit: function(e){} // return false to cancel submit      
      });
      
      function set_status_class(name) {
        console.log(name);
        $.each(['form_submitting', 'form_success', 'form_error'], function(i, old_name) {
          $(settings.status_sel).removeClass(old_name);
        });
        $(settings.status_sel).addClass(name);
      };
      
      
      $(this).bind("submit", function(ev){
        var form = this;
        
        ev.preventDefault();
        
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
            console.log('error');
            settings.error(x, t, e, form); 
            set_status_class('form_error');
          },
          success: function (d, s) {
            console.log('success');
            settings.success(d, s, form);
            set_status_class('form_success');
          },
          complete: function (x, t) {
            console.log('complete');
            // enable the first submit button on the form
            $(form).find('input[type=submit]:first').attr('disabled', false);
            
            settings.complete(x, t, form); 
          }
        });
        
        return false;
      });
    });    
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

