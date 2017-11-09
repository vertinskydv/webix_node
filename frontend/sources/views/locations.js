import {JetView} from 'webix-jet';
import {data} from "../models/records";

export default class Locations extends JetView {
    config() {
        return {
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
                onItemDblClick: editRow
            },
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
            {margin: 20, cols: [
                {
                    view: 'button',
                    value: 'Cancel',
                    click: "$$('studioPropsModal').hide()"
                },
                {view: 'button', value: 'Save'}
            ]}
        ]
    }
});

function editRow (data, some) {
    data = $$('locationsDt').getItem(data.row);

    $$('studioPropsModal').show();
    $$('studioPropsForm').parse(data);
}