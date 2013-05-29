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
	
	/**
	 * Constructor. 
	 * 
	 * The constructor builds the dropdown and assigns event handling.
	 * 
	 * @param	object	select
	 * @param	object	options 
	 */
	function Multiselect(select, config) {
		
		// Reference the current instance so proxy is not needed.
		var self = this;
		
		// Configuration is saved as config, so the plugin "configuration" and select "options" can be distinguished.
		self.config = self.mergeConfig(config);
		
		// The select options are saved in an internal data structure, which can be updated by refreh.
		self.options = $('> optgroup, > option', $(select))
		console.log(this.options);
		
		// Save the select for refreshing the options later on.
		self.select = select;
		
		var ul = $('<ul class="dropdown-menu" role="dropdown"></ul>');
		
		function buildLiFromOption(option) {
			var label = $(option).attr('label') || $(option).text();
			var value = $(option).val();
			
			return $('<li><a href="#"><input type="checkbox" value="' + value + '" />' + label + '</a></li>');
		}
		
		// Now build up the dropdown list using checkboxes and labels.
		$.each(self.options, function(index, element) {
			var tag = $(element).prop('tagName');
			
			if (tag.toLowerCase() == 'optgroup') {
				$('> option', element).each(function() {
					ul.append(buildLiFromOption(this));
				});
			}
			else if (tag.toLowerCase() == 'option') {
				ul.append(buildLiFromOption(element));
			}
		});
		
		var container = $('<div class="dropdown"><button class="btn dropdown-toggle" data-toggle="dropdown">open</button></div>');
		container.append(ul);
		
		$(self.select).after(container);
		
		$('> li > a').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		
		$('> li > a > checkbox', ul).on('click', function(event) {
			console.log($(this).val());
			this.select($(this).val());
		});
	};

	Multiselect.prototype = {
		
		/**
		 * @property	object	default options 
		 */
		defaults: {
			
		},

		constructor: Multiselect,
		
		/**
		 * Select the option represented by the given value.
		 * 
		 * @param	string	value 
		 */
		select: function(value) {
			
		},
		
		/**
		 * Deselect the option represented by the value.
		 *
		 * @param	string	value
		 */
		deselect: function(value) {
			
		},
		
		/**
		 * Destroy/unbind the plugin.
		 */
		destroy: function() {
			
		},
		
		/**
		 * Refresh the options.
		 */
		refresh: function() {
			
		},
		
		/**
		 * Get the selected options.
		 * 
		 * @return	selected 
		 */
		selected: function() {
			
		},
		
		/**
		 * Get all deselected options
		 * 
		 * @return	deselected 
		 */
		deselected: function() {
			
		},
		
		/**
		 * Merge the given and the default configuration options.
		 * 
		 * @param	object	options
		 */
		mergeConfig: function(config) {
			return $.extend({}, this.defaults, config);
		},
	};

    $.fn.multiselect = function(option, parameter) {
        return this.each(function() {
            var data = $(this).data('multiselect'),
                options = typeof option == 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                $(this).data('multiselect', (data = new Multiselect(this, options)));
            }

            // Call multiselect method.
            if (typeof option == 'string') {
                data[option](parameter);
            }
        });
    };
	 
	$.fn.multiselect.Constructor = Multiselect;	 
	
	$(function() {
		$('select[data-role=multiselect]').multiselect();
	});
	
}(window.jQuery);
