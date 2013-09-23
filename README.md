# Bootstrap Multiselect

Bootstrap Multiselect is a JQuery based plugin to provide an intuitive user interface for using select inputs with the multiple attribute present. Instead of a select a bootstrap button will be shown as dropdown menu containing the single options as checkboxes.

**Note:** The option names may have changed due to the latest updates.

Bootstrap 3 port by [Eduard Dudar](https://github.com/edudar).

## Contribute

Every pull request appreciated. Note that the master branch is used for the current bootstrap version. There is an additional branch for bootstrap 2.3.x.

## Demos

A demo of different configurations can be found [here](http://davidstutz.github.com/bootstrap-multiselect/).

**Note**: The demo page is based on JQuery 2 - so for IE 6,7 and 8 the plugin will not work properly, see compatibility below.

For Knockout JS integration see some examples [here](http://davidstutz.github.io/bootstrap-multiselect/knockout-examples.html).

## Compatibility

Due to the changes with JQuery 2.x the plugin will not work in IE 6,7 and 8 when using the new JQuery version. So if compatibility for these browsers is needed simply switch to the 1.x version of JQuery. The demo page is running using JQuery 2.

Details can be found [here](http://blog.jquery.com/2013/04/18/jquery-2-0-released/).

## Configuration Options

**buttonClass**

Define the appearance of the button using classes. See the [Bootstrap documentation](http://twitter.github.com/bootstrap/base-css.html#buttons) for more information.

	$(document).ready(function() {
		$('.multiselect').multiselect({
			buttonClass: 'btn btn-small'
		});
	});
	
**buttonWidth**

The width of the dropdown button. 

	$(document).ready(function() {
		$('.multiselect').multiselect({
			buttonWidth: 'auto', // Default
		});
	});

The width can be defined using all formats accepted by CSS:

	100px
	50%
	auto
	
If the width is defined using CSS the option should be set to false.
	
**buttonText**

Defining the text of the button. Must be a function returning a string. All currently selected options and the select are passed as parameter.

	$(document).ready(function() {
		$('.multiselect').multiselect({
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
						selected += $(this).text() + ', ';
					});
					return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
				}
			},
		});
	});

**buttonTitle**

Defining the title text of the button. Similar to the `buttonText` option:

    $(document).ready(function() {
		$('.multiselect').multiselect({
			buttonTitle: function(options, select) {
                var selected = '';
                options.each(function () {
                    selected += $(this).text() + ', ';
                });
                return selected.substr(0, selected.length - 2);
            },
		});
	});

**buttonContainer**

The used container holding both the dropdown button and the dropdown menu.

	$(document).ready(function() {
		$('.multiselect').multiselect({
			buttonContainer: '<span class="dropdown" />',
		});
	});

**selectedClass**

The class applied to the parent `<li>` of selected items. Default: active.

**dropRight**

Define if the menu should drop to the right of the button or not, by adding `pull-right` class to `<ul class="dropdown-menu">`. Default is false.

**includeSelectAllOption**

Define if a `<option value="select-all-option"> Select all</option>` should be appended at the beginning of the options list. When this item is clicked, it will check/uncheck other items. This only works when `multiple="multiple"` is enabled. Default is false.

**selectAllText**

Defines the label of the select all option.

**selectAllValue**

The value by which the select all option is identified.

**enableFiltering**

Define if a text input should be created to filter results. Note that 'select all' option will select all **FILTERED** options. Default is false. When given an integer the filter will only be shown if the number of options exceeds the given number.

**enableCaseInsensitiveFiltering**

Define case insensitive text input filtering.  Default is false.

**filterPlaceholder**

Define the placeholder for the text input of the filter.

**filterBehavior**

Defines on which information the filtering is based: on the text of the options, the values or both. So possible options are: `text`, `value`, `both`

**onChange**

Assign an event handler to the change event:

	$(document).ready(function() {
		$('.multiselect').multiselect({
			onChange:function(element, checked){
				alert('Change event invoked!');
				console.log(element);
			}
		});
	});
	
**maxHeight**

Define the maximum height property of the dropdown list. If the maximum height of the option list is exceeded a scrollbar will be displayed.

	$(document).ready(function() {
		$('.multiselect').multiselect({
			// Or false for no maximum height.
			maxHeight: 400,
		});
	});

## Methods

**.multiselect('destroy')**

This method will destroy - unbind - the plugin on the given element(s).

**.multiselect('refresh')**

Refresh the selected elements depending on the selected options within the select.

**.multiselect('rebuild')**

Rebuilds the whole dropdown menu. Selected options will still be selected.

**.multiselect('select', value)**

Selects an option by its value. Works also using an array of values.

**.multiselect('deselect', value)**

Deselects an option by its value. Works also using an array of values.

**.multiselect('dataprovider', data)**

Build the select's options using the following scheme:

    var data = [
        {label: "ACNP", value: "ACNP"},
        {label: "test", value: "test"}
    ];
    $("#multiselect").multiselect("dataprovider", data);

## Additional Styling

Additional Styling can be done using the following classes:

	.multiselect {
		text-align: left;
	}
	.multiselect b.caret {
		float: right;
	}
	.multiselect-group {
		font-weight: bold;
		text-decoration: underline;
	}
	.multiselect-all label {
		font-weight: bold;
	}
	.multiselect-search {
		color: red;
	}
	

## Usage via Data Attributes

To hook up the control via data attributes, add the `data-role="multiselect"` attribute to your `<select>`. All selects with that attribute will be automatically wired up on jQuery load.

## Knockout JS Support

Thanks to [Devristo](https://github.com/Devristo) and [Luis Rudge](https://github.com/luisrudge) this plugin supports [Knockout JS](http://knockoutjs.com/). For further discussion see [the pull requests](https://github.com/davidstutz/bootstrap-multiselect/pull/17).

**Define select input**

Note the multiselect: true binding!

	<select multiple="multiple" data-bind="options: items, selectedOptions: selectedItems, multiselect: multiSelectInitOptions"></select>
	
**Apply Knockout view model**

As usual.

**Notes**

You have to declare your 'multiselect' binding handler **AFTER** your 'options' binding handler.

Thanks to [@robwesterlund](https://twitter.com/robwesterlund) for the hint :)

> **@robwesterlund** - *@luisrudge The reason is that the multiselect plugin works on the option elements which are in the DOM. However, if you place your bindingHandler before the options bindingHandler, there won't be any option elements in the DOM when you call the multiselect plugin.*

## License

This project is dual licensed under the Apache License, Version 2.0 and the BSD 3-Clause license.

### Apache License, Version 2.0

Copyright 2012, 2013 David Stutz

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

### BSD 3-Clause License

Copyright (c) 2012, 2013 David Stutz
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.