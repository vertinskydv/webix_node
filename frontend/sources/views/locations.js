import {JetView} from 'webix-jet';
import URL from '../models/urls';
import {getLocations, addLocation, editLocation, deleteLocation} from '../models/queries';

export default class Locations extends JetView {
    config() {
        return {
            rows: [
                {
                    cols: [
                        {},
                        {
                            margin: 20,
                            id: 'addNewEntryButton',
                            view: 'button',
                            type: 'iconButton',
                            icon: 'plus',
                            label: 'Add New Studio',
                            align: 'right',
                            autowidth: true
                        }
                    ]
                },
                {
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
                    }
                }
            ]
        };
    }

    init() {
        let onSaveEventId;
        let datatable = $$('locationsDt');
        let modal =  $$('studioPropsModal');
        let confirmDeleteModal = $$('confirmDeleteModal');
        let form = $$('studioPropsForm');
        let saveBtn = $$('saveEntryBtn');
        let modalButtons =  $$('modalButtons');
        let deleteButton = $$('deleteButton');

        form.bind(datatable);

        $$('nav').select('locations');

        // get and parse initial data
        getLocations().then(function (result) {
            datatable.parse(result.json(), 'json');
        }).fail(function (err) {
            throw new Error(err);
        });

        // add new datatable row
        $$('addNewEntryButton').attachEvent('onItemClick', (id, e) => {
            modal.show();
            form.clear();
            $$('preDeleteBtn').hide();
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

        // edit existing datatable row
        datatable.attachEvent('onItemDblClick', (data) => {
            data = datatable.getItem(data.row);
            modal.show();
            $$('preDeleteBtn').show();
            onSaveEventId && saveBtn.detachEvent(onSaveEventId);

            onSaveEventId = saveBtn.attachEvent('onItemClick', () => {
                let formData = form.getValues();

                form.save();
                editLocation(formData);
                modal.hide();
            });
        });

        deleteButton.attachEvent('onItemClick', () => {
            let formData = form.getValues();
            deleteLocation(formData);
            modal.hide();
            confirmDeleteModal.hide();
            datatable.remove(formData.id);
        });
    }
};

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
            {view: 'text', attributes: {type: 'number'}, label: 'Staff Count', name: 'staff_count', labelWidth: 150},
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
                        id: 'preDeleteBtn',
                        width: 100,
                        css: 'btn-danger',
                        click: "$$('confirmDeleteModal').show()"
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

webix.ui({
    view: 'window',
    id: 'confirmDeleteModal',
    head: 'Are you shure?',
    position: 'top',
    modal: true,
    move: true,
    width: 500,
    body: {
        cols: [
            {
                view: 'button',
                value: 'No',
                click: "$$('confirmDeleteModal').hide()"
            },
            {
                view: 'button',
                id: 'deleteButton',
                value: 'Yes',
                css: 'btn-danger'
            }
        ]
    }
});

