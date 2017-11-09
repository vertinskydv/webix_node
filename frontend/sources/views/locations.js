import {JetView} from 'webix-jet';
import {data} from "../models/records";

export default class Locations extends JetView {
    config() {
        return {
            rows: [
                {
                    cols: [
                        {},
                        {
                            margin: 20,
                            view: 'button',
                            type: 'iconButton',
                            icon: 'plus',
                            label: 'Add New Studio',
                            align: 'right',
                            autowidth: true,
                            click: '$$("studioPropsForm").clear(); ' +
                            '$$("studioPropsModal").show();'
                        }
                    ],
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
                            fillspace: true,
                        },
                        {
                            id: 'address',
                            header: ['Address', {content: 'textFilter'}],
                            sort: 'string',
                            fillspace: true,
                        },
                        {
                            id: 'staff_count',
                            header: ['Staff Count', {content: 'textFilter'}],
                            sort: 'int',
                            width: 200,
                        }
                    ],
                    on: {
                        onBeforeLoad: function () {
                            this.showOverlay('Loading...');
                        },
                        onAfterLoad: function () {
                            this.hideOverlay();
                        },
                        onItemDblClick: rowDblClickHandler
                    }
                }
            ]
        };
    }

    init() {
        webix.ajax().post('/locations').then(function (result) {
            result = result.json();
            $$('locationsDt').parse(result, 'json');
        }).fail(function (err) {
            new Error(err);
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

function rowDblClickHandler(data, some) {
    data = $$('locationsDt').getItem(data.row);

    $$('studioPropsModal').show();
    $$('studioPropsForm').parse(data);
}

function onEditEntry () {
    alert('Edit');
}

function onNewEntry () {
    alert('New');
}