# Bootstrap Multiselect

Bootstrap Multiselect is a JQuery based plugin to provide an intuitive user interface for using select inputs with the multiple attribute present. Instead of a select a bootstrap button will be shown as dropdown menu containing the single options as checkboxes.

**Note:** The option names may have changed due to the latest updates.

## Demo

A demo of different configurations can be found [here](http://davidstutz.github.com/bootstrap-multiselect/).

## Examples

These examples can also be seen in action in index.html:

	<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="css/bootstrap-responsive.min.css" type="text/css">

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/bootstrap-multiselect.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function() {
			$('#example1').multiselect();
			$('#example2').multiselect();
			$('#example3').multiselect({
				buttonClass: 'btn btn-link'
			});
			$('#example4').multiselect({
				buttonClass: 'btn btn-small'
			});
			$('#example5').multiselect({
				buttonClass: 'btn btn-primary disabled'
			});
			$('#example6').multiselect();
			$('.example7').multiselect({
				buttonContainer: '<span class="dropdown" />',
			});
		});
	</script>
	<p>
		<select id="example1">
			<option value="cheese">Cheese</option>
			<option value="tomatoes">Tomatoes</option>
			<option value="mozarella">Mozzarella</option>
			<option value="mushrooms">Mushrooms</option>
			<option value="pepperoni">Pepperoni</option>
			<option value="onions">Onions</option>
		</select>
	</p>
	<p>
		<select id="example2" multiple="multiple">
			<option value="cheese" selected>Cheese</option>
			<option value="tomatoes" selected>Tomatoes</option>
			<option value="mozarella" selected>Mozzarella</option>
			<option value="mushrooms">Mushrooms</option>
			<option value="pepperoni">Pepperoni</option>
			<option value="onions">Onions</option>
		</select>
	</p>
	<p>
		<select id="example3" multiple="multiple">
			<option value="cheese">Cheese</option>
			<option value="tomatoes">Tomatoes</option>
			<option value="mozarella">Mozzarella</option>
			<option value="mushrooms">Mushrooms</option>
			<option value="pepperoni">Pepperoni</option>
			<option value="onions">Onions</option>
		</select>
	</p>
	<p>
		<select id="example4" multiple="multiple">
			<option value="cheese">Cheese</option>
			<option value="tomatoes">Tomatoes</option>
			<option value="mozarella">Mozzarella</option>
			<option value="mushrooms">Mushrooms</option>
			<option value="pepperoni">Pepperoni</option>
			<option value="onions">Onions</option>
		</select>
	</p>
	<p>
		<select id="example5" multiple="multiple">
			<option value="cheese">Cheese</option>
			<option value="tomatoes">Tomatoes</option>
			<option value="mozarella">Mozzarella</option>
			<option value="mushrooms">Mushrooms</option>
			<option value="pepperoni">Pepperoni</option>
			<option value="onions">Onions</option>
		</select>
	</p>
	<p>
		<div class="input-prepend input-append btn-toolbar">
			<span class="add-on"><b class="icon-list-alt"></b></span>
			<select id="example6" multiple="multiple">
				<option value="cheese">Cheese</option>
				<option value="tomatoes">Tomatoes</option>
				<option value="mozarella">Mozzarella</option>
				<option value="mushrooms">Mushrooms</option>
				<option value="pepperoni">Pepperoni</option>
				<option value="onions">Onions</option>
			</select>
			<button class="btn btn-danger">Cancel</button>
			<button class="btn btn-success">Save</button>
		</div>
	</p>
	<p>
		<div class="input-prepend input-append">
			<span class="add-on"><b class="icon-list-alt"></b></span>
			<select class="example7" multiple="multiple">
				<option value="cheese">Cheese</option>
				<option value="tomatoes">Tomatoes</option>
				<option value="mozarella">Mozzarella</option>
				<option value="mushrooms">Mushrooms</option>
				<option value="pepperoni">Pepperoni</option>
				<option value="onions">Onions</option>
			</select>
			<select class="example7" multiple="multiple">
				<option value="small">Small</option>
				<option value="medium">Medium</option>
				<option value="large">Large</option>
				<option value="extra">Extra Large</option>
			</select>
			<button class="btn btn-primary">Save</button>
		</div>
	</p>

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

**enableFiltering**

Define if a text input should be created to filter results. Note that 'select all' option will select all **FILTERED** options. Default is false.

**filterPlaceholder**

Define the placeholder for the text input above. Note that 'select all' option will select all **FILTERED** options. Default is false.

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

Selects an option by its value.

**.multiselect('deselect', value)**

Deselects an option by its value.

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

Copyright 2012 David Stutz

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
