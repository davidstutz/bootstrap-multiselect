describe('Bootstrap Multiselect "Core".', function() {
    var onInitialized = false;
    
    beforeEach(function() {
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
            onInitialized: function($select) {
                onInitialized = true;
            },
            checkboxName: function($option) {
                return 'value-' + $($option).attr('value');
            }
        });
    });
    
    it('Should add the container after the select.', function() {
        expect($('#multiselect-container').length).toBe(1);
    });
    
    it('Should add the multiselect button.', function() {
        expect($('#multiselect-container .multiselect').length).toBe(1);
    });
    
    it('Should add the dropdown menu.', function() {
        expect($('#multiselect-container .dropdown-menu').length).toBe(1);
    });
    
    it('Should add an li element with checkbox and label for each option.', function() {
        expect($('#multiselect-container li').length).toBe(99);
        expect($('#multiselect-container label').length).toBe(99);
        expect($('#multiselect-container input[type="checkbox"]').length).toBe(99);
    });
    
    it('Should preserve selected options.', function() {
        expect($('#multiselect-container input[type="checkbox"]:checked').length).toBe(9);
        expect($('#multiselect option:selected').length).toBe(9);
    });
    
    it('Should be able to select options by value.', function() {
        $('#multiselect').multiselect('select', '10');
        
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
    });
    
    it('Select method should handle "null" and "undefined" correctly.', function() {
        expect($('#multiselect option:selected').length).toBe(9);
        
        $('#multiselect').multiselect('select', null);
        expect($('#multiselect option:selected').length).toBe(9);
        
        $('#multiselect').multiselect('select', undefined);
        expect($('#multiselect option:selected').length).toBe(9);
    });
    
    it('Should be able to deselect options by value.', function() {
        $('#multiselect').multiselect('select', '10');
        $('#multiselect').multiselect('deselect', '10');
        
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
    });
    
    it('Deselect method should handle "null" and "undefined" correctly.', function() {
        expect($('#multiselect option:selected').length).toBe(9);
        
        $('#multiselect').multiselect('deselect', null);
        expect($('#multiselect option:selected').length).toBe(9);
        
        $('#multiselect').multiselect('deselect', undefined);
        expect($('#multiselect option:selected').length).toBe(9);
    });
    
    it('Should be able to select options using an array of values.', function() {
        $('#multiselect').multiselect('select', ['10', '11']);
        
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
        
        expect($('#multiselect option[value="11"]').prop('selected')).toBe(true);
        expect($('#multiselect-container input[value="11"]').prop('checked')).toBe(true);
    });
    
    it('Should be able to deselect options using an array of values.', function() {
        $('#multiselect').multiselect('select', ['10', '11']);
        $('#multiselect').multiselect('deselect', ['10', '11']);
        
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
        
        expect($('#multiselect option[value="11"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="11"]').prop('checked')).toBe(false);
    });
    
    it('Should be able to disable the multiselect', function() {
        $('#multiselect').multiselect('disable');
        
        expect($('#multiselect').prop('disabled')).toBe(true);
    });
    
    it('Should be able to enable the multiselect', function() {
        $('#multiselect').multiselect('disable');
        $('#multiselect').multiselect('enable');
        
        expect($('#multiselect').prop('disabled')).toBe(false);
    });
    
    it('Should be able to select all options.', function() {
        $('#multiselect').multiselect('selectAll');
        
        for (var i = 1; i < 100; i++) {
            expect($('#multiselect option[value="' + i.toString() + '"]').prop('selected')).toBe(true);
            expect($('#multiselect-container input[value="' + i.toString() + '"]').prop('checked')).toBe(true);
        }
    });
    
    it('Should be able to deselect all options.', function() {
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
    
    it('Should update the checkboxes according to the selected options after using refresh.', function() {
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
    
    it('Should remove container, button and ul after destroy.', function() {
        $('#multiselect').multiselect('destroy');
        
        // Destroy should remove container, button and ul.
        expect($('#multiselect-container.multiselect-container').length).toBe(0);
        expect($('#multiselect-container .multiselect').length).toBe(0);
        expect($('#multiselect-container .dropdown-menu').length).toBe(0);
    });
    
    it('Should select an option when checkbox is changed (change event).', function() {
        $('#multiselect-container li input[value="10"]').prop('checked', true);
        $('#multiselect-container li input[value="10"]').trigger('change');
        
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
    });
    
    it('Should deselect an option when checkbox is changed (change event).', function() {
        $('#multiselect-container li input[value="10"]').prop('checked', true);
        $('#multiselect-container li input[value="10"]').trigger('change');
        
        // Already checked above.
        
        $('#multiselect-container li input[value="10"]').prop('checked', false);
        $('#multiselect-container li input[value="10"]').trigger('change');
        
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
    });
    
    it('Should select an option when checkbox is clicked.', function() {
        $('#multiselect-container li input[value="10"]').click();
        
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(true);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(true);
    });
    
    it('Should deselect an option when checkbox is clicked.', function() {
        $('#multiselect-container li input[value="10"]').click();
        $('#multiselect-container li input[value="10"]').click();
        
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
    });

    it('Should trigger onInitialized.', function() {
        expect(onInitialized).toBe(true);
    });
    
    it('Should correctly apply checkboxName.', function() {
        $('#multiselect-container input').each(function() {
            expect($(this).attr('name')).toBe('value-' + $(this).attr('value'));
        });
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Single Selection"', function() {
    beforeEach(function() {
        var $select = $('<select id="multiselect"></select>');
        
        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">Option ' + i + '</option>');
        }
        
        $('body').append($select);
        
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>'
        });
    });
    
    it('Should create radio buttons instead of checkboxes.', function() {
        expect($('#multiselect-container input[type="radio"]').length).toBe(99);
        expect($('#multiselect-container input[type="checkbox"]').length).toBe(0);
        
        // Browser selects one option per default.
        expect($('#multiselect option:selected').length).toBe(1);
    });
    
    it('Only one option at a time can be selected.', function() {
        expect($('#multiselect option:selected').length).toBe(1);
        
        var i = 0;
        $('#multiselect-container input').each(function() {
            if (i === 0) {
                expect($(this).prop('checked')).toBe(true);
                i++;
            }
            else {
                expect($(this).prop('checked')).toBe(false);
                $(this).click();
                
                expect($('#multiselect option:selected').length).toBe(1);
                expect($(this).prop('checked')).toBe(true);
                i++;
            }
        });
    });
    
    it('Deselect all should work.', function() {
        expect($('#multiselect option:selected').length).toBe(1);
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Clickable Optgroups"', function() {
    
    // Count the number of onChanges fired.
    var fired = 0;
    
    beforeEach(function() {
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
        
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            enableClickableOptGroups: true,
            numberDisplayed: 10,
            onChange: function(option, checked) {
                fired++;
            }
        });
    });
    
    it('Should correctly create inputs for optgroups.', function() {
        expect($('#multiselect-container li.multiselect-group').length).toBe(10);
        expect($('#multiselect-container li.multiselect-group input').length).toBe(10);
        
        $('#multiselect-container label.multiselect-group').each(function() {
            expect($('input', $(this)).length).toBe(10);
        });
    });
    
    it('Groups should be clickable and correctly initialized.', function() {
        expect($('#multiselect option:selected').length).toBe(10);
        expect(fired).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            if (i == 0) {
                $('label', $(this)).click();
                
                expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(0);
                expect($('#multiselect option:selected').length).toBe(0);
                
                $('label', $(this)).click()
                
                expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
                expect($('#multiselect option:selected').length).toBe(10);
            }
            else {
                $('label', $(this)).click();
                
                expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
                expect($('#multiselect option:selected').length).toBe(20);

                $('label', $(this)).click();
            }
            
            i++;
        });
    });
    
    it('Clickable groups should fire onChange only once.', function() {
        expect($('#multiselect option:selected').length).toBe(10);
        
        fired = 0;
        expect(fired).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            $('label', $(this)).click();
            
            // Selected
            expect(fired).toBe(1);
            fired = 0;
            
            $('label', $(this)).click();
            
            // Deselected
            expect(fired).toBe(1);
            fired = 0;
            
            i++;
        });
    });
    
    it('Should update button text.', function() {
        expect($('#multiselect option:selected').length).toBe(10);
        expect(fired).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            if (i == 0) {
                
                var text = ''
                $('option:selected', $('#multiselect optgroup')[i]).each(function() {
                    text += $(this).text() + ', '
                });
                
                text = text.substr(0, text.length - 2);
                expect($('#multiselect-container .multiselect-selected-text').text()).toBe(text);
                
                $('label', $(this)).click();
            }
            else {
                $('label', $(this)).click();
                
                var text = ''
                $('option:selected', $('#multiselect optgroup')[i]).each(function() {
                    text += $(this).text() + ', '
                });
                
                text = text.substr(0, text.length - 2);
                expect($('#multiselect-container .multiselect-selected-text').text()).toBe(text);
                
                $('label', $(this)).click();
            }
            
            i++;
        });
    });
    
    it('Should be updated by clicking corresponding options.', function() {
        
        for (var i = 1; i < 10; i++) {
            expect($('option:selected', $('#multiselect optgroup')[0]).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe(10);

            var $group = $($('#multiselect-container li.multiselect-group')[i]);
            var $optGroup = $($('#multiselect optgroup')[i]);
            
            $group.nextUntil('li.multiselect-item').each(function() {
                var $input = $('input', this);
                $input.click();
                
                expect($input.prop('checked')).toBe(true);
            });
            
            expect($('option:selected', $optGroup).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe(20);
            expect($('input', $group).prop('checked')).toBe(true);
            
            // Undo changes
            $group.nextUntil('li.multiselect-item').each(function() {
                var $input = $('input', this);
                $input.click();
                
                expect($input.prop('checked')).toBe(false);
            });
            
            expect($('#multiselect option:selected').length).toBe(10);
            expect($('input', $group).prop('checked')).toBe(false);
        }
    });
    
    it('Should be updated through select/deselect.', function() {
        
        var values = [];
        for (var i = 1; i < 11; i++) {
            values.push('1-' + i)
        }
        
        var $group = $('#multiselect-container li.multiselect-group')[0];
        
        $('#multiselect').multiselect('deselect', values);
        expect($('input', $group).prop('checked')).toBe(false);
        
        $('#multiselect').multiselect('select', values);
        expect($('input', $group).prop('checked')).toBe(true);
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Collapsible Optgroups"', function() {
    
    // Count the number of onChanges fired.
    var fired = 0;
    
    beforeEach(function() {
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
            onChange: function(option, checked) {
                fired++;
            }
        });
    });
    
    it('Should correctly create headers for optgroups.', function() {
        expect($('#multiselect-container li.multiselect-group').length).toBe(10);
        
        $('#multiselect-container label.multiselect-group').each(function() {
            expect($('input', $(this)).length).toBe(10);
        });
    });
    
    if ('Should not create inputs.', function() {
        expect($('#multiselect-container li.multiselect-group input').length).toBe(0);
    });
    
    it('Groups should not be clickable.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            $('label', $(this)).click();
            expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(0);
            expect($('#multiselect option:selected').length).toBe(0);
            
            $('label', $(this)).click();
            i++;
        });
    });
    
    it('Should be collapsible.', function() {
        var $group = $('#multiselect-container li.multiselect-group:first');
        $('.caret-container', $group).click();
        
        var $lis = $group.nextUntil('li.multiselect-group');
        $lis.each(function() {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(true);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });
        
        $('.caret-container', $group).click();
        
        var $lis = $group.nextUntil('li.multiselect-group');
        $lis.each(function() {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(false);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Clickable+Collapsible Optgroups"', function() {
    
    // Count the number of onChanges fired.
    var fired = 0;
    
    beforeEach(function() {
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
            onChange: function(option, checked) {
                fired++;
            }
        });
    });
    
    it('Should correctly create inputs for optgroups.', function() {
        expect($('#multiselect-container li.multiselect-group').length).toBe(10);
        expect($('#multiselect-container li.multiselect-group input').length).toBe(10);
        
        $('#multiselect-container label.multiselect-group').each(function() {
            expect($('input', $(this)).length).toBe(10);
        });
    });
    
    it('Groups should be clickable.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            $('label', $(this)).click();
            expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe(10);
            
            $('label', $(this)).click();
            i++;
        });
    });
    
    it('Clickable groups should fire onChange only once.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        
        fired = 0;
        expect(fired).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            $('label', $(this)).click();
            
            // Selected
            expect(fired).toBe(1);
            fired = 0;
            
            $('label', $(this)).click();
            
            // Deselected
            expect(fired).toBe(1);
            fired = 0;
            
            i++;
        });
    });
    
    it('Should be collapsible.', function() {
        var $group = $('#multiselect-container li.multiselect-group:first');
        $('.caret-container', $group).click();
        
        var $lis = $group.nextUntil('li.multiselect-group');
        $lis.each(function() {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(true);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });
        
        $('.caret-container', $group).click();
        
        var $lis = $group.nextUntil('li.multiselect-group');
        $lis.each(function() {
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe(false);
            expect($(this).hasClass('multiselect-collapsible-hidden')).toBe($(this).is(':hidden'));
        });
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Clickable+Collapsible+SelectAll Optgroups"', function() {
    
    // Count the number of onChanges fired.
    var fired = 0;
    
    beforeEach(function() {
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
    
    it('Should handle option groups differently, i.e. not set class to active.', function() {
        // Otherwise they are hidden.
        $('#multiselect-container input[value="multiselect-all"]').click();
        
        var $groups = $('#multiselect-container li.multiselect-group');
        $groups.each(function() {
            expect($(this).hasClass('active')).toBe(false);
        });
        
        var $lis = $('#multiselect-container li:not(.multiselect-group)');
        $lis.each(function() {
            expect($(this).hasClass('active')).toBe(true);
        });
    });
    
    it('Should select all options (including option groups).', function() {
        //$('#multiselect-container li.multiselect-group .caret-container').click();
        $('#multiselect-container input[value="multiselect-all"]').click();
        
        var $lis = $('#multiselect-container li');
        $lis.each(function() {
            expect($('input', this).prop('checked')).toBe(true);
        });
    });
    
    it('Should automatically update select all.', function() {
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            $('label', $(this)).click();
            expect($('option:selected', $('#multiselect optgroup')[i]).length).toBe(10);
            expect($('#multiselect option:selected').length).toBe((i + 1)*10);

            i++;
        });
        
        expect($('#multiselect-container li input[value="multiselect-all"]').prop('checked')).toBe(true);
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Dataprovider"', function() {
    beforeEach(function() {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        
        $('body').append($select);
        
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>'
        });
    });
    
    var options = [
        {label: 'Option 1', value: '1', selected: true, title: 'Option 1 Title'},
        {label: 'Option 2', value: '2', title: 'Option 2 Title'},
        {label: 'Option 3', value: '3', selected: true, title: 'Option 3 Title'},
        {label: 'Option 4', value: '4', title: 'Option 4 Title'},
        {label: 'Option 5', value: '5', title: 'Option 5 Title'},
        {label: 'Option 6', value: '6', title: 'Option 6 Title'}
    ];
    
    var options_attributes = [
        {label: 'Option 1', value: '1', attributes: {'some-attribute': 'test'}}
    ];
    
    it("Should be able to add options.", function() {
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
    
    it("Should be able to define title.", function() {
        $('#multiselect').multiselect('dataprovider', options);
        
        expect($('#multiselect option[value="1"]').attr('title')).toBe('Option 1 Title');
        expect($('#multiselect option[value="2"]').attr('title')).toBe('Option 2 Title');
        expect($('#multiselect option[value="3"]').attr('title')).toBe('Option 3 Title');
        expect($('#multiselect option[value="4"]').attr('title')).toBe('Option 4 Title');
        expect($('#multiselect option[value="5"]').attr('title')).toBe('Option 5 Title');
        expect($('#multiselect option[value="6"]').attr('title')).toBe('Option 6 Title');
        
        expect($('#multiselect-container input[value="1"]').closest('label').attr('title')).toBe('Option 1 Title');
        expect($('#multiselect-container input[value="2"]').closest('label').attr('title')).toBe('Option 2 Title');
        expect($('#multiselect-container input[value="3"]').closest('label').attr('title')).toBe('Option 3 Title');
        expect($('#multiselect-container input[value="4"]').closest('label').attr('title')).toBe('Option 4 Title');
        expect($('#multiselect-container input[value="5"]').closest('label').attr('title')).toBe('Option 5 Title');
        expect($('#multiselect-container input[value="6"]').closest('label').attr('title')).toBe('Option 6 Title');
    });
    
    it("Should be able to define data attributes.", function() {
        $('#multiselect').multiselect('dataprovider', options_attributes)
        expect($('#multiselect option[value="1"]').attr('value')).toBe('1');
        expect($('#multiselect option[value="1"]').attr('data-some-attribute')).toBe('test');
    });
    
    var optgroups = [
        {
            label: 'Group 1', children: [
                {label: 'Option 1.1', value: '1-1'},
                {label: 'Option 1.2', value: '1-2'},
                {label: 'Option 1.3', value: '1-3'}
            ]
        },
        {
            label: 'Group 2', children: [
                {label: 'Option 2.1', value: '1'},
                {label: 'Option 2.2', value: '2'},
                {label: 'Option 2.3', value: '3'}
            ]
        }
    ];
        
    it('Should be able to handle optgroups.', function() {
        $('#multiselect').multiselect('dataprovider', optgroups);
        
        expect($('#multiselect optgroup').length).toBe(2);
        expect($('#multiselect option').length).toBe(6);
        expect($('#multiselect-container input').length).toBe(6);
        
        expect($('#multiselect optgroup[label="Group 1"] option').length).toBe(3);
        expect($('#multiselect optgroup[label="Group 2"] option').length).toBe(3);
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect "Select All".', function() {
    
    var onSelectAllTriggered = false;
    var onDeselectAllTriggered = false;
    
    var fired = 0;
    
    beforeEach(function() {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        
        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">1</option>');
        }
        
        $('body').append($select);
        
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all',
            onSelectAll: function() {
                onSelectAllTriggered = true;
            },
            onDeselectAll: function() {
                onDeselectAllTriggered = true;
            },
            onChange: function(option, checked) {
                fired++;
            }
        });
    });
    
    it('Should not add an additional option to the select.', function() {
        expect($('#multiselect option[value="multiselect-all"]').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').length).toBe(1);
        expect($('#multiselect option').length).toBe(99);
        expect($('#multiselect-container input').length).toBe(100);
    });
    
    it('Should update the select all when all options are selected by the "select" method.', function() {
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
    
    it('Should update the select all when all options are deselected by the "deselect" method (first all options are selected as before).', function() {
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
    
    it('Should update the select all option when all options are selected by the change event.', function() {
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
    
    it('Should update the select all option when all options are deselected by the change event.', function() {
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
    
    it('Should update the select all option when all options are selected by the click event.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        
        $('#multiselect-container input[value!="multiselect-all"]').click();
        
        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
    });
    
    it('Should update the select all option when all options are deselected by the click event.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        
        $('#multiselect-container input[value!="multiselect-all"]').click();
        
        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
        
        $('#multiselect-container input[value!="multiselect-all"]').click();
        
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
    });
    
    it('Should trigger onSelectAll/onDeselectAll based on the change event.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        
        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', true);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');
        
        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(99);
        
        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
        
        expect(onSelectAllTriggered).toBe(true);
        console.log('t')
        $('#multiselect-container input[value!="multiselect-all"]').prop('checked', false);
        $('#multiselect-container input[value!="multiselect-all"]').trigger('change');
        
        expect($('#multiselect option:selected[value!="multiselect-all"]').length).toBe(0);
        
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        console.log('tt')
        expect(onDeselectAllTriggered).toBe(true);
    });
    
    it('Should trigger onSelectAll/onDeselectAll based on the click event.', function() {
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        
        $('#multiselect-container input[value!="multiselect-all"]').click();
        
        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(true);
        
        expect(onSelectAllTriggered).toBe(true);
        
        $('#multiselect-container input[value!="multiselect-all"]').click();
        
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="multiselect-all"]').prop('checked')).toBe(false);
        
        expect(onDeselectAllTriggered).toBe(true);
    });
    
    it('Should trigger onSelectAll/onDeselectAll on function call.', function() {
        $('#multiselect').multiselect('selectAll', true, true);
        expect(onSelectAllTriggered).toBe(true);
        
        $('#multiselect').multiselect('deselectAll', true, true);
        expect(onDeselectAllTriggered).toBe(true);
    });
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Bootstrap Multiselect Specific Issues.', function() {
    
    it('#393', function() {
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
        
        $('#multiselect-container input[value="0"]').click();
        
        expect($('#multiselect option:selected').length).toBe(99);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(true);
        
        $('#multiselect-container input[value="0"]').click();
        
        expect($('#multiselect option:selected').length).toBe(0);
        expect($('#multiselect-container input[value="0"]').prop('checked')).toBe(false);
        
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });

    it('#405', function() {
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
            $('#multiselect-container').find('a:first label').trigger('click');
            expect($('#multiselect-container').find('input:first').prop('checked')).toBe(true);
        }

        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
        $selection.remove();
    });
    
    it('#679', function() {
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
            onChange: function(option, checked) {
                fired++;
            }
        });
        
        expect($('#multiselect option:selected').length).toBe(0);
        expect(fired).toBe(0);
        
        var i = 0;
        $('#multiselect-container li.multiselect-group').each(function() {
            $('label', $(this)).click();
            
            // Selected
            expect(fired).toBe(1);
            fired = 0;
            
            $('label', $(this)).click();
            
            // Deselected
            expect(fired).toBe(1);
            fired = 0;
            
            i++;
        });
        
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});

describe('Knockout Binding.', function() {
    var $testArea;
    afterEach(function() {
        if ($testArea) {
            $testArea.multiselect('destroy').remove();
        }
    });

    it('Should update values and options with an observable array.', function() {
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
        expect($testArea.next().find('ul li').length).toEqual(0);

        // Add more options
        viewModel.myOptions(['option1', 'option2']);
        jasmine.clock().tick(1000);

        expect($testArea.next().find('ul li').length).toEqual(2);
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
        expect($testArea.find('option:checked').map(function() { return $(this).text().trim() }).toArray()).toEqual(['option1', 'option2']);
        expect($testArea.next().find('button.multiselect').text().trim()).toEqual('All selected (2)');    

        // add another option
        viewModel.myOptions.push('wacky option');
        jasmine.clock().tick(1000);

        expect($testArea.find('option:checked').length).toEqual(2);
        expect($testArea.find('option:checked').map(function() { return $(this).text().trim() }).toArray()).toEqual(['option1', 'option2']);
        expect($testArea.find('option').map(function() { return $(this).text().trim() }).toArray()).toEqual(['option1', 'option2', 'wacky option']);
        expect($testArea.next().find('button.multiselect').text().trim()).toEqual('2 selected');    
    });
});
