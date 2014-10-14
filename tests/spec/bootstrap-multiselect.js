describe('Bootstrap Multiselect "Core".', function() {
    beforeEach(function() {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        
        for (var i = 1; i < 100; i++) {
            var $option = $('<option value="' + i + '">1</option>');
            
            if (i < 10) {
                $option.prop('selected', true);
            }
            
            $select.append($option);
        }
        
        $('body').append($select);
        
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>'
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
    
    it('Should be able to deselect options by value.', function() {
        $('#multiselect').multiselect('select', '10');
        $('#multiselect').multiselect('deselect', '10');
        
        expect($('#multiselect option[value="10"]').prop('selected')).toBe(false);
        expect($('#multiselect-container input[value="10"]').prop('checked')).toBe(false);
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
    
    it('Should be able to selec all options.', function() {
        $('#multiselect').multiselect('selectAll');
        
        for (var i = 1; i < 100; i++) {
            expect($('#multiselect option[value="' + i.toString() + '"]').prop('selected')).toBe(true);
            expect($('#multiselect-container input[value="' + i.toString() + '"]').prop('checked')).toBe(true);
        }
    });
    
    it('Should be able to deselec all options.', function() {
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
    beforeEach(function() {
        var $select = $('<select id="multiselect" multiple="multiple"></select>');
        
        for (var i = 1; i < 100; i++) {
            $select.append('<option value="' + i + '">1</option>');
        }
        
        $('body').append($select);
        
        $select.multiselect({
            buttonContainer: '<div id="multiselect-container"></div>',
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all'
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
    
    afterEach(function() {
        $('#multiselect').multiselect('destroy');
        $('#multiselect').remove();
    });
});