import {JetView} from 'webix-jet';

import {addEquipment, getStudioEquipments} from '../models/queries';

import STATE from '../models/equipment/state';

import URLS from '../models/urls';

export default class Equipment extends JetView {
    config() {

        return {
            rows: [
                {
                    cols: [
                        {
                            template: () => {
                                return '<h1 class="main-header">Equipment</h1>';
                            }
                        },
                        {
                            margin: 20,
                            id: 'addEquipmentButton',
                            view: 'button',
                            type: 'iconButton',
                            icon: 'plus',
                            label: 'Add Equipment',
                            align: 'right',
                            height: 40,
                            autowidth: true
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: 'list',
                            id: 'studioList',
                            gravity: 0.2,
                            template: '#value#',
                            select: true
                        },
                        {
                            view: 'datatable',
                            id: 'equipmentDatatable',
                            gravity: 0.5,
                            select: true,
                            editable: true,
                            editaction: 'dblclick',
                            columns: [
                                {
                                    id: 'name',
                                    header: 'Name',
                                    fillspace: true,
                                    editor: 'text'
                                },
                                {
                                    id: 'type',
                                    header: 'Type',
                                    fillspace: true,
                                    editor: 'text'
                                },
                                {
                                    id: 'serial_number',
                                    header: 'Serial Number',
                                    fillspace: true,
                                    editor: 'text'
                                },
                                {
                                    id: 'purchase_time',
                                    header: 'Purchase Time',
                                    fillspace: true,
                                    editor: 'date',
                                    format: webix.Date.dateToStr('%Y-%m-%d')
                                },
                                {
                                    id: 'state',
                                    header: 'State',
                                    fillspace: true,
                                    editor: 'select',
                                    options: STATE
                                }
                            ],
                            save: {
                                update: URLS.update_equipment
                            }
                        },
                        {
                            template: (obj) => {
                                if (Object.keys(obj).length >0) {
                                    return `
                                    <div style="
                                        width: 100%;
                                        height: 100%;
                                        background-size: contain;
                                        background-image: url(${obj.img_url});
                                        background-repeat: no-repeat;
                                        background-position: center;
                                    "></div>`;
                                }
                                return '';
                            },
                            id: 'viewImageBlock',
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
        let imageUploader = this.imageUploader = $$('imageUpload');
        let list = this.list = $$('studioList');
        let datatable = this.datatable = $$('equipmentDatatable');
        let viewImageBlock = this.viewImageBlock = $$('viewImageBlock');


        addEquipmentButton.attachEvent('onItemClick', () => {
            addEquipmentForm.clear();
            imageUploader.files.data.clearAll();
            addEquipmentModal.show();
        });

        list.load(URLS.get_studios, 'json', (data) => {
            data = JSON.parse(data);
            list.parse(data, 'json');
        });

        list.attachEvent('onItemClick', (id) => {
            if (!id) {
                return;
            }

            this.activeStudioId = id;
            this.clearViewImageBlock();

            getStudioEquipments({id: id}).then((data) => {
                data = data.json();
                datatable.clearAll();
                this.fillDatatable(data);
            });
        });

        datatable.attachEvent('onItemClick', () => {
            let rowData = datatable.getSelectedItem();
            this.fillViewImageBlock(rowData);
        });

        saveEquipmentBtn.attachEvent('onItemClick', () => {
            $$('imageUpload').send((response) => {
                let formData = addEquipmentForm.getValues();
                formData.img_url = response.img_url;
                addEquipment(formData).then((data) => {
                    data = data.json();
                    if (data.studio_id === this.activeStudioId) {
                        datatable.add(data);
                        this.datatable.hideOverlay();
                    }
                });
                addEquipmentModal.hide();
            });
        });
    }

    fillDatatable(data) {
        this.datatable.hideOverlay();
        this.datatable.parse(data);
        if (!this.datatable.count()) {
            this.datatable.showOverlay('<div>There is no data</div>');
        }
    }

    fillViewImageBlock(data) {
        this.viewImageBlock.parse(data);
    }

    clearViewImageBlock() {
        this.viewImageBlock.parse([]);
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
            {view: 'datepicker', label: 'Time of purchase', name: 'purchase_time', labelWidth: 150, format: '%d-%m-%Y'},
            {
                view: 'select',
                label: 'Current state',
                name: 'state',
                labelWidth: 150,
                labelPosition: 'left',
                options: STATE
            },
            {
                view: 'select',
                label: 'Studio',
                name: 'studio_id',
                labelWidth: 150,
                labelPosition: 'left',
                options: URLS.get_studios
            },
            {
                view: 'uploader',
                id: 'imageUpload',
                label: 'Photo',
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

