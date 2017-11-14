import {JetView} from 'webix-jet';
import {} from '../models/queries';

export default class Staff extends JetView {
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
                            label: 'Add A New Employee',
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
    }
};

