import {JetView} from 'webix-jet';

import URLS from '../models/urls';

export default class Equipment extends JetView {
    config() {

        return {
            rows: [
                {
                    cols: [
                        {},
                        {
                            margin: 20,
                            id: 'addEquipmentButton',
                            view: 'button',
                            type: 'iconButton',
                            icon: 'plus',
                            label: 'Add Equipment',
                            align: 'right',
                            autowidth: true
                        }
                    ]
                },
                {
                    minHeight: 500,
                    type: 'head',
                    cols: [
                        {
                            view: 'list',
                            gravity: 0.2
                        },
                        {
                            view: 'datatable',
                            gravity: 0.5
                        },
                        {
                            view: 'list',
                            gravity: 0.3
                        }
                    ]
                }
            ]
        };
    }

    init() {
        let addEquipmentButton = this.addEquipmentButton = $$('addEquipmentButton');
        let addEquipmentModal = this.addEquipmentModal = $$('addEquipmentModal');
        let addEquipmentForm = this.addEquipmentForm = $$('addEquipmentForm');
        let saveEquipmentBtn = this.saveEquipmentBtn = $$('saveEquipmentBtn');

        addEquipmentButton.attachEvent('onItemClick', () => {
            addEquipmentModal.show();
        });

        saveEquipmentBtn.attachEvent('onItemClick', () => {
            $$('imageUpload').send((response) => {
                debugger;
            });
        });
    }
}

/**
 * Modal
 */
webix.ui({
    view: 'window',
    id: 'addEquipmentModal',
    head: 'Add New Equipment',
    position: 'top',
    modal: true,
    move: true,
    width: 500,
    body: {
        view: 'form',
        id: 'addEquipmentForm',
        elements: [
            {view: 'text', label: 'Name', name: 'name', labelWidth: 150},
            {view: 'text', label: 'Type', name: 'type', labelWidth: 150},
            {view: 'text', label: 'Serial Number', name: 'serial_number', labelWidth: 150},
            {view: 'datepicker', label: 'Time of purchase', name: 'purchase_time', labelWidth: 150, labelPosition: 'left'},
            {
                view: 'select',
                label: 'Current state',
                name: 'state',
                labelWidth: 150,
                labelPosition: 'left',
                options: [
                    {id: 'used', value: 'Is Used'},
                    {id: 'not_used', value: 'Not Used'},
                    {id: 'broken', value: 'Broken'},
                    {id: 'under_repair', value: 'Under Repair'}
                ]
            },
            {
                view: 'select',
                label: 'Studio',
                name: 'studio',
                labelWidth: 150,
                labelPosition: 'left',
                options: URLS.get_studios
            },
            {
                view: 'uploader',
                id: 'imageUpload',
                label: 'Photo',
                name: 'photo',
                link: 'mylist',
                autosend: false,
                upload: '/upload_image',
                multiple: false
            },
            {
                view: 'list',
                id: 'mylist',
                type: 'uploader',
                autoheight: true,
                borderless: true
            },
            {
                margin: 20,
                id: 'modalButtons',
                cols: [
                    {
                        view: 'button',
                        value: 'Cancel',
                        click: "$$('addEquipmentModal').hide()"
                    },
                    // {
                    //     view: 'button',
                    //     value: 'Delete',
                    //     id: 'deleteBtn',
                    //     width: 100,
                    //     css: 'btn-danger'
                    // },
                    {
                        view: 'button',
                        value: 'Save',
                        id: 'saveEquipmentBtn'
                    }
                ]
            }
        ]
    }
});

