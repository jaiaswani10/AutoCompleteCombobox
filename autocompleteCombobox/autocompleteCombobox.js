import { LightningElement, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class AutocompleteCombobox extends LightningElement {
    @api listOfData;
    @api cloneListOfData;
    @api componentNo;

    selectedOption = {
        label: '',
        value: '',
        referenceName: '',
        relationshipName: '',
    };
    message = 'Loading...';
    hasDropDownOpened = false;
    dropDownClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
    hasSelection = "slds-combobox_container slds-m-bottom_medium";
    index = -1;
    liSelected;    

    openDropDown(event, msg) {
        if (msg == null && !event && (event.keyCode == undefined || event.keyCode == 13)) {
            this.hasDropDownOpened = false;
            return;
        }
        this.hasDropDownOpened = true;
        this.dropDownClass += " slds-is-open";
    }

    closeDropDown() {        
        if (!this.wasOnAutocompleteCombobox) {
            this.dropDownClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
            this.hasDropDownOpened = false;
        }
    }

    handleSearch(event) {
        const searchKey = event.currentTarget.value;
        this.selectedOption.label = event.currentTarget.value;
        console.log('searchKey', searchKey);
        if (this.listOfData == undefined) {
            return;
        }
        if (searchKey) {
            let dataList = JSON.parse(JSON.stringify(this.cloneListOfData));
            this.filterList(dataList, searchKey);
        }
        else {
            this.message = null;
            this.listOfData = this.cloneListOfData;
        }
    }

    filterList(dataList, searchKey) {
        let filteredResult = [];
        for (let item = 0; item < dataList.length; item++) {
            let dataValue = dataList[item].label.split(" ");
            for (let wordIdx in dataValue) {
                if (dataValue[wordIdx].toLowerCase().startsWith(searchKey.toLowerCase())) {
                    if (filteredResult.indexOf(dataList[item]) == -1) {
                        filteredResult.push(dataList[item]);
                    }
                }
            }
        }
        this.message = null;
        this.listOfData = filteredResult;
        // console.log(this.listOfData);
    }

    setOption(event) {
        this.selectedOption.label = event.currentTarget.dataset.optionLabel;
        this.selectedOption.value = event.currentTarget.dataset.optionValue;
        this.selectedOption.referenceName = event.currentTarget.dataset.optionReferenceName;
        this.selectedOption.componentNo = this.componentNo;
        this.selectedOption.relationshipName = event.currentTarget.dataset.optionRelationshipName

        this.hasSelection = "slds-combobox_container slds-m-bottom_medium slds-has-selection";
        this.dropDownClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
        this.hasDropDownOpened = close;
        const selectedEvent = new CustomEvent('selected', { detail: JSON.stringify(this.selectedOption) });
        this.dispatchEvent(selectedEvent);
    }

    navigateItems(event) {
        // console.log('onkeyup', event.keyCode, 'this.index: ', this.index);
        let listElements = this.template.querySelectorAll(`ul li`);
        let len = listElements.length - 1;
        
        if (!this.hasDropDownOpened) {
            this.openDropDown(null, 'show');
        }
        if (event.keyCode == 40) {            
            this.index++;
            if (this.liSelected) {
                this.removeClass(this.liSelected, 'selected');
                let next = listElements[this.index];
                if (typeof next !== undefined && this.index <= len) {
                    this.liSelected = next;
                } else {
                    this.index = 0;
                    this.liSelected = listElements[0];
                }
                this.addClass(this.liSelected, 'selected');
                // console.log(this.index);
            }
            else {
                this.index = 0;
                this.liSelected = listElements[0];
                this.addClass(this.liSelected, 'selected');
            }
        }
        if (event.keyCode == 38) {            
            if (this.liSelected) {
                this.removeClass(this.liSelected, 'selected');
                this.index--;
                // console.log(this.index);
                let next = listElements[this.index];
                if (typeof next !== undefined && this.index >= 0) {
                    this.liSelected = next;
                } else {
                    this.index = len;
                    this.liSelected = listElements[len];
                }
                this.addClass(this.liSelected, 'selected');
            }
            else {
                this.index = 0;
                this.liSelected = listElements[len];
                this.addClass(this.liSelected, 'selected');
            }
        }
    }

    removeClass(el, className) {
        el.focus();
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    addClass(el, className) {
        el.focus();
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }
    
    wasOnAutocompleteCombobox = false;
    onInputMouseEtr() {
        this.wasOnAutocompleteCombobox = true;
        // console.log('onInputMouseEtr', this.wasOnAutocompleteCombobox);
    }

    onInputMouseLev() {
        this.wasOnAutocompleteCombobox = false;
        // console.log('onInputMouseLev', this.wasOnAutocompleteCombobox);
    }
}