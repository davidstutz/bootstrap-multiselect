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
;(function($) {

	'use strict'; // jshint ;_;

	if(typeof ko != 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect){
		ko.bindingHandlers.multiselect = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {},
			update: function (element, valueAccessor, allBindingsAccessor) {
				var ms = $(element).data('multiselect');
				if (!ms) {
					$(element).multiselect(ko.utils.unwrapObservable(valueAccessor()));
				}
				else if (allBindingsAccessor().options && allBindingsAccessor().options().length !== ms.originalOptions.length) {
					ms.updateOriginalOptions();
					$(element).multiselect('rebuild');
				}
			}
		};
	}

	$.fn.toggleAttr = function(attr, value) {
		return ((value = !!value) ? this.attr(attr, attr) : this.removeAttr(attr)).prop(attr, value);
	};

	function Multiselect(select, options) {

		this.options = this.getOptions(options);
		this.$select = $(select);
		this.originalOptions = this.$select.clone()[0].options; //we have to clone to create a new reference
		this.options.multiple = this.$select.prop('multiple') || this.$select[0].hasAttribute('multiple');

		var $button = $('<button>', {
			'type': 'button',
			'class': 'multiselect dropdown-toggle ' + this.options.buttonClass,
			'data-toggle': 'dropdown',
			'html': this.options.buttonText(this.getSelected(), this.$select)
		});
		this.options.buttonWidth && $button.width(this.options.buttonWidth);

		var $list = $('<ul>', {
			'class': 'multiselect-container dropdown-menu',
			'style': 'position:absolute;list-style-type:none;margin:0;padding:0'
		});
		this.options.dropRight && $list.addClass('pull-right');

		this.$container = $(this.options.buttonContainer).append($button).append($list);

		// Set max height of dropdown menu to activate auto scrollbar.
		if (this.options.maxHeight) {
			$('.multiselect-container', this.$container).css({
				'max-height': this.options.maxHeight + 'px',
				'overflow-y': 'auto',
				'overflow-x': 'hidden'
			});

			$(':text', this.$container).width('75%');
		}

		// Enable filtering.
		if (this.options.enableFiltering) {
			var _query = '';
			var searchTimeout = 0;

			$('<input>', {
				'class': 'multiselect-search',
				'type': 'text',
				'value': _query,
				'placeholder': this.options.filterPlaceholder
			})
				.appendTo(
					$('<div />', {
						'class': 'input-prepend',
						'style': 'padding:3px',
						'html': '<span class="add-on"><i class="icon-search"></i></span>'
					}).prependTo(this.$container.find('.multiselect-container'))
				)
				.click(function(e){e.stopPropagation();})
				.keyup($.proxy(function(e) {
					// This is useful to catch "keydown" events after the browser has updated the control.
					clearTimeout(searchTimeout);
					searchTimeout = this.asyncFunction($.proxy(function () {
						var query = e.target.value;
						if (_query != query) {
							_query = query;

							this.$container.find('.multiselect-container li').each($.proxy(function(i, el) {
								var $el = $(el);
								var $input = $el.find('input');
								var value = $input.val();

								if (value != this.options.selectAllValue) {
									var $option = this.$select.find(['option[value="', '"]'].join(value));
									this.options.filterByText && (value = $option.attr('label') || $option.text());
									var visibled = 0 <= value.indexOf(query);
									$el.toggle(visibled);
									if (!visibled) {
										$input.toggleAttr('checked', false);
										$option.toggleAttr('selected', false);
										// Apply or unapply the configured selected class
										this.options.selectedClass && $el.removeClass(this.options.selectedClass);
									}
								}
							}, this));

							this._checkSelectAll();
							this.updateButtonText();
						}
					}, this), 300);
				}, this));
		}

		this.buildDropdown();

		this.updateButtonText();

		this.$select
			.hide()
			.after(this.$container);
	}

	Multiselect.prototype = {

		defaults: {
			// Default text function will either print 'None selected' in case no option is selected,
			// or a list of the selected options up to a length of 3 selected options.
			// If more than 3 options are selected, the number of selected options is printed.
			buttonText: function(options, select) {
				var caret = ' <b class="caret"></b>';
				var l = options.length;
				if (l) {
					if (3 < l) {
						return [l, caret].join(' selected');
					}
					return $.map(options, function(option) {
						var $option = $(option);
						return $option.attr('label') || $option.text();
					}).join(', ') + caret;
				}
				return 'None selected' + caret;
			},
			// Is triggered on change of the selected options.
			onChange: function(option, checked) {},
			buttonClass: 'btn',
			dropRight: false,
			selectedClass: 'active',
			buttonWidth: 'auto',
			buttonContainer: '<div class="btn-group" />',
			// Maximum height of the dropdown menu.
			// If maximum height is exceeded a scrollbar will be displayed.
			maxHeight: false,
			includeSelectAllOption: false,
			selectAllText: ' Select all',
			selectAllValue: 'multiselect-all',
			enableFiltering: false,
			filterPlaceholder: 'Search',
			filterByText: false
		},

		constructor: Multiselect,

		_checkSelectAll: function() {
			if (this.options.multiple) {
				var $items = this.$container.find('input:visible');
				this.options.enableFiltering && ($items = $items.not('.multiselect-search'));
				var selAllselector = ['[value="', '"]'].join(this.options.selectAllValue);
				var $selectAll = $items.filter(selAllselector);
				$items = $items.not($selectAll);
				var selectAll = $items.filter(':checked').length == $items.length;
				$selectAll.toggleAttr('checked', selectAll);
				this.$select.children('option').filter(selAllselector).toggleAttr('selected', selectAll);
				// Apply or unapply the configured selected class
				this.options.selectedClass
					&& $selectAll.parents('li:first').toggleClass(this.options.selectedClass, selectAll);
			}
		},

		// Will build an dropdown element for the given option.
		createOptionValue: function(el) {
			var $el = $(el);
			var selected = $el.is(':selected');
			selected && $el.toggleAttr('selected', true);

			// Support the label attribute on options.
			var label = $el.attr('label') || $el.text();
			var value = $el.val();
			var inputType = this.options.multiple ? 'checkbox' : 'radio';

			var $li = $('<li><a href="javascript:void(0);" style="padding:0;"><label style="margin:0;padding:3px 20px 3px 20px;height:100%;cursor:pointer;"><input style="margin-bottom:5px;" type="' + inputType + '" /></label></a></li>');

			var $checkbox = $('input', $li);
			$checkbox.val(value);

			if (value == this.options.selectAllValue) {
				$checkbox.parent().parent().addClass('multiselect-all');
			}

			$('label', $li).append(' ' + label);

			$('.multiselect-container', this.$container).append($li);

			if ($el.is(':disabled')) {
				$checkbox.toggleAttr('disabled', true).parents('li').addClass('disabled');
			}

			$checkbox.toggleAttr('checked', selected);

			if (selected && this.options.selectedClass) {
				$checkbox.parents('li').addClass(this.options.selectedClass);
			}
		},

		toggleActiveState: function() {
			this.$container.find('button.multiselect.dropdown-toggle')
				.toggleClass('disabled', this.$select.is(':disabled'));
		},

		// Build the dropdown and bind event handling.
		buildDropdown: function () {
			var $options = this.$select.children('option');
			var $selectAll = $options.first();
			($selectAll.val() == this.options.selectAllValue) || ($selectAll = null);
			// If options.includeSelectAllOption === true, add the include all checkbox
			if (!$selectAll && this.options.multiple && this.options.includeSelectAllOption) {
				$selectAll = $('<option />', {value: this.options.selectAllValue, html: this.options.selectAllText});
				this.$select.prepend($selectAll);
				$options = $selectAll.add($options);
			}
			$selectAll
				&& ($options.filter(':selected').length == $options.not($selectAll).length)
				&& $selectAll.toggleAttr('selected', true);

			this.toggleActiveState();

			$options.each($.proxy(function(i, el) {
				// Support optgroups and options without a group simultaneously
				switch (el.tagName.toLowerCase()) {
					case 'optgroup':
						var $el = $(el);
						// Add a header for the group
						this.$container.find('.multiselect-container').append(
							['<li><label style="margin:0;padding:3px 20px 3px 20px;height:100%" class="multiselect-group">',
							'</label></li>'].join($el.attr('label') || $el.text())
						);
						// Add the options of the group
						$el.find('option').each($.proxy(function(i, el){this.createOptionValue(el);}, this));
						break;

					case 'option':
						this.createOptionValue(el);
						break;

					default:
					// Ignore illegal tags
				}
			}, this));

			// Bind the change event on the dropdown elements.
			this.$container.find('.multiselect-container li input').change($.proxy(function(e) {
				var $target = $(e.target);
				var checked = $target.is(':checked');
				var value = $target.val();

				// Apply or unapply the configured selected class
				this.options.selectedClass && $target.parents('li:first').toggleClass(this.options.selectedClass, checked);

				var $options = this.$select.children('option');
				var $option = $options.filter(['[value="', '"]'].join(value)).toggleAttr('selected', checked);
				$options = $options.not($option);
				var $inputs = this.$container.find('input').not($target);
				this.options.enableFiltering && ($inputs = $inputs.not('.multiselect-search'));

				if (value == this.options.selectAllValue) {
					// Toggle all options if the select all option was changed.
					var values = $inputs
						.filter(':visible')
							.filter(checked ? ':not(:checked)' : ':checked').toggleAttr('checked', checked)
								.map(function(){return this.value;});
					$options
						.filter(function(){return 0<=$.inArray(this.value,values);})
							.toggleAttr('selected', checked);
					// Apply or unapply the configured selected class
					this.options.selectedClass && $inputs.parents('li').toggleClass(this.options.selectedClass, checked);
				} else {
					this._checkSelectAll();
				}

				if (checked) {
					if (!this.options.multiple) {
						this.options.selectedClass && $inputs.parents('li').removeClass(this.options.selectedClass);
						$inputs.toggleAttr('checked', false);
						$options.toggleAttr('selected', false);

						// It's a single selection, so close
						$(this.$container).find('.multiselect.dropdown-toggle').click();
					}

					(this.options.selectedClass == 'active') && $options.parents('a').css('outline', '0 none');
				}

				this.updateButtonText();

				// to return a result, in order to track
				var ret = this.options.onChange($option, checked);
				this.$select.change();
				return ret;
			}, this));

			$('.multiselect-container li a', this.$container).on('touchstart click', function (event) {
				event.stopPropagation();
			});

			// Keyboard support.
			this.$container.on('keydown', $.proxy(function (event) {
				if ($(':text', this.$container).is(':focus')) {
					return;
				}
				if ((event.keyCode == 9 || event.keyCode == 27) && this.$container.hasClass('open')) {
					// Close on tab or escape.
					$(this.$container).find('.multiselect.dropdown-toggle').click();
				}
				else {
					var $items = $(this.$container).find('li:not(.divider):visible a');

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
					if (this.options.selectedClass == 'active') {
						$current.css('outline', '5px auto -webkit-focus-ring-color');
						$items.not($current).css('outline', '');
					}

					if (event.keyCode == 32 || event.keyCode == 13) {
						var $checkbox = $current.find('input');
						$checkbox.toggleAttr('checked', !$checkbox.is(':checked')).change();
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
				var $input = $('.multiselect-container li input', this.$container).filter(function () {
					return $(this).val() == $(element).val();
				});

				var $el = $(element);
				var flag = $el.is(':selected');
				$input.toggleAttr('checked', flag);
				if (this.options.selectedClass) {
					$input.parents('li').toggleClass(this.options.selectedClass, flag);
				}

				flag = $el.is(':disabled');
				$input.toggleAttr('disabled', flag).parents('li').toggleClass('disabled', flag);
			}, this));

			this.updateButtonText();
		},

		// Select an option by its value.
		select: function(value) {
			var $option = $('option', this.$select).filter(function () {
				return $(this).val() == value;
			});
			var $checkbox = $('.multiselect-container li input', this.$container).filter(function () {
				return $(this).val() == value;
			});

			if (this.options.selectedClass) {
				$checkbox.parents('li').addClass(this.options.selectedClass);
			}

			$checkbox.toggleAttr('checked', true);
			$option.toggleAttr('selected', true);

			this.updateButtonText();
		},

		// Deselect an option by its value.
		deselect: function(value) {
			var $option = $('option', this.$select).filter(function () {
				return $(this).val() == value;
			});
			var $checkbox = $('.multiselect-container li input', this.$container).filter(function () {
				return $(this).val() == value;
			});

			if (this.options.selectedClass) {
				$checkbox.parents('li').removeClass(this.options.selectedClass);
			}

			$checkbox.toggleAttr('checked', false);
			$option.toggleAttr('selected', false);

			this.updateButtonText();
		},

		// Rebuild the whole dropdown menu.
		rebuild: function() {
			$('.multiselect-container', this.$container).html('');
			this.buildDropdown(this.$select, this.options);
			this.updateButtonText();
		},

		// Get options by merging defaults and given options.
		getOptions: function(options) {
			return $.extend({}, this.defaults, options);
		},

		updateButtonText: function() {
			var options = this.getSelected();
			$('button', this.$container).html(this.options.buttonText(options, this.$select));
		},

		// Get all selected options.
		getSelected: function () {
			return $('option:selected[value!="' + this.options.selectAllValue + '"]', this.$select);
		},

		updateOriginalOptions: function() {
			this.originalOptions = this.$select.clone()[0].options;
		},

		asyncFunction: function(callback, timeout, self) {
			var args = Array.prototype.slice.call(arguments, 3);
			return setTimeout(function(){callback.apply(self||this,args);}, timeout);
		}
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

})(window.jQuery);