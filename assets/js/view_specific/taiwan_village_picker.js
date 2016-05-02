/*!
 * Taiwan Village Picker
 * Copyright 2016 Jam Chen
 * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)
 */
// Check for jQuery.
if (typeof(jQuery) === 'undefined') {
  var jQuery;
  // Check if require is a defined function.
  if (typeof(require) === 'function') {
    jQuery = $ = require('jquery');
  // Else use the dollar sign alias.
  } else if ($) {
    jQuery = $;
  }
}


;(function ($) {

  $.fn.taiwan_village_picker = function (options) {
  };

})(jQuery);