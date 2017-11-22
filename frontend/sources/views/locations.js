import {JetView} from 'webix-jet';
import {getLocations, addLocation, editLocation, deleteLocation} from '../models/queries';
import ConfirmDeleteModal from './confirm-delete-modal';


export default class Locations extends JetView {
    config() {
        let datatable = {
            view: 'datatable',
            id: 'locationsDt',
            editable: true,
            editaction: 'dblclick',
            select: 'row',
            columns: [
                {
                    id: 'name',
                    header: ['Studio Name', {content: 'textFilter'}],
                    sort: 'string',
                    fillspace: true
                },
                {
                    id: 'address',
                    header: ['Address', {content: 'textFilter'}],
                    sort: 'string',
                    fillspace: true
                },
                {
                    id: 'staff_count',
                    header: ['Staff Count', {content: 'textFilter'}],
                    sort: 'int',
                    width: 200
                }
            ],
            on: {
                onBeforeLoad() {
                    this.showOverlay('Loading...');
                },
                onAfterLoad() {
                    this.hideOverlay();
                }
            },
            ready() {
                if (!this.count()) { // if no data is available
                    webix.extend(this, webix.OverlayBox);
                    this.showOverlay("<div style='...'>There is no data</div>");
                }
            }
        };

        return {
            rows: [
                {
                    cols: [
                        {},
                        {
                            margin: 20,
                            id: 'addNewEntryBtn',
                            view: 'button',
                            type: 'iconButton',
                            icon: 'plus',
                            label: 'Add New Studio',
                            align: 'right',
                            autowidth: true
                        }
                    ]
                },
                datatable
            ]
        };
    }

    init() {
        let onSaveEventId;
        let datatable = $$('locationsDt');
        let modal =  $$('studioPropsModal');
        let form = $$('studioPropsForm');
        let saveBtn = $$('saveEntryBtn');
        let deleteBtn = $$('deleteBtn');
        let confirmDeleteModal = this.ui(ConfirmDeleteModal);

        // get and parse initial data
        getLocations().then((result) => {
            datatable.parse(result.json(), 'json');
        }).fail((err) => {
            throw new Error(err);
        });

        // add new datatable row
        $$('addNewEntryBtn').attachEvent('onItemClick', (id, e) => {
            $$('deleteBtn').hide();
            form.clear();
            modal.show();

            onSaveEventId && saveBtn.detachEvent(onSaveEventId);
            onSaveEventId = saveBtn.attachEvent('onItemClick', () => {
                let formData = form.getValues();
               
                addLocation(formData).then((data) => {
                    datatable.add(data.json());
                }).fail((err) => {
                    throw new Error(err);
                });
                modal.hide();
            });
        });

        // edit datatable row handler
        datatable.attachEvent('onItemDblClick', (data) => {
            data = datatable.getItem(data.row);
            modal.show();
            form.setValues(data);
            $$('deleteBtn').show();

            onSaveEventId && saveBtn.detachEvent(onSaveEventId);
            onSaveEventId = saveBtn.attachEvent('onItemClick', () => {
                let formData = form.getValues();

                datatable.updateItem(formData.id, formData);
                editLocation(formData);
                modal.hide();
            });
        });

        deleteBtn.attachEvent('onItemClick', () => {
            confirmDeleteModal.getRoot().show();
        });

        this.app.attachEvent('confirm:delete', () => {
            let formData = form.getValues();
            datatable.remove(formData.id);
            deleteLocation(formData);
            modal.hide();
        });
    }
}

/**
 * Modal
 */
webix.ui({
    view: 'window',
    id: 'studioPropsModal',
    head: 'Edit Studio Info',
    position: 'top',
    modal: true,
    move: true,
    width: 500,
    body: {
        view: 'form',
        id: 'studioPropsForm',
        elements: [
            {view: 'text', label: 'Studio Name', name: 'name', labelWidth: 150},
            {view: 'text', label: 'Address', name: 'address', labelWidth: 150},
            {
                margin: 20,
                id: 'modalButtons',
                cols: [
                    {
                        view: 'button',
                        value: 'Cancel',
                        click: "$$('studioPropsModal').hide()"
                    },
                    {
                        view: 'button',
                        value: 'Delete',
                        id: 'deleteBtn',
                        width: 100,
                        css: 'btn-danger',
                        click: `$$('confirmDeleteModal').show()`
                    },
                    {
                        view: 'button',
                        value: 'Save',
                        id: 'saveEntryBtn'
                    }
                ]
            }
        ]
    }
});

