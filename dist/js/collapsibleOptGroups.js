! function(e) {
	"use strict";
	jQuery.fn.multiselect.Constructor.prototype.selectAll = (function() {
		var cached_function	= jQuery.fn.multiselect.Constructor.prototype.selectAll;

		return function() {
			var args			= Array.prototype.slice.call( arguments );
				args[0]			= (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : args[0];
			cached_function.apply(this, args);
		};
	}());

	jQuery.fn.multiselect.Constructor.prototype.deselectAll = (function() {
		var cached_function	= jQuery.fn.multiselect.Constructor.prototype.deselectAll;

		return function() {
			var args			= Array.prototype.slice.call( arguments );
				args[0]			= (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : args[0];
			cached_function.apply(this, args);
		};
	}());

	jQuery.fn.multiselect.Constructor.prototype.buildDropdownOptions = (function() {
		var cached_function = jQuery.fn.multiselect.Constructor.prototype.buildDropdownOptions;

		return function() {
			cached_function.apply(this, arguments);

			if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
				e("li.multiselect-group", this.$ul).each( function () {
					var name = $("label", this).html();
					$(this).html('<a href="javascript:void(0);"><input type="checkbox" value="' + name + '"/><b> ' + name + '<b class="caret"></b></b></a>');
				});
				e("li.multiselect-group", this.$ul).siblings().not("li.multiselect-group, li.multiselect-all", this.$ul).each( function () {
					$(this).toggleClass('hidden', true);
				});
				e("li.multiselect-group", this.$ul).on("click", e.proxy(function(t) {
					t.stopPropagation();
				}, this));
				e("li.multiselect-group > a > b", this.$ul).on("click", e.proxy(function(t) {
					t.stopPropagation();
					var n = e(t.target).closest('li');
					var r = n.nextUntil("li.multiselect-group");
					var i = true;
					r.each(function() {
						i = i && e(this).hasClass('hidden');
					});
					r.toggleClass('hidden', !i);
				}, this));
				e("li.multiselect-group > a > input", this.$ul).on("change", e.proxy(function(t) {
					t.stopPropagation();
					var n = e(t.target).closest('li');
					var r = n.nextUntil("li.multiselect-group");
					var i = true;
					var s = r.find("input");
					s.each(function() {
						i = i && e(this).prop("checked")
					});
					s.prop("checked", !i).trigger("change")
				}, this));
				e("li.multiselect-all", this.$ul).css('background', '#f3f3f3').css('border-bottom', '1px solid #eaeaea');
				e("li.multiselect-group > a, li.multiselect-all > a > label.checkbox", this.$ul).css('padding', '3px 20px 3px 35px');
				e("li.multiselect-group > a > input", this.$ul).css('margin', '4px 0px 5px -20px');
			}
		};
	}());
}(window.jQuery)
