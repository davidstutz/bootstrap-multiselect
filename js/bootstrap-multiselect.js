/**
 * bootstrap-multiselect.js 1.0.0
 * https://github.com/davidstutz/bootstrap-multiselect
 * 
 * Copyright 2012 David Stutz 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
!function ($) {

	"use strict"; // jshint ;_;

	var Multiselect = function(element, options) {
		var select = element,
			options =  $.extend($.fn.multiselect.options, options),
			button = $('<span class="dropdown"><a style="width:' + options.width + '" class="btn dropdown-toggle" data-toggle="dropdown">' + ($('option:selected', select).length > 0 ? $.fn.multiselect.options.selected($('option:selected', select)) : $.fn.multiselect.options.none) + ' <b class="caret"></b></a><ul class="dropdown-menu" role="menu"></ul></span>');
					
		$(select).hide();
		
		if (!$(select).attr('multiple')) {
			$(select).attr('multiple', true);
		}
		
		$('option', select).each(function() {
			if ($(this).is(':selected')) {
				$(this).attr('selected', true);
			}
			
			$('ul', button).append('<li><a href="#"><label class="checkbox"><input type="checkbox" value="' + $(this).val() + '"> ' + $(this).text() + '</label></a></li>');
		});
		
		$(select).after(button);
		
		$('option', select).each(function() {
			var selected = $(this).attr('selected') || false,
				checkbox = $('li input[value="' + $(this).val() + '"]', button);
				
			checkbox.attr('checked', selected);
			
			if (selected) {
				checkbox.parents('li').addClass('active');
			}
		});
		
		$('.dropdown-toggle', button).dropdown();
		
		$('li label', button).css({'cursor': 'pointer'});
		
		$('li input[type="checkbox"]', button).on('change', function(event) {
			var checked = $(this).attr('checked') || false;
			
			if (checked) {
				$(this).parents('li').addClass('active');
			}
			else {
				$(this).parents('li').removeClass('active');
			}
			
			$('option[value="' + $(this).val() + '"]', select).attr('selected', checked);
			
			$('.dropdown-toggle', button).html(($('option:selected', select).length > 0 ? $.fn.multiselect.options.selected($('option:selected', select)) : $.fn.multiselect.options.none) + ' <b class="caret"></b>');
		});
		
		$('li a', button).on('click', function(event) {
			event.stopImmediatePropagation();
		});
	};

	$.fn.multiselect = function (options) {
		return this.each(function () {
			var data = $(this).data('multiselect');
		
			if (!data) {
				$(this).data('multiselect', (data = new Multiselect(this, options)));
			}
		});
	}

	Multiselect.prototype.constructor = Multiselect;
	
	$.fn.multiselect.options = {
		// The width of the button.
		width: 'auto',
		// Text for button if no option is selected.
		none: 'None selected',
		// Must be a function returning the label for the button.
		selected: function(options) {
			if (options.length > 3) {
				return options.length + ' selected';
			}
			else {
				var selected = '';
				options.each(function() {
					selected += $(this).text() + ', ';
				});
				return selected.substr(0, selected.length -2);
			}
		},
	}

}(window.jQuery);