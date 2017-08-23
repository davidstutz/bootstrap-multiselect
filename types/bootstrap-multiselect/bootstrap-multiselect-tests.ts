import * as $ from 'jquery';
import './index';

class Tests{
    constructor(){

      $('select').multiselect();
      $('select').multiselect('destroy');
      $('select').multiselect({buttonText:(options,select)=>{return 'text';}});
      $('select').multiselect('dataprovider', [{
        label: 'Group 1', children: [
            {label: 'Option 1.1', value: '1-1', selected: true},
            {label: 'Option 1.2', value: '1-2'},
            {label: 'Option 1.3', value: '1-3'}
        ]
    },
    {
        label: 'Group 2', children: [
            {label: 'Option 2.1', value: '1'},
            {label: 'Option 2.2', value: '2'},
            {label: 'Option 2.3', value: '3', disabled: true}
        ]
    }])
    }
}
