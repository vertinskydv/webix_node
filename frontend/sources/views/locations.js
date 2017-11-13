import {JetView} from 'webix-jet';
import URL from '../models/urls';

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
        let form = $$('studioPropsForm');
        let saveBtn = $$('saveEntryBtn');

        form.bind(datatable);

        // get and parse initial data
        webix.ajax().post(URL.get_locations).then(function (result) {
            datatable.parse(result.json(), 'json');
        }).fail(function (err) {
            throw new Error(err);
        });


        // add new datatable row
        $$('addNewEntryButton').attachEvent('onItemClick', function (id, e) {
            modal.show();
            form.clear();
            onSaveEventId && saveBtn.detachEvent(onSaveEventId);

            onSaveEventId = saveBtn.attachEvent('onItemClick', function () {
                let formData = form.getValues();
                webix.ajax().post(URL.new_location, formData).then((data) => {
                    datatable.add(data.json());
                }).fail((err) => {
                    throw new Error(err);
                });
                modal.hide();
            });
        });

        // edit existing datatable row
        datatable.attachEvent('onItemDblClick', function (data) {
            data = datatable.getItem(data.row);
            modal.show();
            // form.parse(data);
            onSaveEventId && saveBtn.detachEvent(onSaveEventId);

            onSaveEventId = saveBtn.attachEvent('onItemClick', () => {
                let formData = form.getValues();

                form.save();
                webix.ajax().post(URL.edit_location, formData);
                modal.hide();
            });
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
                margin: 20, cols: [
                    {
                        view: 'button',
                        value: 'Cancel',
                        click: "$$('studioPropsModal').hide()"
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

