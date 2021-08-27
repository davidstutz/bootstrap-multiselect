describe('Bootstrap Multiselect "Core".', function () {
    var onInitialized = false;

    beforeEach(function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 100; i++) {
            var $option = $('<option value="' + i + '">' + i + '</option>');

            if (i < 10) {
                $option.prop('selected', true);
            }

            $select.append($option);
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            onInitialized: function ($select) {
                onInitialized = true;
            },
            checkboxName: function ($option) {
                return 'value-' + $($option).attr('value');
            },
            disabledText: "Disabled"
        });
    });

    it('Should add the container after the select.', function () {
        expect($('#multiselect-container').length).toBe(1);
    });

    it('Should add the multiselect button.', function () {
        expect($('#multiselect-container .multiselect').length).toBe(1);
    });

    it('Should add the dropdown menu.', function () {
        expect($('#multiselect-container .dropdown-menu').length).toBe(1);
    });

    it('Should add an li element with checkbox and label for each option.', function () {
        expect($('#multiselect-container .multiselect-option').length).toBe(99);
        expect($('#multiselect-container .form-check-label').length).toBe(99);
        expect($('#multiselect-container input[type="checkbox"]').length).toBe(99);
    });

    it('Should preserve selected options.', function () {
        expect($('#multiselect-container input[type="checkbox"]:checked').length).toBe(9);
        expect($('#multiselect option:selected').length).toBe(9);
    });

    it('Should be able to select options by value.', function () {
        $('#multiselect').multiselect('select', '10');

        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
    });

    it('Select method should handle "null" and "undefined" correctly.', function () {
        expect($('#multiselect option:selected').length).toBe(9);

        $('#multiselect').multiselect('select', null);
        expect($('#multiselect option:selected').length).toBe(9);

        $('#multiselect').multiselect('select', undefined);
        expect($('#multiselect option:selected').length).toBe(9);
    });

    it('Should be able to deselect options by value.', function () {
        $('#multiselect').multiselect('select', '10');
        $('#multiselect').multiselect('deselect', '10');

        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
    });

    it('Deselect method should handle "null" and "undefined" correctly.', function () {
        expect($('#multiselect option:selected').length).toBe(9);

        $('#multiselect').multiselect('deselect', null);
        expect($('#multiselect option:selected').length).toBe(9);

        $('#multiselect').multiselect('deselect', undefined);
        expect($('#multiselect option:selected').length).toBe(9);
    });

    it('Should be able to select options using an array of values.', function () {
        $('#multiselect').multiselect('select', ['10', '11']);

        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);

        expect($('#multiselect option[value="11"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="11"]').prop('checked')).toBe(true);
    });

    it('Should be able to deselect options using an array of values.', function () {
        $('#multiselect').multiselect('select', ['10', '11']);
        $('#multiselect').multiselect('deselect', ['10', '11']);

        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);

        expect($('#multiselect option[value="11"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="11"]').prop('checked')).toBe(false);
    });

    it('Should be able to disable the multiselect', function () {
        $('#multiselect').multiselect('disable');

        expect($('#multiselect').prop('disabled')).toBe(true);
        expect($('#multiselect-container button .multiselect-selected-text').text()).toBe('Disabled');
    });

    it('Should be able to enable the multiselect', function () {
        $('#multiselect').multiselect('disable');
        $('#multiselect').multiselect('enable');

        expect($('#multiselect').prop('disabled')).toBe(false);
    });

    it('Should be able to select all options.', function () {
        $('#multiselect').multiselect('selectAll');

        for (var i = 1; i < 100; i++) {
            expect($('#multiselect option[value="' + i.toString() + '"]').prop('selected')).toBe(true);
            expect($('#multiselect-container input[value="' + i.toString() + '"]').prop('checked')).toBe(true);
        }
    });

    it('Should be able to deselect all options.', function () {
        $('#multiselect').multiselect('selectAll');

        for (var i = 1; i < 100; i++) {
            expect($('#multiselect option[value="' + i.toString() + '"]').prop('selected')).toBe(true);
            expect($('#multiselect-container input[value="' + i.toString() + '"]').prop('checked')).toBe(true);
        }

        $('#multiselect').multiselect('deselectAll');

        for (var i = 1; i < 100; i++) {
            expect($('#multiselect option[value="' + i.toString() + '"]').prop('selected')).toBe(false);
            expect($('#multiselect-container input[value="' + i.toString() + '"]').prop('checked')).toBe(false);
        }
    });

    it('Should update the checkboxes according to the selected options after using refresh.', function () {
        for (var i = 10; i < 20; i++) {
            $('#multiselect option[value="' + i + '"]').prop('selected', true);
        }

        expect($('#multiselect option:selected').length).toBe(19);
        expect($('#multiselect-container input[type="checkbox"]:checked').length).toBe(9);

        $('#multiselect').multiselect('refresh');

        expect($('#multiselect-container input[type="checkbox"]:checked').length).toBe(19);

        for (var i = 10; i < 20; i++) {
            expect($('#multiselect option[value="' + i + '"]').prop('selected')).toBe(true);
        }
    });

    it('Should remove container, button and ul after destroy.', function () {
        $('#multiselect').multiselect('destroy');

        // Destroy should remove container, button and ul.
        expect($('#multiselect-container.multiselect-container').length).toBe(0);
        expect($('#multiselect-container .multiselect').length).toBe(0);
        expect($('#multiselect-container .dropdown-menu').length).toBe(0);
    });

    it('Should select an option when checkbox is changed (change event).', function () {
        $('#multiselect-container .multiselect-option input[value="10"]').prop('checked', true);
        $('#multiselect-container .multiselect-option input[value="10"]').trigger('change');

        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
    });

    it('Should deselect an option when checkbox is changed (change event).', function () {
        $('#multiselect-container .multiselect-option input[value="10"]').prop('checked', true);
        $('#multiselect-container .multiselect-option input[value="10"]').trigger('change');

        // Already checked above.

        $('#multiselect-container .multiselect-option input[value="10"]').prop('checked', false);
        $('#multiselect-container .multiselect-option input[value="10"]').trigger('change');

        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
    });

    it('Should select an option when checkbox is clicked.', function () {
        $('#multiselect-container .multiselect-option input[value="10"]').trigger('click');

        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
    });

    it('Should deselect an option when checkbox is clicked.', function () {
        $('#multiselect-container .multiselect-option input[value="10"]').trigger('click');
        $('#multiselect-container .multiselect-option input[value="10"]').trigger('click');

        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
    });

    it('Should trigger onInitialized.', function () {
        expect(onInitialized).toBe(true);
    });

    it('Should correctly apply checkboxName.', function () {
        $('#multiselect-container input').each(function () {
            expect($(this).attr('name')).toBe('value-' + $(this).attr('value'));
        });
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Multiple Multiselects".', function () {

    var multiselects = ['one', 'two', 'three'];
    var onSelectAllTriggered = 0;
    var onDeselectAllTriggered = 0;
    var onChangeFired = 0;

    beforeEach(function () {

        onSelectAllTriggered = 0;
        onDeselectAllTriggered = 0;
        onChangeFired = 0;

        for (var m = 0; m < 3; m++) {
            var $select = $('<select id="multiselect-' + multiselects[m] + '" multiple="multiple"></select>');

            for (var i = 1; i < 10; i++) {
                $select.append('<option value="' + i + '">Option ' + i + '</option>');
            }

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container-' + multiselects[m] + '"></div>',
                includeSelectAllOption: true,
                selectAllValue: 'multiselect-all',
                onSelectAll: function () {
                    onSelectAllTriggered++;
                },
                onDeselectAll: function () {
                    onDeselectAllTriggered++;
                },
                onChange: function (option, checked) {
                    onChangeFired++;
                }
            });
        }
    });

    it('Should initialize all multiselects.', function () {
        expect($('.multiselect').length).toBe(3);

        for (var m = 0; m < 3; m++) {
            expect($('#multiselect-' + multiselects[m]).length).toBe(1);
            expect($('#multiselect-container-' + multiselects[m]).length).toBe(1);
            expect($('#multiselect-container-' + multiselects[m] + ' .multiselect').length).toBe(1);
            expect($('#multiselect-container-' + multiselects[m] + ' .dropdown-menu').length).toBe(1);
            expect($('#multiselect-container-' + multiselects[m] + ' .multiselect-option').length).toBe(9);
            expect($('#multiselect-container-' + multiselects[m] + ' .multiselect-all').length).toBe(1);
            expect($('#multiselect-container-' + multiselects[m] + ' .form-check-label').length).toBe(10); // including select all
            expect($('#multiselect-container-' + multiselects[m] + ' input[type="checkbox"]').length).toBe(10); // including select all
        }
    });

    it('Should not select/deselect options in other multiselects.', function () {
        for (var m = 0; m < 3; m++) {
            for (var i = 1; i < 10; i++) {
                $('#multiselect-container-' + multiselects[m] + ' input[value="' + i + '"]').trigger('click');
                expect($('#multiselect-container-' + multiselects[m] + ' input[value!="multiselect-all"]:checked').length).toBe(i);

                for (var n = 0; n < 3; n++) {
                    if (m != n) {
                        expect($('#multiselect-container-' + multiselects[n] + ' input[value!="multiselect-all"]:checked').length).toBe(0);
                    }
                }
            }

            for (var i = 9; i >= 1; i--) {
                $('#multiselect-container-' + multiselects[m] + ' input[value="' + i + '"]').trigger('click');
                expect($('#multiselect-container-' + multiselects[m] + ' input[value!="multiselect-all"]:checked').length).toBe(i - 1);

                for (var n = 0; n < 3; n++) {
                    if (m != n) {
                        expect($('#multiselect-container-' + multiselects[n] + ' input[value!="multiselect-all"]:checked').length).toBe(0);
                    }
                }
            }
        }
    });

    it('Should not trigger onChange in other multiselects.', function () {
        for (var m = 0; m < 3; m++) {
            for (var i = 1; i < 10; i++) {
                $('#multiselect-container-' + multiselects[m] + ' input[value="' + i + '"]').trigger('click');
                expect(onChangeFired).toBe(1);
                onChangeFired = 0;
            }
        }
    });

    it('Should not select all/deselect all options in other multiselects.', function () {
        for (var m = 0; m < 3; m++) {
            $('#multiselect-container-' + multiselects[m] + ' input[value="multiselect-all"]').trigger('click');
            expect($('#multiselect-container-' + multiselects[m] + ' input[value!="multiselect-all"]:checked').length).toBe(9);

            for (var n = 0; n < 3; n++) {
                if (n != m) {
                    expect($('#multiselect-container-' + multiselects[n] + ' input[value!="multiselect-all"]:checked').length).toBe(0);
                    expect($('#multiselect-container-' + multiselects[n] + ' input[value="multiselect-all"]:checked').length).toBe(0);
                }
            }

            $('#multiselect-container-' + multiselects[m] + ' input[value="multiselect-all"]').trigger('click');
            expect($('#multiselect-container-' + multiselects[m] + ' input[value!="multiselect-all"]:checked').length).toBe(0);
        }
    });

    it('Should not trigger onSelectAll in other multiselects.', function () {
        for (var m = 0; m < 3; m++) {
            $('#multiselect-container-' + multiselects[m] + ' input[value="multiselect-all"]').trigger('click');
            expect(onSelectAllTriggered).toBe(1);
            expect(onChangeFired).toBe(0);

            $('#multiselect-container-' + multiselects[m] + ' input[value="multiselect-all"]').trigger('click');
            onSelectAllTriggered = 0;
        }
    });

    it('Should not trigger onDeselectAll in other multiselects', function () {
        for (var m = 0; m < 3; m++) {
            $('#multiselect-container-' + multiselects[m] + ' input[value="multiselect-all"]').trigger('click');
            $('#multiselect-container-' + multiselects[m] + ' input[value="multiselect-all"]').trigger('click');
            expect(onSelectAllTriggered).toBe(1);
            expect(onDeselectAllTriggered).toBe(1);
            expect(onChangeFired).toBe(0);
            onSelectAllTriggered = 0;
            onDeselectAllTriggered = 0;
        }
    });

    afterEach(function () {
        for (var m = 0; m < 3; m++) {
            $('#multiselect-' + multiselects[m]).multiselect('destroy');
            $('#multiselect-' + multiselects[m]).remove();
        }
    });
});

