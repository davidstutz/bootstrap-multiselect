# Bootstrap Multiselect

Bootstrap Multiselect is a JQuery based plugin to provide an intuitive user interface for using select inputs with the multiple attribute present. Instead of a select a bootstrap button will be shown as dropdown menu containing the single options as checkboxes.

## Usage

	<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/bootstrap-multiselect.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function() {
			$('.multiselect').multiselect({
				'button': 'btn',
				'width': 'auto',
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
				}
			});
		});
	</script>
	
	<select class="multiselect" multiple="multiple">
		<option value="cheese">Cheese</option>
		<option value="tomatoes">Tomatoes</option>
		<option value="mozarella">Mozzarella</option>
		<option value="mushrooms">Mushrooms</option>
		<option value="pepperoni">Pepperoni</option>
		<option value="onions">Onions</option>
	</select>
	
	<div class="input-prepend input-append">
		<span class="add-on"><b class="icon-list-alt"></b></span>
		<select class="multiselect" multiple="multiple">
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
	
## Examples

	The download includes usage and styling examples.

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
	
## License

Copyright 2012 David Stutz

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
