/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 *
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2017 David Stutz
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2017 David Stutz
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function ($) {
    "use strict";// jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions', 'enable', 'disable'],

            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function () {
                                options();
                                setTimeout(function () {
                                    var ms = $element.data('multiselect');
                                    if (ms)
                                        ms.updateOriginalOptions();//Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function () {
                                value();
                                setTimeout(function () {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function () {
                                selectedOptions();
                                setTimeout(function () {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                var setEnabled = function (enable) {
                    setTimeout(function () {
                        if (enable)
                            $element.multiselect('enable');
                        else
                            $element.multiselect('disable');
                    });
                };

                if (allBindings.has('enable')) {
                    var enable = allBindings.get('enable');
                    if (ko.isObservable(enable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(enable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(enable);
                    }
                }

                if (allBindings.has('disable')) {
                    var disable = allBindings.get('disable');
                    if (ko.isObservable(disable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(!disable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(!disable);
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.multiselect('destroy');
                });
            },

            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);

        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            options.nonSelectedText = this.$select.data("placeholder");
        }

        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null;

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onSelectAll = $.proxy(this.options.onSelectAll, this);
        this.options.onDeselectAll = $.proxy(this.options.onDeselectAll, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        this.options.onInitialized = $.proxy(this.options.onInitialized, this);
        this.options.onFiltering = $.proxy(this.options.onFiltering, this);

        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll(true);

        if (this.options.enableClickableOptGroups && this.options.multiple) {
            this.updateOptGroups();
        }

        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }

        this.$select.wrap('<span class="hide-native-select">').after(this.$container);
        this.options.onInitialized(this.$select, this.$container);
    }

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             *
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function (options, select) {
                if (this.disabledText.length > 0
                        && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty))) {

                    return this.disabledText;
                }
                else if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else if (this.allSelectedText
                        && options.length === $('option', $(select)).length
                        && $('option', $(select)).length !== 1
                        && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    }
                    else {
                        return this.allSelectedText;
                    }
                }
                else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });

                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             *
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function (options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
            checkboxName: function (option) {
                return false; // no checkbox name
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function (element) {
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Create a class.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionClass: function (element) {
                return $(element).attr('class') || '';
            },
            /**
             * Triggered on change of the multiselect.
             *
             * Not triggered when selecting/deselecting options manually.
             *
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange: function (option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function (event) {

            },
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function (event) {

            },
            /**
             * Triggered after the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShown: function (event) {

            },
            /**
             * Triggered after the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHidden: function (event) {

            },
            /**
             * Triggered on select all.
             */
            onSelectAll: function () {

            },
            /**
             * Triggered on deselect all.
             */
            onDeselectAll: function () {

            },
            /**
             * Triggered after initializing.
             *
             * @param {jQuery} $select
             * @param {jQuery} $container
             */
            onInitialized: function ($select, $container) {

            },
            /**
             * Triggered on filtering.
             *
             * @param {jQuery} $filter
             */
            onFiltering: function ($filter) {

            },
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            dropUp: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            selectAllJustVisible: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableFullValueFiltering: false,
            enableClickableOptGroups: false,
            enableCollapsibleOptGroups: false,
            filterPlaceholder: 'Search',
            filterByGroup: false,
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            disabledText: '',
            delimiterText: ', ',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function () {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function () {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width': '100%', //this.options.buttonWidth,
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function () {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            if (this.options.dropUp) {

                var height = Math.min(this.options.maxHeight, $('option[data-role!="divider"]', this.$select).length * 26 + $('option[data-role="divider"]', this.$select).length * 19 + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0));
                var moveCalc = height + 34;

                this.$ul.css({
                    'max-height': height + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'margin-top': "-" + moveCalc + 'px'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all necessary events.
         *
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function () {

            this.$select.children().each($.proxy(function (index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();

                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li:not(.multiselect-group) input', this.$ul).on('change', $.proxy(function (event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {

                    if (checked) {
                        this.selectAll(this.options.selectAllJustVisible);
                    }
                    else {
                        this.deselectAll(this.options.selectAllJustVisible);
                    }
                }
                else {
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }

                    // To prevent select all from firing onChange: #575
                    this.options.onChange($option, checked);

                    // Do not update select all or optgroups on select all change!
                    this.updateSelectAll();

                    if (this.options.enableClickableOptGroups && this.options.multiple) {
                        this.updateOptGroups();
                    }
                }

                this.$select.change();
                this.updateButtonText();

                if (this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function (e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });

            $('li a', this.$ul).on('touchstart click', $.proxy(function (event) {
                event.stopPropagation();

                var $target = $(event.target);

                if (event.shiftKey && this.options.multiple) {
                    if ($target.is("label")) { // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                        var from = $target.closest("li").index();
                        var to = this.lastToggledInput.closest("li").index();

                        if (from > to) { // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }

                        // Make sure we grab all elements since slice excludes the last index
                        ++to;

                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").slice(from, to).find("input");

                        range.prop('checked', checked);

                        if (this.options.selectedClass) {
                            range.closest('li')
                                .toggleClass(this.options.selectedClass, checked);
                        }

                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }
                    }

                    // Trigger the select "change" event
                    $target.trigger("change");
                }

                // Remembers last clicked option
                if ($target.is("input") && !$target.closest("li").is(".multiselect-item")) {
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function (event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                        // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                $("li.multiselect-group input", this.$ul).on("change", $.proxy(function (event) {
                    event.stopPropagation();

                    var $target = $(event.target);
                    var checked = $target.prop('checked') || false;

                    var $li = $(event.target).closest('li');
                    var $group = $li.nextUntil("li.multiselect-group")
                        .not('.multiselect-filter-hidden')
                        .not('.disabled');

                    var $inputs = $group.find("input");

                    var values = [];
                    var $options = [];

                    $.each($inputs, $.proxy(function (index, input) {
                        var value = $(input).val();
                        var $option = this.getOptionByValue(value);

                        if (checked) {
                            $(input).prop('checked', true);
                            $(input).closest('li')
                                .addClass(this.options.selectedClass);

                            $option.prop('selected', true);
                        }
                        else {
                            $(input).prop('checked', false);
                            $(input).closest('li')
                                .removeClass(this.options.selectedClass);

                            $option.prop('selected', false);
                        }

                        $options.push(this.getOptionByValue(value));
                    }, this))

                    // Cannot use select or deselect here because it would call updateOptGroups again.

                    this.options.onChange($options, checked);

                    this.updateButtonText();
                    this.updateSelectAll();
                }, this));
            }

            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                $("li.multiselect-group .caret-container", this.$ul).on("click", $.proxy(function (event) {
                    var $li = $(event.target).closest('li');
                    var $inputs = $li.nextUntil("li.multiselect-group")
                            .not('.multiselect-filter-hidden');

                    var visible = true;
                    $inputs.each(function () {
                        visible = visible && $(this).is(':visible');
                    });

                    if (visible) {
                        $inputs.hide()
                            .addClass('multiselect-collapsible-hidden');
                    }
                    else {
                        $inputs.show()
                            .removeClass('multiselect-collapsible-hidden');
                    }
                }, this));

                $("li.multiselect-all", this.$ul).css('background', '#f3f3f3').css('border-bottom', '1px solid #eaeaea');
                $("li.multiselect-all > a > label.checkbox", this.$ul).css('padding', '3px 20px 3px 35px');
                $("li.multiselect-group > a > input", this.$ul).css('margin', '4px 0px 5px -20px');
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function (element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var classes = this.options.optionClass(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);
            $li.addClass(classes);

            if (this.options.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }

            var $checkbox = $('<input/>').attr('type', inputType);

            var name = this.options.checkboxName($element);
            if (name) {
                $checkbox.attr('name', name);
            }

            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function (element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function (group) {
            var label = $(group).attr("label");
            var value = $(group).attr("value");
            var $li = $('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><label><b></b></label></a></li>');

            var classes = this.options.optionClass(group);
            $li.addClass(classes);

            if (this.options.enableHTML) {
                $('label b', $li).html(" " + label);
            }
            else {
                $('label b', $li).text(" " + label);
            }

            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                $('a', $li).append('<span class="caret-container"><b class="caret"></b></span>');
            }

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                $('a label', $li).prepend('<input type="checkbox" value="' + value + '"/>');
            }

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            this.$ul.append($li);

            $("option", group).each($.proxy(function ($, group) {
                this.createOptionValue(group);
            }, this))
        },

        /**
         * Build the select all.
         *
         * Checks if a select all has already been created.
         */
        buildSelectAll: function () {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }

            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");

                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }

                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }

                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function () {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);

                    // Adds optional filter clear button
                    if (this.options.includeFilterClearBtn) {
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function (event) {
                            clearTimeout(this.searchTimeout);

                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass('multiselect-filter-hidden');

                            this.updateSelectAll();

                            if (this.options.enableClickableOptGroups && this.options.multiple) {
                                this.updateOptGroups();
                            }

                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }

                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function (event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function (event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                            event.preventDefault();
                        }

                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function () {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function (index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {

                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering) {
                                            filterCandidate = filterCandidate.toLowerCase();
                                            filterCandidate = removeDiacritics(filterCandidate);
                                            this.query = this.query.toLowerCase();
                                            this.query = removeDiacritics(this.query);
                                        }

                                        if (this.options.enableFullValueFiltering && this.options.filterBehavior !== 'both') {
                                            var valueToMatch = filterCandidate.trim().substring(0, this.query.length);
                                            if (this.query.indexOf(valueToMatch) > -1) {
                                                showElement = true;
                                            }
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        if (this.options.filterByGroup) {
                                            // Toggle current element (group or group item) according to showElement boolean.
                                            $(element).toggle(showElement)
                                                .toggleClass('multiselect-filter-hidden', !showElement);

                                            // Differentiate groups and group items.
                                            if ($(element).hasClass('multiselect-group')) {
                                                // Remember group status.
                                                currentGroup = element;
                                                currentGroupVisible = showElement;
                                            }
                                            else {
                                                // Show group name when at least one of its items is visible.
                                                if (showElement) {
                                                    if (currentGroupVisible) {
                                                        $(currentGroup).show()
                                                            .removeClass('multiselect-filter-hidden');
                                                        $(element).show()
                                                            .removeClass('multiselect-filter-hidden');
                                                    }
                                                    else {
                                                        $(currentGroup).hide()
                                                            .addClass('multiselect-filter-hidden');
                                                        $(element).hide()
                                                            .addClass('multiselect-filter-hidden');
                                                    }                                                    
                                                }

                                                // Show all group items when group name satisfies filter.
                                                if (!showElement && currentGroupVisible) {
                                                    $(element).show()
                                                        .removeClass('multiselect-filter-hidden');
                                                }
                                            }
                                        }
                                        else {
                                            // Toggle current element (group or group item) according to showElement boolean.
                                            $(element).toggle(showElement)
                                                .toggleClass('multiselect-filter-hidden', !showElement);

                                            // Differentiate groups and group items.
                                            if ($(element).hasClass('multiselect-group')) {
                                                // Remember group status.
                                                currentGroup = element;
                                                currentGroupVisible = showElement;
                                            }
                                            else {
                                                // Show group name when at least one of its items is visible.
                                                if (showElement) {
                                                    $(currentGroup).show()
                                                        .removeClass('multiselect-filter-hidden');
                                                }

                                                // Show all group items when group name satisfies filter.
                                                if (!showElement && currentGroupVisible) {
                                                    $(element).show()
                                                        .removeClass('multiselect-filter-hidden');
                                                }
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();

                            if (this.options.enableClickableOptGroups && this.options.multiple) {
                                this.updateOptGroups();
                            }

                            this.options.onFiltering(event.target);

                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function () {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function () {
            var inputs = $.map($('li input', this.$ul), $);

            $('option', this.$select).each($.proxy(function (index, element) {
                var $elem = $(element);
                var value = $elem.val();
                var $input;
                for (var i = inputs.length; 0 < i--; /**/) {
                    if (value !== ($input = inputs[i]).val())
                        continue; // wrong li

                    if ($elem.is(':selected')) {
                        $input.prop('checked', true);

                        if (this.options.selectedClass) {
                            $input.closest('li')
                                .addClass(this.options.selectedClass);
                        }
                    }
                    else {
                        $input.prop('checked', false);

                        if (this.options.selectedClass) {
                            $input.closest('li')
                                .removeClass(this.options.selectedClass);
                        }
                    }

                    if ($elem.is(":disabled")) {
                        $input.attr('disabled', 'disabled')
                            .prop('disabled', true)
                            .closest('li')
                            .addClass('disabled');
                    }
                    else {
                        $input.prop('disabled', false)
                            .closest('li')
                            .removeClass('disabled');
                    }
                    break; // assumes unique values
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Select all options of the given values.
         *
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         *
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function (selectValues, triggerOnChange) {
            if (!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if ($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (!this.options.multiple) {
                    this.deselectAll(false);
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);

                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Deselects all options of the given values.
         *
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         *
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function (deselectValues, triggerOnChange) {
            if (!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if ($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);

                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {

            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allLis = $("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul);
            var visibleLis = $("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(':visible');

            if (justVisible) {
                $('input:enabled', visibleLis).prop('checked', true);
                visibleLis.addClass(this.options.selectedClass);

                $('input:enabled', visibleLis).each($.proxy(function (index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', true);
                }, this));
            }
            else {
                $('input:enabled', allLis).prop('checked', true);
                allLis.addClass(this.options.selectedClass);

                $('input:enabled', allLis).each($.proxy(function (index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', true);
                }, this));
            }

            $('li input[value="' + this.options.selectAllValue + '"]').prop('checked', true);

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }

            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         *
         * If justVisible is true or not specified, only visible options are deselected.
         *
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible, triggerOnDeselectAll) {

            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allLis = $("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul);
            var visibleLis = $("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(':visible');

            if (justVisible) {
                $('input[type="checkbox"]:enabled', visibleLis).prop('checked', false);
                visibleLis.removeClass(this.options.selectedClass);

                $('input[type="checkbox"]:enabled', visibleLis).each($.proxy(function (index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', false);
                }, this));
            }
            else {
                $('input[type="checkbox"]:enabled', allLis).prop('checked', false);
                allLis.removeClass(this.options.selectedClass);

                $('input[type="checkbox"]:enabled', allLis).each($.proxy(function (index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', false);
                }, this));
            }

            $('li input[value="' + this.options.selectAllValue + '"]').prop('checked', false);

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }

            if (triggerOnDeselectAll) {
                this.options.onDeselectAll();
            }
        },

        /**
         * Rebuild the plugin.
         *
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function () {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll(true);

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }

            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function (dataprovider) {

            var groupCounter = 0;
            var $select = this.$select.empty();

            $.each(dataprovider, function (index, option) {
                var $tag;

                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;

                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });

                    forEach(option.children, function (subOption) { // add children option tags
                        var attributes = {
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        };

                        //Loop through attributes object and add key-value for each attribute
                        for (var key in subOption.attributes) {
                            attributes['data-' + key] = subOption.attributes[key];
                        }
                        //Append original attributes + new data attributes to option
                        $tag.append($('<option/>').attr(attributes));
                    });
                }
                else {

                    var attributes = {
                        'value': option.value,
                        'label': option.label || option.value,
                        'title': option.title,
                        'class': option.class,
                        'selected': !!option.selected,
                        'disabled': !!option.disabled
                    };
                    //Loop through attributes object and add key-value for each attribute
                    for (var key in option.attributes) {
                        attributes['data-' + key] = option.attributes[key];
                    }
                    //Append original attributes + new data attributes to option
                    $tag = $('<option/>').attr(attributes);

                    $tag.text(option.label || option.value);
                }

                $select.append($tag);
            });

            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function () {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function () {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function (options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function (options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function () {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Update opt groups.
         */
        updateOptGroups: function () {
            var $groups = $('li.multiselect-group', this.$ul)

            $groups.each(function () {
                var $options = $(this).nextUntil('li.multiselect-group')
                    .not('.multiselect-filter-hidden')
                    .not('.disabled');

                var checked = true;
                $options.each(function () {
                    var $input = $('input', this);

                    if (!$input.prop('checked')) {
                        checked = false;
                    }
                });

                $('input', this).prop('checked', checked);
            });
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function (notTriggerOnSelectAll) {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.multiselect-filter-hidden):not(.multiselect-group):not(.disabled) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");

                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                    this.options.onSelectAll();
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                    if (checkedBoxesLength === 0) {
                        if (!notTriggerOnSelectAll) {
                            this.options.onDeselectAll();
                        }
                    }
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function () {
            var options = this.getSelected();

            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }

            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function () {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function () {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function (callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function () {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function (allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function (option, parameter, extraOptions) {
        return this.each(function () {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);

                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function () {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);


function removeDiacritics(str) {

    var defaultDiacriticsRemovalMap = [
      { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
      { 'base': 'AA', 'letters': /[\uA732]/g },
      { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
      { 'base': 'AO', 'letters': /[\uA734]/g },
      { 'base': 'AU', 'letters': /[\uA736]/g },
      { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
      { 'base': 'AY', 'letters': /[\uA73C]/g },
      { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
      { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
      { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
      { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
      { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
      { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
      { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
      { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
      { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
      { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
      { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
      { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
      { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
      { 'base': 'LJ', 'letters': /[\u01C7]/g },
      { 'base': 'Lj', 'letters': /[\u01C8]/g },
      { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
      { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
      { 'base': 'NJ', 'letters': /[\u01CA]/g },
      { 'base': 'Nj', 'letters': /[\u01CB]/g },
      { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
      { 'base': 'OI', 'letters': /[\u01A2]/g },
      { 'base': 'OO', 'letters': /[\uA74E]/g },
      { 'base': 'OU', 'letters': /[\u0222]/g },
      { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
      { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
      { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
      { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
      { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
      { 'base': 'TZ', 'letters': /[\uA728]/g },
      { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
      { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
      { 'base': 'VY', 'letters': /[\uA760]/g },
      { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
      { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
      { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
      { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
      { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
      { 'base': 'aa', 'letters': /[\uA733]/g },
      { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
      { 'base': 'ao', 'letters': /[\uA735]/g },
      { 'base': 'au', 'letters': /[\uA737]/g },
      { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
      { 'base': 'ay', 'letters': /[\uA73D]/g },
      { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
      { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
      { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
      { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
      { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
      { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
      { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
      { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
      { 'base': 'hv', 'letters': /[\u0195]/g },
      { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
      { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
      { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
      { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
      { 'base': 'lj', 'letters': /[\u01C9]/g },
      { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
      { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
      { 'base': 'nj', 'letters': /[\u01CC]/g },
      { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
      { 'base': 'oi', 'letters': /[\u01A3]/g },
      { 'base': 'ou', 'letters': /[\u0223]/g },
      { 'base': 'oo', 'letters': /[\uA74F]/g },
      { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
      { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
      { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
      { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
      { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
      { 'base': 'tz', 'letters': /[\uA729]/g },
      { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
      { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
      { 'base': 'vy', 'letters': /[\uA761]/g },
      { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
      { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
      { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
      { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
    ];

    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }

    return str;

}