describe('Bootstrap Multiselect "Single Selection".', function () {
    beforeEach(function () {
        var $select = $('<select id="multiselect"></select>');

        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">Option ' + i + '</option>');
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>'
        });
    });

    it('Should create radio buttons instead of checkboxes.', function () {
        expect($('#multiselect-container input[type="radio"]').length).toBe(99);
        expect($('#multiselect-container input[type="checkbox"]').length).toBe(0);

        // Browser selects one option per default.
        expect($('#multiselect option:selected').length).toBe(1);
    });

    it('Only one option at a time can be selected.', function () {
        expect($('#multiselect option:selected').length).toBe(1);

        var i = 0;
        $('#multiselect-container input').each(function () {
            if (i === 0) {
                expect($(this).prop('checked')).toBe(true);
            }
            else {
                expect($(this).prop('checked')).toBe(false);
                $(this).trigger('click');

                expect($('#multiselect option:selected').length).toBe(1);
                expect($(this).prop('checked')).toBe(true);
            }
            i++;
        });
    });

    it('Only one option at a time can be selected through the "select" method.', function () {
        expect($('#multiselect option:selected').length).toBe(1);

        var i = 0;
        $('#multiselect-container input').each(function () {
            if (i === 0) {
                expect($(this).prop('checked')).toBe(true);
            }
            else {
                expect($(this).prop('checked')).toBe(false);    
                $('#multiselect').multiselect('select', this.value);

                expect($('#multiselect option:selected').length).toBe(1);
                expect($(this).prop('checked')).toBe(true);
            }
            i++;
        });
    });

    it('Method "selectAll" should not work.', function () {
        expect($('#multiselect option:selected').length).toBe(1);        
        $('#multiselect').multiselect('selectAll', false);
        expect($('#multiselect option:selected').length).toBe(1);
    });

    it('Method "deselectAll" should not work.', function () {
        expect($('#multiselect option:selected').length).toBe(1);        
        $('#multiselect').multiselect('deselectAll', false);
        expect($('#multiselect option:selected').length).toBe(1);
    });

    it('Method "deselect" should not work.', function () {
        var selectedOptions = $('#multiselect option:selected');
        expect(selectedOptions.length).toBe(1);        
        $('#multiselect').multiselect('deselect', selectedOptions.val());
        expect($('#multiselect option:selected').length).toBe(1);
    });

    it('Should not unselect option on second click', function () {
        var selectedOption = $("#multiselect").closest(".multiselect-native-select")
            .find(".multiselect-container :radio:checked").closest(".multiselect-option");
        expect(selectedOption.length).toBe(1);
        
        selectedOption.click();
        expect(selectedOption.find(":radio").prop('checked')).toBe(true);
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Individual Configuration Options".', function () {

    describe('disableIfEmpty without options.', function () {

        var $select = null;
        beforeEach(function () {
            $select = $('<select id="multiselect"></select>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                disableIfEmpty: true,
                disabledText: 'Disabled'
            });
        });

        it('Should disable button if empty.', function () {
            expect($('#multiselect-container button').prop('disabled')).toBe(true);
            expect($('#multiselect-container button .multiselect-selected-text').text()).toBe('Disabled');
        });

        it('Should still be disabled after invoking rebuild.', function () {
            $select.multiselect('rebuild');
            expect($('#multiselect-container button').prop('disabled')).toBe(true);
        });

        it('Should not be disabled after invoking rebuild after adding options.', function () {
            $select.append('<option value="value-1">Option 1</option>');
            $select.multiselect('rebuild');
            expect($('#multiselect-container button').prop('disabled')).toBe(false);
        });

        it('Should still be disabled after invoking rebuild after adding options on initially disabled select.', function () {
            $select.multiselect('disable');
            $select.append('<option value="value-1">Option 1</option>');
            $select.multiselect('rebuild');
            expect($('#multiselect-container button').prop('disabled')).toBe(true);
        });

        it('Should still be disabled after invoking rebuild before and after adding options on initially disabled select.', function () {
            $select.multiselect('disable');
            $select.multiselect('rebuild');
            $select.append('<option value="value-1">Option 1</option>');
            $select.multiselect('rebuild');
            expect($('#multiselect-container button').prop('disabled')).toBe(true);
        });

        it('Should not be disabled after rebuilding with more options after invoking destroy.', function () {
            $select.append('<option value="value-1">Option 1</option>');

            $select.multiselect('destroy');
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                disableIfEmpty: true
            });

            expect($('#multiselect-container button').prop('disabled')).toBe(false);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });

    describe('disableIfEmpty with options.', function () {

        var $select = null;
        beforeEach(function () {
            $select = $('<select id="multiselect" multiple="multiple"></select>');
            $select.append('<option value="value-1">Option 1</option>');
            $select.append('<option value="value-2">Option 2</option>');
            $select.append('<option value="value-3">Option 3</option>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                disableIfEmpty: true,
                nonSelectedText: 'Enabled'
            });
        });

        it('Should enable button.', function () {
            expect($('#multiselect-container button').prop('disabled')).toBe(false);
            expect($('#multiselect-container button .multiselect-selected-text').text()).toBe('Enabled');
        });

        it('Should disable button after removing all options and rebuild.', function () {
            $("#multiselect option").remove();
            $("#multiselect").multiselect('rebuild');

            expect($('#multiselect-container button').prop('disabled')).toBe(true);
            expect($('#multiselect-container button').hasClass('disabled')).toBe(true);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });
});

