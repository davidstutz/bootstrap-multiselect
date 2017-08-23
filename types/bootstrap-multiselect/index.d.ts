// Type definitions for bootstrap-multiselect 0.9
// Project: https://github.com/davidstutz/bootstrap-multiselect
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="jquery"/>

interface Templates{
    button?:string;
    ul?:string;
    filter?:string;
    filterClearBtn?:string;
    li?:string;
    divider?:string;
    liGroup?:string;
}

interface MultiSelectOptionElement{
    label:string;
    title?:string;
    value?:string|number;
    selected?:boolean;
    disabled?:boolean;
    children?:Array<MultiSelectOptionElement>;
    attributes?:{[name:string]:any};
}

/**
 * See {@link https://davidstutz.github.io/bootstrap-multiselect/#configuration-options|https://davidstutz.github.io/bootstrap-multiselect/#configuration-options}
 */
interface MultiSelectOptions {
    /**
     * A callback specifying the text shown on the button dependent on the currently selected options.
     *
     * The callback gets the currently selected options and the select as argument and returns the string shown as button text.
     * The default buttonText callback returns nonSelectedText in the case no option is selected,
     * {@link nSelectedText} in the case more than {@link numberDisplayed} options are selected
     * and the names of the selected options if less than {@link numberDisplayed} options are selected.

     * @param options 
     * @param select 
     * @returns {} 
     */
    buttonText?: (options: HTMLOptionsCollection, select: HTMLSelectElement) => string;

    /**
     * A callback specifying the title of the button.
     *
     * The callback gets the currently selected options and the select as argument and returns the title of the button as string.
     * The default buttonTitle callback returns nonSelectedText in the case no option is selected and the names of the selected options of less than {@link numberDisplayed} options are selected.
     * If more than numberDisplayed options are selected, {@link nSelectedText} is returned.
     *
     * @param options
     * @param select 
     * @returns {} 
    */
    buttonTitle?: (options: HTMLOptionElement[], select: HTMLSelectElement) => string;

    /**
     * If set to true, optgroup's will be clickable, allowing to easily select multiple options belonging to the same group.
     */
    enableClickableOptGroups?: boolean;

    /**
     * If set to true, optgroup's will be collapsible.
     */
    enableCollapsibleOptGroups?: boolean;

    /**
     * Set to true or false to enable or disable the select all option.
     */
    includeSelectAllOption?: boolean;

    /**
     * This option is used by the buttonText and buttonTitle functions to determine of too much options would be displayed.
     */
    numberDisplayed?: number;

    /**
     * The text displayed if more than  {@link numberDisplayed} options are selected. This option is used by the default buttonText and buttonTitle callbacks.
     */
    nSelectedText?: string;

    /**
     * This option allows to control the name given to the select all option.
     * See {@link https://davidstutz.github.io/bootstrap-multiselect/#post|Server-Side Processing} for more details.
     */
    selectAllName?: string;

    /**
     * The text displayed for the select all option.
     */
    selectAllText?: string;

    /**
     * The select all option is added as additional option within the select.
     * To distinguish this option from the original options the value used for the select all option can be configured using the selectAllValue option.
     */
    selectAllValue?: string | number;

    /**
     * The generated HTML markup can be controlled using templates. Basically, templates are simple configuration options. 
     */
    templates?: Templates;
}

interface JQuery {
    multiselect(options?: MultiSelectOptions): JQuery;

    /**
     * This method is used to destroy the plugin on the given element - meaning unbinding the plugin.
     */
    multiselect(method:'destroy'):JQuery;

    /**
     * This method is used to refresh the checked checkboxes based on the currently selected options within the select. 
     * Click 'Select some options' to select some of the options. Then click refresh. 
     * The plugin will update the checkboxes accordingly.
     */
    multiselect(method:'refresh'):JQuery;

    /**
     * Rebuilds the whole dropdown menu. All selected options will remain selected (if still existent!).
     */
    multiselect(method:'rebuild'):JQuery;

    /**
     * Selects an option by its value. Works also using an array of values.
     * @param triggerOnChange  If set to true, the method will manually trigger the onChange option.
     */
    multiselect(method:'select', value:string|Array<string>|number, triggerOnChange?:boolean):JQuery;

    /**
     * Deselect an option by its value. Works also using an array of values.
     * @param triggerOnChange  If set to true, the method will manually trigger the onChange option.
     */
    multiselect(method:'deselect', value:string|Array<string>|number, triggerOnChange?:boolean):JQuery;

    /**
     * Selects all options. 
     * @param justVisible If set to true or not provided, all visible options are selected (when using the filter), 
     * otherwise (justVisible set to false) all options are selected.
     */
    multiselect(method:'selectAll', justVisible?:boolean):JQuery;

    /**
     * Deselects all options. 
     * @param justVisible If set to true or not provided, all visible options are deselected,  
     * otherwise (justVisible set to false) all options are deselected.
     */
    multiselect(method:'deselectAll', justVisible?:boolean):JQuery;

    /**
     * When manually selecting/deselecting options and the corresponding checkboxes, this function updates the text and title of the button.
     * 
     * Note that usually this method is only needed when using .multiselect('selectAll', justVisible) or .multiselect('deselectAll', justVisible). In all other cases, .multiselect('refresh') should be used.
     */
    multiselect(method:'updateButtonText'):JQuery;

    /**
     * Used to change configuration after initializing the multiselect. This may be useful in combination with {@link multiselect('rebuild')}.
     * @example  
     * $('#example-setOptions').multiselect('setOptions', options);
     * $('#example-setOptions').multiselect('rebuild');
     */
    multiselect(method:'setOptions', options:MultiSelectOptions):JQuery;

    /**
     * Disable both the underlying select and the dropdown button.
     */
    multiselect(method:'disable'):JQuery;

    /**
     * Enable both the underlying select and the dropdown button.
     */
    multiselect(method:'enable'):JQuery;

    multiselect(method:'dataprovider', data:Array<MultiSelectOptionElement>):JQuery;
}

declare module "bootstrap-multiselect"{
}