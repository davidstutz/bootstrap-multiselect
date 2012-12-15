# Bootstrap Multiselect

Bootstrap Multiselect is a JQuery based plugin to provide an intuitive user interface for using select inputs with the multiple attribute present. Instead of a select a bootstrap button will be shown as dropdown menu containing the single options as checkboxes.

## Examples

These examples can also be seen in action in index.html:

	<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/bootstrap-multiselect.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function() {
			$('#example1').multiselect();
			$('#example2').multiselect();
			$('#example3').multiselect({
				button: 'btn btn-link'
			});
			$('#example4').multiselect({
				button: 'btn btn-small'
			});
			$('#example5').multiselect({
				button: 'btn btn-primary disabled'
			});
			$('#example6').multiselect();
			$('.example7').multiselect({
				container: '<span class="dropdown" />',
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

**button**

Define the appearance of the button using classes. See the [Bootstrap documentation](http://twitter.github.com/bootstrap/base-css.html#buttons) for more information.

	$(document).ready(function() {
		$('.multiselect').multiselect({
			'none': 'select something...'
		});
	});
	
**width**

The width of the dropdown button. 

	$(document).ready(function() {
		$('.multiselect').multiselect({
			'width': 'auto', // Default
		});
	});

The width can be defined using all formats accepted by CSS:

	100px
	50%
	auto
	
**text**

Defining the text of the button. Must be a function returning a string. All currently selected options are passed as parameter.

	$(document).ready(function() {
		$('.multiselect').multiselect({
			'text': function(options) {
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
			},
		});
	});
	
**container**

The used container holding both the dropdown button and the dropdown menu.

	$('.multiselect').multiselect({
		container: '<span class="dropdown" />',
	});

## Methods

**.multiselect('destroy')**

This method will destroy - unbind - the plugin on the given element(s).

## Roadmap / Todo

* This solution for multiple selects is not usable for mobile devices (especially with touchscreen). ALternatives: Using Popovers instead of Dropdowns or checking for mobile devices and displaying normal select field (one row) for mobile devices.
	
## License

Copyright 2012 David Stutz

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