describe('Bootstrap Multiselect "Individual Methods".', function () {
    describe('Method "clearSelection" should clear selection in multiple mode.', function () {
        beforeEach(function () {
            var $select = $('<select id="multiselect" multiple="multiple"></select>');
            $select.append('<option value="value-1">Option 1</option>');
            $select.append('<option value="value-2">Option 2</option>');
            $select.append('<option value="value-3">Option 3</option>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>'
            });
        });

        it('Method "clearSelection" should clear selection.', function () {
            $('#multiselect-container input[value="value-1"]').trigger('click');
            $('#multiselect-container input[value="value-2"]').trigger('click');
            expect($('#multiselect-container input:checked').length).toBe(2);
            expect($('#multiselect option:selected').length).toBe(2);

            $('#multiselect').multiselect('clearSelection');
            expect($('#multiselect-container input:checked').length).toBe(0);
            expect($('#multiselect option:selected').length).toBe(0);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });

    describe('Method "clearSelection" should correctly update select all.', function () {
        beforeEach(function () {
            var $select = $('<select id="multiselect" multiple="multiple"></select>');
            $select.append('<option value="value-1">Option 1</option>');
            $select.append('<option value="value-2">Option 2</option>');
            $select.append('<option value="value-3">Option 3</option>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                includeSelectAllOption: true,
                selectAllValue: 'multiselect-all'
            });
        });

        it('Method "clearSelection" should clear selection.', function () {
            $('#multiselect-container input[value="multiselect-all"]').trigger('click');
            expect($('#multiselect-container input:checked').length).toBe(4);
            expect($('#multiselect option:selected').length).toBe(3);

            $('#multiselect').multiselect('clearSelection');
            expect($('#multiselect-container input:checked').length).toBe(0);
            expect($('#multiselect option:selected').length).toBe(0);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });

    describe('Method "clearSelection" should clear selection in single mode.', function () {
        beforeEach(function () {
            var $select = $('<select id="multiselect"></select>');
            $select.append('<option value="value-1">Option 1</option>');
            $select.append('<option value="value-2">Option 2</option>');
            $select.append('<option value="value-3">Option 3</option>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>'
            });
        });

        it('Method "clearSelection" is NOT able to clear selection.', function () {
            $('#multiselect-container input[value="value-2"]').trigger('click');
            expect($('#multiselect-container input:checked').length).toBe(1);
            expect($('#multiselect option:selected').length).toBe(1);

            $('#multiselect').multiselect('clearSelection');
            expect($('#multiselect-container input:checked').length).toBe(1);
            expect($('#multiselect option:selected').length).toBe(1);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });

    describe('Method "rebuild"', function() {
        beforeEach(function () {
            var $select = $('<select id="multiselect"></select>');
            $select.append('<option value="value-1">Option 1</option>');
            $select.append('<option value="value-2">Option 2</option>');
            $select.append('<option value="value-3">Option 3</option>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                disableIfEmpty: true
            });
        });

        it('should create an enabled select if the select element is enabled', function() {
            $('#multiselect').multiselect('rebuild');
            expect($('button.multiselect').prop('disabled')).toBe(false);
            expect($('button.multiselect').hasClass('disabled')).toBe(false);
            expect($('#multiselect').prop('disabled')).toBe(false);
        });

        it('should create an disabled select if the select element is disabled', function() {
            $('#multiselect').multiselect('disable');
            $('#multiselect').multiselect('rebuild');
            expect($('button.multiselect').prop('disabled')).toBe(true);
            expect($('button.multiselect').hasClass('disabled')).toBe(true);
            expect($('#multiselect').prop('disabled')).toBe(true);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });
});

describe('Bootstrap Multiselect "Clickable Optgroups"', function () {

    // Count the number of onChanges fired.
    var fired = 0;

    beforeEach(function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 11; i++) {
            var $optgroup = $('<optgroup label="Group ' + i + '"></optgroup>');

            for (var j = 1; j < 11; j++) {
                if (i == 1) {
                    $optgroup.append('<option value="' + i + '-' + j + '" selected="selected">Option ' + i + '.' + j + '</option>');
                }
                else {
                    $optgroup.append('<option value="' + i + '-' + j + '">Option ' + i + '.' + j + '</option>');
                }
            }

            $select.append($optgroup);
        }

        $('body').append($select);

        fired = 0;
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            numberDisplayed: 10,
            onChange: function (option, checked) {
                fired++;
            }
        });
    });

    it('Should correctly create inputs for optgroups.', function () {
        expect($('#multiselect-container .multiselect-group').length).toBe(10);
        expect($('#multiselect-container .multiselect-group input').length).toBe(10);

        $('#multiselect-container .multiselect-group').each(function () {
            expect($('input', $(this).nextUntil('.multiselect-group')).length).toBe(10);
        });
    });

    it('Groups should be clickable and correctly initialized.', function () {
        expect($('#multiselect option:selected').length).toBe(10);
        expect(fired).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            if (i == 0) {
                $('.form-check-label', $(this)).trigger('click');

                expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(0);
                expect($('#multiselect option:selected').length).toBe(0);

                $('.form-check-label', $(this)).trigger('click')

                expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
                expect($('#multiselect option:selected').length).toBe(10);
            }
            else {
                $('.form-check-label', $(this)).trigger('click');

                expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
                expect($('#multiselect option:selected').length).toBe(20);

                $('.form-check-label', $(this)).trigger('click');
            }

            i++;
        });
    });

    it('Clickable groups should fire onChange only once.', function () {
        expect($('#multiselect option:selected').length).toBe(10);

        expect(fired).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');

            // Selected
            expect(fired).toBe(1);
            fired = 0;

            $('.form-check-label', $(this)).trigger('click');

            // Deselected
            expect(fired).toBe(1);
            fired = 0;

            i++;
        });
    });

    it('Clickable groups should fire change only once', function () {
        expect($('#multiselect option:selected').length).toBe(10);

        var changed = 0;
        $('#multiselect').on('change', function () {
            changed++;
        });

        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');

            // Selected
            expect(changed).toBe(1);
            changed = 0;

            $('.form-check-label', $(this)).trigger('click');

            // Deselected
            expect(changed).toBe(1);
            changed = 0;
        });

        fired = 0;
    });

    it('Should update button text.', function () {
        expect($('#multiselect option:selected').length).toBe(10);
        expect(fired).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            if (i == 0) {

                var text = ''
                $('option:selected', $('#multiselect optgroup')[i]).each(function () {
                    text += $(this).text() + ', '
                });

                text = text.substr(0, text.length - 2);
                expect($('#multiselect-container .multiselect-selected-text').text()).toBe(text);

                $('.form-check-label', $(this)).trigger('click');
            }
            else {
                $('.form-check-label', $(this)).trigger('click');

                var text = ''
                $('option:selected', $('#multiselect optgroup')[i]).each(function () {
                    text += $(this).text() + ', '
                });

                text = text.substr(0, text.length - 2);
                expect($('#multiselect-container .multiselect-selected-text').text()).toBe(text);

                $('.form-check-label', $(this)).trigger('click');
            }

            i++;
        });
    });

    it('Should be updated by clicking corresponding options.', function () {

        for (var i = 1; i < 10; i++) {
            expect($('option:selected', $('#multiselect optgroup')[0]).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe(10);

            var $group = $($('#multiselect-container .multiselect-group')[i]);
            var $optGroup = $($('#multiselect optgroup')[i]);

            $group.nextUntil('.multiselect-group').each(function () {
                var $input = $('input', this);
                $input.trigger('click');

                expect($input.prop('checked')).toBe(true);
            });

            expect($('option:selected', $optGroup).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe(20);
            expect($('input', $group).prop('checked')).toBe(true);

            // Undo changes
            $group.nextUntil('.multiselect-group').each(function () {
                var $input = $('input', this);
                $input.trigger('click');

                expect($input.prop('checked')).toBe(false);
            });

            expect($('#multiselect option:selected').length).toBe(10);
            expect($('input', $group).prop('checked')).toBe(false);
        }
    });

    it('Should be updated through select/deselect.', function () {

        var values = [];
        for (var i = 1; i < 11; i++) {
            values.push('1-' + i)
        }

        var $group = $('#multiselect-container .multiselect-group')[0];

        $('#multiselect').multiselect('deselect', values);
        expect($('input', $group).prop('checked')).toBe(false);

        $('#multiselect').multiselect('select', values);
        expect($('input', $group).prop('checked')).toBe(true);
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Collapsible Optgroups"', function () {

    // Count the number of onChanges fired.
    var fired = 0;

    beforeEach(function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 11; i++) {
            var $optgroup = $('<optgroup label="Group ' + i + '"></optgroup>');

            for (var j = 1; j < 11; j++) {
                $optgroup.append('<option value="' + i + '-' + j + '">Option ' + i + '.' + j + '</option>');
            }

            $select.append($optgroup);
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableCollapsibleOptGroups: true,
            onChange: function (option, checked) {
                fired++;
            }
        });
    });

    it('Should correctly create headers for optgroups.', function () {
        expect($('#multiselect-container .multiselect-group').length).toBe(10);

        $('#multiselect-container .multiselect-group').each(function () {
            expect($('input', $(this).nextUntil('.multiselect-group')).length).toBe(10);
        });
    });

    if ('Should not create inputs.', function () {
        expect($('#multiselect-container .multiselect-group input').length).toBe(0);
    });

    it('Groups should not be clickable.', function () {
        expect($('#multiselect option:selected').length).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');
            expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(0);
            expect($('#multiselect option:selected').length).toBe(0);

            $('.form-check-label', $(this)).trigger('click');
            i++;
        });
    });

    it('Should be collapsible.', function () {
        var $group = $('#multiselect-container .multiselect-group:first');
        $('.caret-container', $group).click();

        var $options = $group.nextUntil('.multiselect-group');
        $options.each(function () {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(true);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });

        $('.caret-container', $group).click();

        var $options = $group.nextUntil('li.multiselect-group');
        $options.each(function () {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(false);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Clickable+Collapsible Optgroups"', function () {

    // Count the number of onChanges fired.
    var fired = 0;

    beforeEach(function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 11; i++) {
            var $optgroup = $('<optgroup label="Group ' + i + '"></optgroup>');

            for (var j = 1; j < 11; j++) {
                $optgroup.append('<option value="' + i + '-' + j + '">Option ' + i + '.' + j + '</option>');
            }

            $select.append($optgroup);
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            enableCollapsibleOptGroups: true,
            onChange: function (option, checked) {
                fired++;
            }
        });
    });

    it('Should correctly create inputs for optgroups.', function () {
        expect($('#multiselect-container .multiselect-group').length).toBe(10);
        expect($('#multiselect-container .multiselect-group input').length).toBe(10);

        $('#multiselect-container .multiselect-group').each(function () {
            expect($('input', $(this).nextUntil('.multiselect-group')).length).toBe(10);
        });
    });

    it('Groups should be clickable.', function () {
        expect($('#multiselect option:selected').length).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');
            expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe(10);

            $('.form-check-label', $(this)).trigger('click');
            i++;
        });
    });

    it('Clickable groups should fire onChange only once.', function () {
        expect($('#multiselect option:selected').length).toBe(0);

        fired = 0;
        expect(fired).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');

            // Selected
            expect(fired).toBe(1);
            fired = 0;

            $('.form-check-label', $(this)).trigger('click');

            // Deselected
            expect(fired).toBe(1);
            fired = 0;

            i++;
        });
    });

    it('Should be collapsible.', function () {
        var $group = $('#multiselect-container .multiselect-group:first');
        $('.caret-container', $group).click();

        var $lis = $group.nextUntil('.multiselect-group');
        $lis.each(function () {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(true);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });

        $('.caret-container', $group).click();

        var $lis = $group.nextUntil('.multiselect-group');
        $lis.each(function () {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(false);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Clickable+Collapsible+SelectAll Optgroups"', function () {

    // Count the number of onChanges fired.
    var fired = 0;

    beforeEach(function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 11; i++) {
            var $optgroup = $('<optgroup label="Group ' + i + '"></optgroup>');

            for (var j = 1; j < 11; j++) {
                $optgroup.append('<option value="' + i + '-' + j + '">Option ' + i + '.' + j + '</option>');
            }

            $select.append($optgroup);
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            enableCollapsibleOptGroups: true,
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all'
        });
    });

    it('Should NOT handle option groups differently, i.e. not set class to active.', function () {
        // Otherwise they are hidden.
        $('#multiselect-container input[value="multiselect-all"]').trigger('click');

        var $groups = $('#multiselect-container .multiselect-group');
        $groups.each(function () {
            expect($(this).hasClass('active')).toBe(true);
        });

        var $lis = $('#multiselect-container .multiselect-option:not(.multiselect-group)');
        $lis.each(function () {
            expect($(this).hasClass('active')).toBe(true);
        });
    });

    it('Should select all options (including option groups).', function () {
        //$('#multiselect-container li.multiselect-group .caret-container').trigger('click');
        $('#multiselect-container input[value="multiselect-all"]').trigger('click');

        var $options = $('#multiselect-container .multiselect-option');
        $options.each(function () {
            expect($('input', this).prop('checked')).toBe(true);
        });
    });

    it('Should automatically update select all.', function () {
        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');
            expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe((i + 1) * 10);

            i++;
        });

        expect($('#multiselect-container .multiselect-all input[value="multiselect-all"]').prop('checked')).toBe(true);
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Dataprovider"', function () {
    beforeEach(function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>'
        });
    });

    var options = [
        { label: 'Option 1', value: '1', selected: true, title: 'Option 1 Title' },
        { label: 'Option 2', value: '2', title: 'Option 2 Title' },
        { label: 'Option 3', value: '3', selected: true, title: 'Option 3 Title' },
        { label: 'Option 4', value: '4', title: 'Option 4 Title' },
        { label: 'Option 5', value: '5', title: 'Option 5 Title' },
        { label: 'Option 6', value: '6', title: 'Option 6 Title' }
    ];

    var options_attributes = [
        { label: 'Option 1', value: '1', attributes: { 'some-attribute': 'test' } }
    ];

    it("Should be able to add options.", function () {
        $('#multiselect').multiselect('dataprovider', options);
        expect($('#multiselect option').length).toBe(6);
        expect($('#multiselect-container input').length).toBe(6);

        expect($('#multiselect option[value="1"]').length).toBe(1);
        expect($('#multiselect option[value="1"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="1"]').prop('checked')).toBe(true);

        expect($('#multiselect option[value="2"]').length).toBe(1);
        expect($('#multiselect option[value="2"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="2"]').prop('checked')).toBe(false);

        expect($('#multiselect option[value="3"]').length).toBe(1);
        expect($('#multiselect option[value="3"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="3"]').prop('checked')).toBe(true);

        expect($('#multiselect option[value="4"]').length).toBe(1);
        expect($('#multiselect option[value="4"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="4"]').prop('checked')).toBe(false);

        expect($('#multiselect option[value="5"]').length).toBe(1);
        expect($('#multiselect option[value="5"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="5"]').prop('checked')).toBe(false);

        expect($('#multiselect option[value="6"]').length).toBe(1);
        expect($('#multiselect option[value="6"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="6"]').prop('checked')).toBe(false);
    });

    it("Should be able to define title.", function () {
        $('#multiselect').multiselect('dataprovider', options);

        expect($('#multiselect option[value="1"]').attr('title')).toBe('Option 1 Title');
        expect($('#multiselect option[value="2"]').attr('title')).toBe('Option 2 Title');
        expect($('#multiselect option[value="3"]').attr('title')).toBe('Option 3 Title');
        expect($('#multiselect option[value="4"]').attr('title')).toBe('Option 4 Title');
        expect($('#multiselect option[value="5"]').attr('title')).toBe('Option 5 Title');
        expect($('#multiselect option[value="6"]').attr('title')).toBe('Option 6 Title');

        expect($('#multiselect-container input[value="1"]').closest('.multiselect-option').attr('title')).toBe('Option 1 Title');
        expect($('#multiselect-container input[value="2"]').closest('.multiselect-option').attr('title')).toBe('Option 2 Title');
        expect($('#multiselect-container input[value="3"]').closest('.multiselect-option').attr('title')).toBe('Option 3 Title');
        expect($('#multiselect-container input[value="4"]').closest('.multiselect-option').attr('title')).toBe('Option 4 Title');
        expect($('#multiselect-container input[value="5"]').closest('.multiselect-option').attr('title')).toBe('Option 5 Title');
        expect($('#multiselect-container input[value="6"]').closest('.multiselect-option').attr('title')).toBe('Option 6 Title');
    });

    it("Should be able to define data attributes.", function () {
        $('#multiselect').multiselect('dataprovider', options_attributes)
        expect($('#multiselect option[value="1"]').attr('value')).toBe('1');
        expect($('#multiselect option[value="1"]').attr('data-some-attribute')).toBe('test');
    });

    var optgroups = [
        {
            label: 'Group 1', children: [
                { label: 'Option 1.1', value: '1-1' },
                { label: 'Option 1.2', value: '1-2' },
                { label: 'Option 1.3', value: '1-3' }
            ]
        },
        {
            label: 'Group 2', children: [
                { label: 'Option 2.1', value: '1' },
                { label: 'Option 2.2', value: '2' },
                { label: 'Option 2.3', value: '3' }
            ]
        }
    ];

    it('Should be able to handle optgroups.', function () {
        $('#multiselect').multiselect('dataprovider', optgroups);

        expect($('#multiselect optgroup').length).toBe(2);
        expect($('#multiselect option').length).toBe(6);
        expect($('#multiselect-container input').length).toBe(6);

        expect($('#multiselect optgroup[label="Group 1"] option').length).toBe(3);
        expect($('#multiselect optgroup[label="Group 2"] option').length).toBe(3);
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Select All".', function () {

    var onSelectAllTriggered = false;
    var onDeselectAllTriggered = false;
    var fired = 0;

    beforeEach(function () {
        onSelectAllTriggered = false;
        onDeselectAllTriggered = false;
        fired = 0;

        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">1</option>');
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all',
            onSelectAll: function (options) {
                onSelectAllTriggered = true;
                onSelectAllOptions = options.length;
            },
            onDeselectAll: function (options) {
                onDeselectAllTriggered = true;
                onDeselectAllOptions = options.length;
            },
            onChange: function (option, checked) {
                fired++;
            }
        });
    });

    it('Should not add an additional option to the select.', function () {
        expect($('#multiselect option[value="multiselect-all"]').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').length).toBe(1);
        expect($('#multiselect option').length).toBe(99);
        expect($('#multiselect-container input').length).toBe(100);
    });

    it('Should update the select all when all options are selected by the "select" method.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        for (var i = 1; i < 100; i++) {
            $('#multiselect').multiselect('select', i.toString());
            expect($('#multiselect option[value="' + i.toString() + '"]').prop('selected')).toBe(true);
        }

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input').length).toBe(100);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
    });

    it('Should update the select all when all options are deselected by the "deselect" method (first all options are selected as before).', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        for (var i = 1; i < 100; i++) {
            $('#multiselect').multiselect('select', i.toString());
        }

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input:checked').length).toBe(100);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);

        for (var i = 1; i < 100; i++) {
            $('#multiselect').multiselect('deselect', i.toString());
        }

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
    });

    it('Should update the select all option when all options are selected by the change event.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        // Change all checkboxes except the select all one.
        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', true);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(99);

        // 100 options seleted including the select all.
        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
    });

    it('Should update the select all option when all options are deselected by the change event.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', true);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(99);

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);

        // Change all checkboxes except the select all one.
        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', false);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
    });

    it('Should update the select all option when all options are selected by the click event.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value!="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
    });

    it('Should update the select all option when all options are deselected by the click event.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value!="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);

        $('#multiselect-container input[value!="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
    });

    it('Should trigger onSelectAll/onDeselectAll when changing the select all option.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value="multiselect-all"]').prop('checked', true);
        $('#multiselect-container input[value="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input:checked').length).toBe(100); // including select all

        expect(onSelectAllTriggered).toBe(true);

        $('#multiselect-container input[value="multiselect-all"]').prop('checked', false);
        $('#multiselect-container input[value="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(0);
        expect($('#multiselect option:selected').length).toBe(0);

        expect(onDeselectAllTriggered).toBe(true);
    });

    it('Should include selected/deselected options in onSelectAll/onDeselectAll.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        // Set one option.
        $('#multiselect-container input[value="1"]').prop('checked', true).trigger('change');
        expect($('#multiselect-container input[value="1"]').prop('checked')).toBe(true);

        $('#multiselect-container input[value="multiselect-all"]').prop('checked', true);
        $('#multiselect-container input[value="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input:checked').length).toBe(100);

        expect(onSelectAllTriggered).toBe(true);
        expect(onSelectAllOptions).toBe(98);

        $('#multiselect-container input[value="multiselect-all"]').prop('checked', false);
        $('#multiselect-container input[value="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(0);
        expect($('#multiselect option:selected').length).toBe(0);

        expect(onDeselectAllTriggered).toBe(true);
        expect(onDeselectAllOptions).toBe(99);
    });

    it('Should trigger the onSelectAll/onDeselectAll when clicking the select all option.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input:checked').length).toBe(100); // including select all

        expect(onSelectAllTriggered).toBe(true);

        $('#multiselect-container input[value="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(0);
        expect($('#multiselect option:selected').length).toBe(0);

        expect(onDeselectAllTriggered).toBe(true);
    });

    it('Should NOT trigger onSelectAll/onDeselectAll based on the change event.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', true);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(99);

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);

        expect(onSelectAllTriggered).toBe(false);
        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', false);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');

        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(0);

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        expect(onDeselectAllTriggered).toBe(false);
    });

    it('Should NOT trigger onSelectAll/onDeselectAll based on the click event.', function () {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value!="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);

        expect(onSelectAllTriggered).toBe(false);

        $('#multiselect-container input[value!="multiselect-all"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

        expect(onDeselectAllTriggered).toBe(false);
    });

    it('Should trigger onSelectAll/onDeselectAll on function call.', function () {
        $('#multiselect').multiselect('selectAll', true, true);
        expect(onSelectAllTriggered).toBe(true);

        $('#multiselect').multiselect('deselectAll', true, true);
        expect(onDeselectAllTriggered).toBe(true);
    });

    it('Should NOT trigger onSelectAll on initialization but initialize the select all option correctly.', function () {
        var $select = $('<select id="multiselect-onSelectAll" multiple="multiple"></select>');

        for (var i = 1; i < 10; i++) {
            $select.append('<option value="' + i + '" selected>1</option>');
        }

        $('body').append($select);

        onSelectAllTriggered = false;
        $select.multiselect({
            buttonContainer: '<div id="multiselect-onSelectAll-container"></div>',
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all',
            onSelectAll: function () {
                onSelectAllTriggered = true;
            },
        });

        expect($('#multiselect-onSelectAll-container input[value="multiselect-all"]').prop('checked')).toBe(true);
        expect(onSelectAllTriggered).toBe(false);

        $('#multiselect-onSelectAll').multiselect('destroy');
        $('#multiselect-onSelectAll').remove();
    });

    it('Should NOT trigger onDeselectAll on initialization but initialize the select all option correctly.', function () {
        var $select = $('<select id="multiselect-onDeselectAll" multiple="multiple"></select>');

        for (var i = 1; i < 10; i++) {
            $select.append('<option value="' + i + '">1</option>');
        }

        $('body').append($select);

        onDeselectAllTriggered = false;
        $select.multiselect({
            buttonContainer: '<div id="multiselect-onDeselectAll-container"></div>',
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all',
            onDeselectAll: function () {
                onDeselectAllTriggered = true;
            },
        });

        expect($('#multiselect-onDeselectAll-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        expect(onDeselectAllTriggered).toBe(false);

        $('#multiselect-onDeselectAll').multiselect('destroy');
        $('#multiselect-onDeselectAll').remove();
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Filter".', function () {

    var $select = null;
    beforeEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();

        $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 10; i++) {
            $select.append('<option value="value-' + i + '">Option ' + i + '</option>');
        }

        $('body').append($select);
    });

    describe('Should create filter.', function () {
        beforeEach(function () {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value'
            });
        });

        it('Should create filter.', function () {
            expect($('#multiselect-container .multiselect-filter').length).toBe(1);
            expect($('#multiselect-container .multiselect-filter input').length).toBe(1);
        });
    });

    describe('Should create legacy filter.', function () {
        beforeEach(function () {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                templates: {
                    filter: '<div class="multiselect-filter"><div class="input-group input-group-sm p-1"><div class="input-group-prepend"><i class="input-group-text fas fa-search"></i></div><input class="form-control multiselect-search" type="text" /><div class="input-group-append"><button class="multiselect-clear-filter input-group-text" type="button"><i class="fas fa-times"></i></button></div></div></div>'
                },
                filterBehavior: 'value'
            });
        });

        it('Should create filter.', function () {
            expect($('#multiselect-container .multiselect-filter').length).toBe(1);
            expect($('#multiselect-container .multiselect-filter input').length).toBe(1);
            expect($('#multiselect-container .multiselect-filter .multiselect-clear-filter').length).toBe(1);
        });
    });

    describe('Should filter elements by value.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should filter elements.', function () {
            for (var i = 1; i < 10; i++) {
                if (i != 9) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false, i);
                }
            }
        });
    });

    describe('Should filter elements by value only.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('Option').trigger('keydown');
        });

        it('Should filter elements.', function () {
            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
            }
        });
    });

    describe('Should filter elements by text.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'text',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('Option 9').trigger('keydown');
        });

        it('Should filter elements.', function () {
            for (var i = 1; i < 10; i++) {
                if (i != 9) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false, i);
                }
            }
        });
    });

    describe('Should filter elements by text only.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'text',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('value').trigger('keydown');
        });

        it('Should filter elements.', function () {
            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
            }
        });
    });

    describe('Should filter elements by text and value - text.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'both',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('Option 9').trigger('keydown');
        });

        it('Should filter elements.', function () {
            for (var i = 1; i < 10; i++) {
                if (i != 9) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false, i);
                }
            }
        });
    });

    describe('Should filter elements by text and value - value.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'both',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should filter elements.', function () {
            for (var i = 1; i < 10; i++) {
                if (i != 9) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false, i);
                }
            }
        });
    });

    describe('Should remove filter on clicking the legacy clear button.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                templates: {
                    filter: '<div class="multiselect-filter"><div class="input-group input-group-sm p-1"><div class="input-group-prepend"><i class="input-group-text fas fa-search"></i></div><input class="form-control multiselect-search" type="text" /><div class="input-group-append"><button class="multiselect-clear-filter input-group-text" type="button"><i class="fas fa-times"></i></button></div></div></div>'
                },
                filterBehavior: 'value',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should remove filter.', function () {
            for (var i = 1; i < 10; i++) {
                if (i != 9) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false, i);
                }
            }

            $('#multiselect-container .multiselect-filter .multiselect-clear-filter').trigger('click');

            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false, i);
            }
        });
    });

    describe('Filtering and removing the filter should not alter selection.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-option input[value="value-1"]').trigger('click');
            $('#multiselect-container .multiselect-option input[value="value-9"]').trigger('click');

            for (var i = 1; i < 10; i++) {
                if (i != 9 && i != 1) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should not alter selection.', function () {
            for (var i = 1; i < 10; i++) {
                if (i != 9 && i != 1) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }

            $('#multiselect-container .multiselect-filter .multiselect-clear-filter').trigger('click');

            for (var i = 1; i < 10; i++) {
                if (i != 9 && i != 1) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }
        });
    });

    describe('Select method should select both hidden and visible options.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                onFiltering: function () {
                    done();
                }
            });

            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should not alter selection.', function () {
            $('#multiselect').multiselect('select', 'value-1');
            expect($('#multiselect-container .multiselect-option input[value="value-1"]').prop('checked')).toBe(true);
            expect($('#multiselect option[value="value-1"]').prop('selected')).toBe(true);

            $('#multiselect').multiselect('select', 'value-9');
            expect($('#multiselect-container .multiselect-option input[value="value-9"]').prop('checked')).toBe(true);
            expect($('#multiselect option[value="value-9"]').prop('selected')).toBe(true);
        });
    });

    describe('Deselect method should select both hidden and visible options.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-option input[value="value-9"]').trigger('click');
            $('#multiselect-container .multiselect-option input[value="value-1"]').trigger('click');

            for (var i = 1; i < 10; i++) {
                if (i != 9 && i != 1) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should not alter selection.', function () {
            $('#multiselect').multiselect('deselect', 'value-1');
            expect($('#multiselect-container .multiselect-option input[value="value-1"]').prop('checked')).toBe(false);
            expect($('#multiselect option[value="value-1"]').prop('selected')).toBe(false);

            $('#multiselect').multiselect('deselect', 'value-9');
            expect($('#multiselect-container .multiselect-option input[value="value-9"]').prop('checked')).toBe(false);
            expect($('#multiselect option[value="value-9"]').prop('selected')).toBe(false);
        });
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Reset Button+Select All+Filter".', function() {
    var $select = null;
    beforeEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();

        $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 10; i++) {
            $select.append('<option value="' + i + '"' + ((i == 2 || i == 3) ? ' selected': '') + '>Option ' + i + '</option>');
        }

        $('body').append($select);
    });

    describe('Should create a reset button.', function () {
        beforeEach(function () {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableResetButton: true,
            });
        });

        it('Should create reset button.', function () {
            expect($('#multiselect-container .multiselect-buttons .multiselect-reset').length).toBe(1);
        });
    });
    describe('Should remember the initially selected options.', function () {
        beforeEach(function () {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableResetButton: true,
            });
        });

        it('Should reset to original selection.', function () {
            expect($('#multiselect option').length).toBe(9);
            expect($('#multiselect option:selected').length).toBe(2);

            $('#multiselect-container input[value="1"]').trigger('click');
            $('#multiselect-container input[value="9"]').trigger('click');
            expect($('#multiselect option:selected').length).toBe(4);
            
            $('#multiselect-container .multiselect-buttons .multiselect-reset').click();
            expect($('#multiselect option:selected').length).toBe(2);

            for (var i = 1; i < 10; i++) {
                var expection = i == 2 || i == 3 ? true : false;
                expect($('#multiselect option[value="' + i + '"]').prop('selected')).toBe(expection);
            }
        });
        it('Should do nothing with the original selection.', function () {
            $('#multiselect-container .multiselect-buttons .multiselect-reset').click();
            expect($('#multiselect option:selected').length).toBe(2);

            for (var i = 1; i < 10; i++) {
                var expection = (i == 2 || i == 3) ? true : false;
                expect($('#multiselect option[value="' + i + '"]').prop('selected')).toBe(expection);
            }
        });
    });
    describe('Should work with Select All.', function () {
        beforeEach(function () {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableResetButton: true,
                includeSelectAllOption: true,
                seletAllJustVisible: true,
                enableFiltering: true,
                selectAllValue: 'multiselect-all',
            });
        });

        it('Should reset Select All.', function () {
            expect($('#multiselect option').length).toBe(9);
            expect($('#multiselect option:selected').length).toBe(2);

            for (var i = 1; i < 10; i++) {
                if (i != 2 && i != 3) {
                    $('#multiselect-container input[value="' + i + '"]').trigger('click');
                }
            }
            expect($('#multiselect option:selected').length).toBe(9);
            expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
            
            $('#multiselect-container .multiselect-buttons .multiselect-reset').click();
            expect($('#multiselect option:selected').length).toBe(2);
            expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);

            for (var i = 1; i < 10; i++) {
                var expection = i == 2 || i == 3 ? true : false;
                expect($('#multiselect option[value="' + i + '"]').prop('selected')).toBe(expection);
            }
        });
    });
    describe('Should work with Filter.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableResetButton: true,
                includeSelectAllOption: true,
                seletAllJustVisible: true,
                enableFiltering: true,
                selectAllValue: 'multiselect-all',
                onFiltering: function() {
                    console.log('filter');
                    done();
                }
            });

            console.log($('#multiselect-container .multiselect-filter input'));
            $('#multiselect-container .multiselect-filter input').val('1').trigger('keydown');
        });

        it('Should reset Filter.', function () {
            expect($('#multiselect option').length).toBe(9);
            expect($('#multiselect option:selected').length).toBe(2);

            expect($('#multiselect-container .multiselect-option input[value="1"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(false);
            expect($('#multiselect-container .multiselect-option input[value="2"]').closest('.multiselect-option').hasClass('multiselect-filter-hidden')).toBe(true);

            $('#multiselect-container input[value="multiselect-all"]').trigger('click');
            expect($('#multiselect option:selected').length).toBe(3);
            
            $('#multiselect-container .multiselect-buttons .multiselect-reset').click();
            expect($('#multiselect option:selected').length).toBe(2);
            expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
            expect($('#multiselect-container .multiselect-filter input').val()).toBe('');
        });
    });
});

