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
        this.select = $(select);
        
        // Manually add the multiple attribute, if its not already set.
        if (!this.select.attr('multiple')) {
            this.select.attr('multiple', true);
        }
		
        this.container = $(this.options.buttonContainer)
            .append('<button type="button" class="multiselect dropdown-toggle ' + this.options.buttonClass + '" data-toggle="dropdown">' + this.options.buttonText($('option:selected', select)) + '</button>')
            .append('<ul class="dropdown-menu"></ul>');

		if (this.options.buttonWidth) {
			$('button', this.container).css({
				'width': this.options.buttonWidth
			});
		}

        // Set max height of dropdown menu to activate auto scrollbar.
        if (this.options.maxHeight) {
            $('ul', this.container).css({
                'max-height': this.options.maxHeight + 'px',
                'overflow-y': 'auto',
                'overflow-x': 'hidden'
            });
        }

        this.buildDrowdown(select, this.options);

        this.select
            .hide()
            .after(this.container);
    };

    Multiselect.prototype = {
        
        defaults: {
            // Default text function will either print 'None selected' in case no option is selected,
            // or a list of the selected options up to a length of 3 selected options.
            // If more than 3 options are selected, the number of selected options is printed.
            buttonText: function(options) {
                if (options.length == 0) {
                    return 'None selected <b class="caret"></b>';
                }
                else if (options.length > 3) {
                    return options.length + ' selected <b class="caret"></b>';
                }
                else {
                    var selected = '';
                    options.each(function() {
                        selected += $(this).text() + ', ';
                    });
                    return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
                }
            },
            // Is triggered on change of the selected options.
            onChange: function() {

            },
            buttonClass: 'btn',
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            // Maximum height of thet dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: 400
        },
		
		isMobile: function() {
		   	return navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i);
		},

        constructor: Multiselect,

		buildDrowdown: function(select, options){

            // Build the dropdown.
            $('option', this.select).each($.proxy(function(index, element) {
                if ($(element).is(':selected')) {
                    $(element).attr('selected', 'selected');
                    $(element).prop('selected', 'selected');
                }

                $('ul', this.container).append('<li><a href="javascript:void(0);" style="padding:0;"><label style="margin:0;padding:3px 20px 3px 20px;width:100%;height:100%;cursor:pointer;"><input style="margin-bottom:5px;" type="checkbox" value="' + $(element).val() + '" /> ' + $(element).text() + '</label</a></li>');

                var selected = $(element).prop('selected') || false;
                var checkbox = $('ul li input[value="' + $(element).val() + '"]', this.container);
                
                if ($(element).is(':disabled')) {
                    checkbox.attr('disabled', 'disabled').prop('disabled','disabled').parents('li').addClass('disabled')
                }
                
                checkbox.prop('checked', selected);

                if (selected) {
                    checkbox.parents('li').addClass('active');
                }
            }, this));

            // Bind the change event on the dropdown elements.
            $('ul li input[type="checkbox"]', this.container).on('change', $.proxy(function(event) {
                var checked = $(event.target).prop('checked') || false;

                if (checked) {
                    $(event.target).parents('li').addClass('active');
                }
                else {
                    $(event.target).parents('li').removeClass('active');
                }

                var option = $('option[value="' + $(event.target).val() + '"]', this.select);

                if (checked) {
                    option.attr('selected', 'selected');
                    option.prop('selected', 'selected');
                }
                else {
                    option.removeAttr('selected');
                }
                
                var options = $('option:selected', this.select);
                $('button', this.container).html(this.options.buttonText(options));

                this.options.onChange(option, checked);
            }, this));

            $('ul li a', this.container).on('click', function(event) {
                event.stopPropagation();
            });
        },

        // Destroy - unbind - the plugin.
        destroy: function() {
            this.container.remove();
            this.select.show();
        },

        // Refreshs the checked options based on the current state of the select.
        refresh: function() {
            $('option', this.select).each($.proxy(function(index, element) {
                if ($(element).is(':selected')) {
                    $('ul li input[value="' + $(element).val() + '"]', this.container).prop('checked', true);
                    $('ul li input[value="' + $(element).val() + '"]', this.container).parents('li').addClass('active');
                }
                else {
                    $('ul li input[value="' + $(element).val() + '"]', this.container).prop('checked', false);
                    $('ul li input[value="' + $(element).val() + '"]', this.container).parents('li').removeClass('active');
                }
            }, this));

            $('button', this.container).html(this.options.buttonText($('option:selected', this.select)));
        },

		rebuild: function() {
			$('ul', this.container).html('');
            this.buildDrowdown(this.select, this.options);
		},

        // Get options by merging defaults and given options.
        getOptions: function(options) {
            return $.extend({}, this.defaults, options);
        }
    };

    $.fn.multiselect = function (option) {
        return this.each(function () {
            var data = $(this).data('multiselect'),
                options = typeof option == 'object' && option;

            if (!data) {
                $(this).data('multiselect', (data = new Multiselect(this, options)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    }
}(window.jQuery);
