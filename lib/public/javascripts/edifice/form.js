(function($) {
$.edifice = $.edifice || {};

// add methods to a form element so it can be easily manipulated
//
// add client side validation
// understands:
//   - rails form structures
//   - rails form errors in JSON
//   - etc
$.fn.edifice_form = function() {
  $.extend(this, methods);
  return this;
};

// VALIDATORS: 
  // validators expect a form element and return true or an error message
$.fn.edifice_form.validators = {
  not_empty: function($input) {
    return $input.val() ? true : 'must not be empty';
  }
};


// in these 'this' is the $form
var methods = {
  fields: function() {
    return this.find('input, textarea, select');
  },
  
  error_fields: function() {
    var $form = this;
    return this.fields().filter(function() {
      return $form.has_error($(this));
    });
  },
  
  submits: function() {
    return this.find('input[type=submit], button[type=submit]');
  },
  
  valid: function() {
    var $form = this, valid = true;
    
    this.fields().each(function() {
      if (!$form.validate($(this))) { valid = false; }
    });
    
    return valid;
  },
  
  // 'prepare' a validator --> validator returns true or an error string
  set_validator: function($field, validator) {
    if (typeof validator === 'string') {
      validator = $.fn.edifice_form.validators[validator] || validator;
      if (typeof validator !== 'function') { throw "Validator not defined: '" + validator + "'"; }
    };
    $field.data('validator', validator);
  },
  
  // validate a single field
  validate: function($field) {
    var validator;
    if (validator = $field.data('validator')) {
      var error = validator($field), valid = error === true;
      this.clear_error($field);
      if (!valid) {
        this.add_error($field, error);
      }

      return valid;      
    } else {
      return true;
    }
  },
  
  has_error: function($field) {
    return $field.parent('.field_with_errors').length > 0;
  },
  
  clear_error: function($field) {
   var id = $field.attr('id');
   if (this.has_error($field)) { $field.unwrap() }
   
   this.find('.field_with_errors label[for=' + id + ']')
    .unwrap()
    .next('.formError').remove();
  },
  
  add_error: function($field, error) {
    var id = $field.attr('id');
    $field.wrap('<div class="field_with_errors">');
    this.find('label[for=' + id + ']')
      .wrap('<div class="field_with_errors">')
      .after('<div class="formError">' + error + '</div>');
  },
  
  set_errors: function(errors) {
    for (var name in errors) {
      this.add_error(this.fields().filter('[name*=' + name + ']'), errors[name][0]);
    }
  }
};

}(jQuery));