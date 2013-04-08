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

	if(typeof ko != 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect){
		ko.bindingHandlers.multiselect = {
			init: function (element) {
				var ms = $(element).data('multiselect');

				if(!ms)
					throw new Error("Bootstrap-multiselect's multiselect() has to be called on element before applying the Knockout View model!");

				var prev = ms.options.onChange;

				ms.options.onChange = function(option, checked){
					// We dont want to refresh the multiselect since it would delete / recreate all items
					$(element).data('blockRefresh', true);

					// Force the binding to be updated by triggering the change event on the select element
					$(element).trigger('change');

					// Call any defined change handler
					return prev(option, checked);
				}
			},
			update: function (element) {
				var blockRefresh = $(element).data('blockRefresh') || false;
				if (!blockRefresh) { $(element).multiselect("rebuild"); }
				$.data(element, 'blockRefresh', false);
			}
		};
	}

	function Multiselect(select, options) {
		
		this.options = this.getOptions(options);
		this.$select = $(select);
		
		// Manually add the multiple attribute, if its not already set.
		if (!this.$select.attr('multiple')) {
			this.$select.attr('multiple', true);
		}
		
		this.$container = $(this.options.buttonContainer)
			.append('<button type="button" class="multiselect dropdown-toggle ' + this.options.buttonClass + '" data-toggle="dropdown">' + this.options.buttonText(this.getSelected(), this.$select) + '</button>')
			.append('<ul class="dropdown-menu"></ul>');

		if (this.options.buttonWidth) {
			$('button', this.$container).css({
				'width': this.options.buttonWidth
			});
		}

		// Set max height of dropdown menu to activate auto scrollbar.
		if (this.options.maxHeight) {
			$('ul', this.$container).css({
				'max-height': this.options.maxHeight + 'px',
				'overflow-y': 'auto',
				'overflow-x': 'hidden'
			});
		}

		this.buildDropdown();

		this.$select
			.hide()
			.after(this.$container);
	};

	Multiselect.prototype = {
		
		defaults: {
			// Default text function will either print 'None selected' in case no option is selected,
			// or a list of the selected options up to a length of 3 selected options.
			// If more than 3 options are selected, the number of selected options is printed.
			buttonText: function(options, select) {
				if (options.length == 0) {
					return 'None selected <b class="caret"></b>';
				}
				else if (options.length > 3) {
					return options.length + ' selected <b class="caret"></b>';
				}
				else {
					var selected = '';
					options.each(function() {
						var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

						selected += label + ', ';
					});
					return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
				}
			},
			// Is triggered on change of the selected options.
			onChange: function(option, checked) {
				
			},
			buttonClass: 'btn',
			selectedClass: 'active',
			buttonWidth: 'auto',
			buttonContainer: '<div class="btn-group" />',
			// Maximum height of the dropdown menu.
			// If maximum height is exceeded a scrollbar will be displayed.
			maxHeight: false,
		},

		constructor: Multiselect,
		
		// Will build an dropdown element for the given option.
		createOptionValue: function(element) {
			if ($(element).is(':selected')) {
				$(element).attr('selected', 'selected');
				$(element).prop('selected', 'selected');
			}
			
			// Support the label attribute on options.
			var label = ($(element).attr('label') !== undefined) ?  $(element).attr('label') : $(element).text();
			var value = $(element).val();
			var li = $('<li><a href="javascript:void(0);" style="padding:0;"><label style="margin:0;padding:3px 20px 3px 20px;height:100%;cursor:pointer;"><input style="margin-bottom:5px;" type="checkbox" /></label></a></li>');

			var selected = $(element).prop('selected') || false;
			var checkbox = $('input', li);
			checkbox.val(value);
			$('label', li).append(" " + label);

			$('ul', this.$container).append(li);

			if ($(element).is(':disabled')) {
				checkbox.attr('disabled', 'disabled').prop('disabled', 'disabled').parents('li').addClass('disabled')
			}
			
			checkbox.prop('checked', selected);

			if (selected && this.options.selectedClass) {
				checkbox.parents('li').addClass(this.options.selectedClass);
			}
		},

		// Build the dropdown and bind event handling.
		buildDropdown: function () {
			this.$select.children().each($.proxy(function (index, element) {
				// Support optgroups and options without a group simultaneously.
				var tag = $(element).prop('tagName').toLowerCase();
				if (tag == 'optgroup') {
					var group = element;
					var groupName = $(group).prop('label');
					
					// Add a header for the group.
					var li = $('<li><label style="margin:0;padding:3px 20px 3px 20px;height:100%;" class="multiselect-group"></label></li>');
					$('label', li).text(groupName);
					$('ul', this.$container).append(li);
					
					// Add the options of the group.
					$('option', group).each($.proxy(function (index, element) {
						this.createOptionValue(element);
					}, this));
				}
				else if (tag == 'option') {
					this.createOptionValue(element);
				}
				else
				{
					// ignore illegal tags
				}
			}, this));

			// Bind the change event on the dropdown elements.
			$('ul li input[type="checkbox"]', this.$container).on('change', $.proxy(function(event) {
				var checked = $(event.target).prop('checked') || false;

				if (this.options.selectedClass) {
					if (checked) {
						$(event.target).parents('li').addClass(this.options.selectedClass);
					}
					else {
						$(event.target).parents('li').removeClass(this.options.selectedClass);
					}
				}

				var option = $('option', this.$select).filter(function () { return $(this).val() == $(event.target).val(); })

				if (checked) {
					option.attr('selected', 'selected');
					option.prop('selected', 'selected');
				}
				else {
					option.removeAttr('selected');
				}
				
				var options = this.getSelected();
				
				$('button', this.$container).html(this.options.buttonText(options, this.$select));

				this.options.onChange(option, checked);
			}, this));

			$('ul li a', this.$container).on('click', function(event) {
				event.stopPropagation();
			});

			// Keyboard support.
			this.$container.on('keydown', $.proxy(function(event) {
				if ((event.keyCode == 9 || event.keyCode == 27) && this.$container.hasClass('open')) {
					// Close on tab or escape.
					$(this.$container).find(".multiselect.dropdown-toggle").click();
				}
				else {
					var $items = $(this.$container).find("li:not(.divider):visible a");

					if (!$items.length) {
						return;
					}

					var index = $items.index($items.filter(':focus'));

					// Navigation up.
					if (event.keyCode == 38 && index > 0) {
						index--;
					}
					// Navigate down.
					else if (event.keyCode == 40 && index < $items.length - 1) {
						index++;
					}
					else if (!~index) {
						index = 0;
					}

					var $current = $items.eq(index);

					$current.focus();

					// Override style for items in li:active.
					if (this.options.selectedClass == "active") {
						$current.css("outline", "thin dotted #333").css("outline", "5px auto -webkit-focus-ring-color");

						$items.not($current).css("outline", "");
					}

					if (event.keyCode == 32 || event.keyCode == 13) {
						var $checkbox = $current.find('input[type="checkbox"]');

						$checkbox.prop("checked", !$checkbox.prop("checked"));
						$checkbox.change();
					}

					event.stopPropagation();
					event.preventDefault();
				}
			}, this));
		},

		// Destroy - unbind - the plugin.
		destroy: function() {
			this.$container.remove();
			this.$select.show();
		},

		// Refreshs the checked options based on the current state of the select.
		refresh: function() {
			$('option', this.$select).each($.proxy(function(index, element) {
				var input = $('ul li input', this.$container).filter(function () { return $(this).val() == $(element).val(); });

				if ($(element).is(':selected')) {
					input.prop('checked', true);

					if (this.options.selectedClass) {
						input.parents('li').addClass(this.options.selectedClass);
					}
				}
				else {
					input.prop('checked', false);

					if (this.options.selectedClass) {
						input.parents('li').removeClass(this.options.selectedClass);
					}
				}
			}, this));
			
			var options = this.getSelected();
			$('button', this.$container).html(this.options.buttonText(options, this.$select));
		},
		
		// Select an option by its value.
		select: function(value) {
			var option = $('option', this.$select).filter(function () { return $(this).val() == value; });
			var checkbox = $('ul li input', this.$container).filter(function () { return $(this).val() == value; });
			
			if (this.options.selectedClass) {
				checkbox.parents('li').addClass(this.options.selectedClass);
			}

			checkbox.prop('checked', true);
			
			option.attr('selected', 'selected');
			option.prop('selected', 'selected');
			
			var options = this.getSelected();
			$('button', this.$container).html(this.options.buttonText(options, this.$select));
		},
		
		// Deselect an option by its value.
		deselect: function(value) {
			var option = $('option', this.$select).filter(function () { return $(this).val() == value; });
			var checkbox = $('ul li input', this.$container).filter(function () { return $(this).val() == value; });

			if (this.options.selectedClass) {
				checkbox.parents('li').removeClass(this.options.selectedClass);
			}

			checkbox.prop('checked', false);
			
			option.removeAttr('selected');
			option.removeProp('selected');
			
			var options = this.getSelected();
			$('button', this.$container).html(this.options.buttonText(options, this.$select));
		},
		
		// Rebuild the whole dropdown menu.
		rebuild: function() {
			$('ul', this.$container).html('');
			this.buildDropdown(this.$select, this.options);
			var options = this.getSelected();
			$('button', this.$container).html(this.options.buttonText(options, this.$select));
		},

		// Get options by merging defaults and given options.
		getOptions: function(options) {
			return $.extend({}, this.defaults, options);
		},
		
		// For IE 9 support.
		getSelected: function() {
			if (navigator.appName == 'Microsoft Internet Explorer') {
			    var regex  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			    if (regex.exec(navigator.userAgent) != null) {
			    	return $('option:selected', this.$select);
			  	}
			}
		
			return $('option[selected]', this.$select);
		}
	};

	$.fn.multiselect = function (option, parameter) {
		return this.each(function () {
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
	}
}(window.jQuery);
