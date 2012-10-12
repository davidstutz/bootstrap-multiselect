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
		var defaults = {
			button: 'btn',
			width: 'auto',
			text: function(options) {
				if (options.length == 0) {
					return 'None selected';
				}
				else if (options.length > 3) {
					return options.length + ' selected';
				}
				else {
					var selected = '';
					options.each(function() {
						selected += $(this).text() + ', ';
					});
					return selected.substr(0, selected.length -2);
				}
			}
		};
		
		options = $.extend(defaults, options);
		
		var select = element,
			container = $('<span class="dropdown"><a style="width:' + options.width + '" class="dropdown-toggle ' + options.button + '" data-toggle="dropdown">' + options.text($('option:selected', select)) + ' <b class="caret"></b></a><ul class="dropdown-menu" role="menu"></ul></span>');
		
		if (!$(select).attr('multiple')) {
			$(select).attr('multiple', true);
		}
		
		$('option', select).each(function() {
			if ($(this).is(':selected')) {
				$(this).attr('selected', true);
			}
			
			$('ul', container).append('<li><a href="#"><label class="checkbox"><input type="checkbox" value="' + $(this).val() + '"> ' + $(this).text() + '</label></a></li>');
			
			var selected = $(this).attr('selected') || false,
				checkbox = $('li input[value="' + $(this).val() + '"]', container);
				
			checkbox.attr('checked', selected);
			
			if (selected) {
				checkbox.parents('li').addClass('active');
			}
		});
		
		$(select).hide()
			.after(container);
		
		$('.dropdown-toggle', container).dropdown();
		
		$('li label', container).css({'cursor': 'pointer'});
		
		$('li input[type="checkbox"]', container).on('change', function(event) {
			var checked = $(this).attr('checked') || false;
			
			if (checked) {
				$(this).parents('li').addClass('active');
			}
			else {
				$(this).parents('li').removeClass('active');
			}
			
			$('option[value="' + $(this).val() + '"]', select).attr('selected', checked);
			
			$('.dropdown-toggle', container).html(options.text($('option:selected', select)) + ' <b class="caret"></b>');
		});
		
		$('li a', container).on('click', function(event) {
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

}(window.jQuery);