describe('Bootstrap Multiselect "Select All+Filter+selectAllJustVisible".', function () {
    var $select = null;
    beforeEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();

        $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 10; i++) {
            $select.append('<option value="value-' + i + '">Option ' + i + '</option>');
        }

        $('body').append($select);
    });

    describe('Should select only visible options if selectAllJustVisible is true.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                includeSelectAllOption: true,
                selectAllJustVisible: true,
                selectAllValue: 'multiselect-all',
                onFiltering: function () {
                    done();
                }
            });

            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should select one option.', function () {
            $('#multiselect-container .multiselect-all input[value="multiselect-all"]').trigger('click');
            for (var i = 1; i < 10; i++) {
                if (i != 9) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }
        });
    });

    describe('Should deselect only visible options if selectAllJustVisible is true.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                includeSelectAllOption: true,
                selectAllJustVisible: true,
                selectAllValue: 'multiselect-all',
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-option input[value="value-1"]').trigger('click');
            $('#multiselect-container .multiselect-option input[value="value-9"]').trigger('click');

            for (var i = 1; i < 10; i++) {
                if (i != 9 && i != 1) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should deselect one option.', function () {
            $('#multiselect-container .multiselect-all input').trigger('click');
            for (var i = 1; i < 10; i++) {
                if (i != 1) {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
                }
                else {
                    expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
                }
            }
        });
    });

    describe('Should select all options if selectAllJustVisible is false.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                includeSelectAllOption: true,
                selectAllJustVisible: false,
                selectAllValue: 'multiselect-all',
                onFiltering: function () {
                    done();
                }
            });

            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should select all options.', function () {
            $('#multiselect-container .multiselect-all input[value="multiselect-all"]').trigger('click');

            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
            }
        });
    });

    describe('Should deselect all options if selectAllJustVisible is false.', function () {
        beforeEach(function (done) {
            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                filterBehavior: 'value',
                includeSelectAllOption: true,
                selectAllJustVisible: false,
                selectAllValue: 'multiselect-all',
                onFiltering: function () {
                    done();
                }
            });

            for (var i = 1; i < 10; i++) {
                $('#multiselect-container .multiselect-option input[value="value-' + i + '"]').trigger('click');
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(true, i);
            }

            $('#multiselect-container .multiselect-filter input').val('value-9').trigger('keydown');
        });

        it('Should select all options.', function () {
            $('#multiselect-container .multiselect-all input[value="multiselect-all"]').trigger('click');
            for (var i = 1; i < 10; i++) {
                expect($('#multiselect-container .multiselect-option input[value="value-' + i + '"]').prop('checked')).toBe(false, i);
            }
        });
    });

    afterEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Specific Issues".', function () {
    it('#393.', function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">1</option>');
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            includeSelectAllOption: true,
            selectAllValue: 0
        });

        expect($('#multiselect-container input[value="0"]').length).toBe(1);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(false);

        $('#multiselect').multiselect('selectAll');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(true);

        $('#multiselect').multiselect('deselectAll');

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(false);

        $('#multiselect-container input[value="0"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(true);

        $('#multiselect-container input[value="0"]').trigger('click');

        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(false);

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    it('#405.', function () {
        var selection = document.getSelection();
        var range = document.createRange();
        var $selection = $('<span>Some text to select</span>');
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 5; i++) {
            $select.append('<option value="' + i + '">select option</option>');
        }

        $('body').append($selection).append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
        });

        range.selectNodeContents($selection.get(0));

        selection.removeAllRanges();
        selection.addRange(range);

        if (document.getSelection().type === 'Range') {
            $('#multiselect-container').find('.multiselect-option:first .form-check-label').trigger('click');
            expect($('#multiselect-container').find('input:first').prop('checked')).toBe(true);
        }

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
        $selection.remove();
    });

    it('#679.', function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 11; i++) {
            var $optgroup = $('<optgroup label="Group ' + i + '"></optgroup>');

            for (var j = 1; j < 11; j++) {
                $optgroup.append('<option value="' + i + '-' + j + '">Option ' + i + '.' + j + '</option>');
            }

            $select.append($optgroup);
        }

        $('body').append($select);

        var fired = 0;
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            enableCollapsibleOptGroups: true,
            onChange: function (option, checked) {
                fired++;
            }
        });

        expect($('#multiselect option:selected').length).toBe(0);
        expect(fired).toBe(0);

        var i = 0;
        $('#multiselect-container .multiselect-group').each(function () {
            $('.form-check-label', $(this)).trigger('click');

            // Selected
            expect(fired).toBe(1);
            fired = 0;

            $('.form-check-label', $(this)).trigger('click');

            // Deselected
            expect(fired).toBe(1);
            fired = 0;

            i++;
        });

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    it('#655/1 when clicking the options.', function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        $select.append('<optgroup label="Group 1"><option value="1-1">Option 1.1</option><option value="1-2">Option 1.2</option><option value="1-3">Option 1.3</option></optgroup>');
        $select.append('<optgroup label="Group 2"><option value="2-1">Option 2.1</option><option value="2-2">Option 2.2</option><option value="2-3">Option 2.3</option></optgroup>');

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true
        });

        $('#multiselect-container input[value="2-1"]').trigger('click');
        $('#multiselect-container input[value="2-2"]').trigger('click');
        $('#multiselect-container input[value="2-3"]').trigger('click');

        expect($($('#multiselect-container .multiselect-group input')[0]).prop('checked')).toBe(false);
        expect($('#multiselect-container input[value="1-1"]').prop('checked')).toBe(false);
        expect($('#multiselect-container input[value="1-2"]').prop('checked')).toBe(false);
        expect($('#multiselect-container input[value="1-3"]').prop('checked')).toBe(false);

        expect($($('#multiselect-container .multiselect-group input')[1]).prop('checked')).toBe(true);
        expect($('#multiselect-container input[value="2-1"]').prop('checked')).toBe(true);
        expect($('#multiselect-container input[value="2-2"]').prop('checked')).toBe(true);
        expect($('#multiselect-container input[value="2-3"]').prop('checked')).toBe(true);

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    it('#655/1 when clicking the optgroup.', function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        $select.append('<optgroup label="Group 1"><option value="1-1">Option 1.1</option><option value="1-2">Option 1.2</option><option value="1-3">Option 1.3</option></optgroup>');
        $select.append('<optgroup label="Group 2"><option value="2-1">Option 2.1</option><option value="2-2">Option 2.2</option><option value="2-3">Option 2.3</option></optgroup>');

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true
        });

        $($('#multiselect-container .multiselect-group input')[1]).trigger('click');

        expect($($('#multiselect-container .multiselect-group input')[0]).prop('checked')).toBe(false);
        expect($('#multiselect-container input[value="1-1"]').prop('checked')).toBe(false);
        expect($('#multiselect-container input[value="1-2"]').prop('checked')).toBe(false);
        expect($('#multiselect-container input[value="1-3"]').prop('checked')).toBe(false);

        expect($($('#multiselect-container .multiselect-group input')[1]).prop('checked')).toBe(true);
        expect($('#multiselect-container input[value="2-1"]').prop('checked')).toBe(true);
        expect($('#multiselect-container input[value="2-2"]').prop('checked')).toBe(true);
        expect($('#multiselect-container input[value="2-3"]').prop('checked')).toBe(true);

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    it('#655/2 when clicking the options.', function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        $select.append('<optgroup label="Group 1"><option value="1-1">Option 1.1</option><option value="1-2">Option 1.2</option><option value="1-3">Option 1.3</option></optgroup>');
        $select.append('<optgroup label="Group 2"><option value="2-1">Option 2.1</option><option value="2-2">Option 2.2</option><option value="2-3">Option 2.3</option></optgroup>');

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            selectedClass: 'multiselect-custom-selected'
        });

        $('#multiselect-container input[value="2-1"]').trigger('click');
        $('#multiselect-container input[value="2-2"]').trigger('click');
        $('#multiselect-container input[value="2-3"]').trigger('click');

        expect($($('#multiselect-container .multiselect-group')[0]).prop('class').split(' ')).not.toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="1-1"])').prop('class').split(' ')).not.toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="1-2"])').prop('class').split(' ')).not.toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="1-3"])').prop('class').split(' ')).not.toContain('multiselect-custom-selected');

        expect($($('#multiselect-container .multiselect-group')[1]).prop('class').split(' ')).toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="2-1"])').prop('class').split(' ')).toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="2-2"])').prop('class').split(' ')).toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="2-3"])').prop('class').split(' ')).toContain('multiselect-custom-selected');

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    it('#655/2 when clicking the optgroup.', function () {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        $select.append('<optgroup label="Group 1"><option value="1-1">Option 1.1</option><option value="1-2">Option 1.2</option><option value="1-3">Option 1.3</option></optgroup>');
        $select.append('<optgroup label="Group 2"><option value="2-1">Option 2.1</option><option value="2-2">Option 2.2</option><option value="2-3">Option 2.3</option></optgroup>');

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            selectedClass: 'multiselect-custom-selected'
        });

        $($('#multiselect-container .multiselect-group input')[1]).trigger('click');

        expect($($('#multiselect-container .multiselect-group')[0]).prop('class').split(' ')).not.toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="1-1"])').prop('class').split(' ')).not.toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="1-2"])').prop('class').split(' ')).not.toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="1-3"])').prop('class').split(' ')).not.toContain('multiselect-custom-selected');

        expect($($('#multiselect-container .multiselect-group')[1]).prop('class').split(' ')).toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="2-1"])').prop('class').split(' ')).toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="2-2"])').prop('class').split(' ')).toContain('multiselect-custom-selected');
        expect($('#multiselect-container .multiselect-option:has(input[value="2-3"])').prop('class').split(' ')).toContain('multiselect-custom-selected');

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    describe('#732.', function () {

        var triggeredOnSelectAll = false;
        var triggeredOnDeselectAll = false;

        beforeEach(function (done) {
            triggeredOnSelectAll = false;
            triggeredOnDeselectAll = false;

            var $select = $('<select id="multiselect" multiple="multiple"></select>');
            $select.append('<option value="value-1">Option 1</option><option value="value-2">Option 2</option><option value="value-1">Option 1</option>');

            $('body').append($select);

            $select.multiselect({
                buttonContainer: '<div id="multiselect-container"></div>',
                enableFiltering: true,
                includeSelectAllOption: true,
                onSelectAll: function () {
                    triggeredOnSelectAll = true;
                },
                onDeselectAll: function () {
                    triggeredOnDeselectAll = true;
                },
                onFiltering: function () {
                    done();
                }
            });

            $('#multiselect-container .multiselect-filter input').val('2').trigger('keydown');
        });

        it('Should not fire onSelectAll or onDeselectAll when filtering or clearing filter.', function () {
            expect(triggeredOnSelectAll).toBe(false);
            expect(triggeredOnDeselectAll).toBe(false);

            $('#multiselect-container .multiselect-filter .multiselect-clear-filter').trigger('click');

            expect(triggeredOnSelectAll).toBe(false);
            expect(triggeredOnDeselectAll).toBe(false);
        });

        afterEach(function () {
            $('#multiselect').multiselect('destroy');
            $('#multiselect').remove();
        });
    });

    it('#759.', function () {
        var $select = $('<select data-placeholder="Test" id="multiselect" multiple="multiple"></select>');
        $select.append('<option value="value-1">Option 1</option><option value="value-2">Option 2</option><option value="value-3">Option 3</option>');

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>'
        });

        expect($('#multiselect-container .multiselect-selected-text').text()).toBe('Test');

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Knockout Binding.', function () {
    var $testArea;
    afterEach(function () {
        if ($testArea) {
            $testArea.multiselect('destroy').remove();
        }
    });

    it('Should update values and options with an observable array.', function () {
        jasmine.clock().install();

        $testArea = $('<select multiple="multiple" data-bind="selectedOptions: myValues, options: myOptions, multiselect: {numberDisplayed: 1}"></select>').appendTo(document.body);
        var viewModel = {
            myValues: ko.observableArray(),
            myOptions: ko.observableArray([])
        };

        expect(ko.bindingHandlers.multiselect.init !== undefined).toEqual(true);

        var optionSpy = spyOn(ko.bindingHandlers.selectedOptions, 'init').and.callThrough();
        var multiSpy = spyOn(ko.bindingHandlers.multiselect, 'init').and.callThrough();

        ko.applyBindings(viewModel, $testArea[0]);

        // knockout bindings were called
        expect(optionSpy.calls.count()).toEqual(1);
        expect(multiSpy.calls.count()).toEqual(1);

        // no options are present since myOptions was empty
        expect($testArea.find('option').length).toEqual(0);
        expect($testArea.val()).toEqual(null);

        expect($testArea.next().find('button.multiselect').text().trim()).toEqual('None selected');
        expect($testArea.next().find('.multiselect-option').length).toEqual(0);

        // Add more options
        viewModel.myOptions(['option1', 'option2']);
        jasmine.clock().tick(1000);

        expect($testArea.next().find('.multiselect-option').length).toEqual(2);
        expect($testArea.find('option').length).toEqual(2);
        expect($testArea.find('option:checked').length).toEqual(0);

        // select one
        viewModel.myValues(['option2']);
        jasmine.clock().tick(1000);

        expect($testArea.find('option:checked').length).toEqual(1);
        expect($testArea.find('option:checked').text().trim()).toEqual('option2');


        // select all
        viewModel.myValues(['option1', 'option2']);
        jasmine.clock().tick(1000);

        expect($testArea.find('option:checked').length).toEqual(2);
        expect($testArea.find('option:checked').map(function () { return $(this).text().trim() }).toArray()).toEqual(['option1', 'option2']);
        expect($testArea.next().find('button.multiselect').text().trim()).toEqual('All selected (2)');

        // add another option
        viewModel.myOptions.push('wacky option');
        jasmine.clock().tick(1000);

        expect($testArea.find('option:checked').length).toEqual(2);
        expect($testArea.find('option:checked').map(function () { return $(this).text().trim() }).toArray()).toEqual(['option1', 'option2']);
        expect($testArea.find('option').map(function () { return $(this).text().trim() }).toArray()).toEqual(['option1', 'option2', 'wacky option']);
        expect($testArea.next().find('button.multiselect').text().trim()).toEqual('2 selected');
    });
});

describe('Bootstrap Multiselect "Reset".', function () {

    var $select;

    beforeEach(function () {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();

        $select = $('<select id="multiselect" multiple="multiple"></select>');

        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">1</option>');
        }

        $('body').append($select);

        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            includeResetOption: true
        });
    });

    it('Should not add an additional option to the select.', function () {
        expect($select.find('option').length).toBe(99);
    });

    it('Should add reset button.', function () {
        expect($('#multiselect-container').find('.multiselect-reset button').text()).toBe('Reset');
    });

    it('Should reset if button clicked.', function () {
        $select.multiselect('selectAll', true, false);
        expect($select.find('option:selected').length).toBe(99);
        $('#multiselect-container').find('.multiselect-reset button').trigger('click');
        expect($select.find('option:selected').length).toBe(0);
    });

    afterEach(function () {
        $select.multiselect('destroy');
        $select.remove();
    });
});