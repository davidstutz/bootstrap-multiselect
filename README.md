# Bootstrap Multiselect

Dropdown button overlay for using with selects.

## Example

	<script type="text/javascript">
		$(document).ready(function() {
			$('.multiselect').multiselect(options);
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
	
## Configuration Options

**none**

The text displayed if no option is selected.

	<script type="text/javascript">
		$(document).ready(function() {
			$('.multiselect').multiselect({
				'none': 'select something...'
			});
		});
	</script>
	
**selected**

A function returning the string displayed if options are selected. All currently selected options are passed as argument.

	<script type="text/javascript">
		$(document).ready(function() {
			$('.multiselect').multiselect({
				'selected': function(options) {
					if (options.length > 3) {
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
	</script>
	
**width**

The width of the dropdown button.

	<script type="text/javascript">
		$(document).ready(function() {
			$('.multiselect').multiselect({
				'width': 'auto', // Default
				'width': '300px', // In pixels
				'width': '50%', // In percentage
			});
		});
	</script>
	
## License

[Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0)
