import { JetView } from 'webix-jet';
import { getStaffModalFormContent, addNewEmployee, getStaff, removeEmployee } from '../models/queries';
import '../models/confirm-delete-modal';

export default class Staff extends JetView {
    config() {
        return {
            rows: [
                {
                    cols: [
                        {},
                        {
                            margin: 20,
                            id: 'removeEmployeeButton',
                            view: 'button',
                            type: 'iconButton',
                            icon: 'times',
                            label: 'Remove Employee',
                            align: 'right',
                            autowidth: true,
                            css: 'btn-danger'
                        },
                        {
                            margin: 20,
                            id: 'addNewEmployeeButton',
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
                    id: 'staffDt',
                    editable: true,
                    editaction: 'dblclick',
                    select: 'row',
                    columns: [
                        {
                            id: 'name',
                            header: ['Name', { content: 'serverFilter' }],
                            sort: 'server',
                            fillspace: true
                        },
                        {
                            id: 'position',
                            header: ['Position', { content: 'textFilter' }],
                            sort: 'string',
                            fillspace: true
                        },
                        {
                            id: 'rate',
                            header: ['Rate', { content: 'textFilter' }],
                            sort: 'int',
                            width: 200
                        },
                        {
                            id: 'studio_name',
                            header: ['Studio', { content: 'textFilter' }],
                            sort: 'string',
                            fillspace: true

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
                    ready: function () {
                        if (!this.count()) { // if no data is available
                            webix.extend(this, webix.OverlayBox);
                            this.showOverlay("<div style='...'>There is no data</div>");
                        }
                    },
                    url: '/staff'
                }
            ]
        };
    }

    init() {
        let addEmployeeModalBtn = $$('addNewEmployeeButton');
        let removeEmployeeBtn = $$('removeEmployeeButton');
        let datatable = $$('staffDt');
        let modalForm;
        let modal;
        let addEmployeeBtn;
        let sortInfo = {};

        webix.extend(datatable, webix.ProgressBar);

        // get datatable sort info
        datatable.attachEvent('onBeforeSort', (by, dir) => {
            sortInfo[by] = dir;
        });

        // getStaff().then((data) => {
        //     datatable.parse(data.json(), 'json');
        // }).fail((error) => {
        //     throw new Error(error);
        // });

        /**
         * get form data and init Add New Employee form
         */
        getStaffModalFormContent().then((data) => {
            data = data.json();
            webix.ui({
                view: 'window',
                id: 'staffPropsModal',
                head: 'Add new Employee',
                position: 'top',
                modal: true,
                move: true,
                width: 500,
                body: {
                    view: 'form',
                    id: 'staffPropsForm',
                    elements: [
                        { view: 'text', label: 'Name', name: 'name', labelWidth: 150 },
                        {
                            view: 'select',
                            label: 'Position',
                            name: 'position',
                            id: 'modalStaffPosition',
                            labelWidth: 150,
                            options: data.positions
                        },
                        {
                            view: 'select',
                            label: 'Studio',
                            name: 'studio_id',
                            labelWidth: 150,
                            options: data.studios
                        },
                        {
                            view: 'select',
                            label: 'Rate',
                            name: 'rate',
                            labelWidth: 150,
                            value: 1,
                            options: [
                                { id: 0.1, valie: 0.1 },
                                { id: 0.15, valie: 0.15 },
                                { id: 0.2, valie: 0.2 },
                                { id: 0.25, valie: 0.25 },
                                { id: 0.3, valie: 0.3 },
                                { id: 0.35, valie: 0.35 },
                                { id: 0.4, valie: 0.4 },
                                { id: 0.45, valie: 0.45 },
                                { id: 0.5, valie: 0.5 },
                                { id: 0.55, valie: 0.55 },
                                { id: 0.6, valie: 0.6 },
                                { id: 0.65, valie: 0.65 },
                                { id: 0.7, valie: 0.7 },
                                { id: 0.75, valie: 0.75 },
                                { id: 0.8, valie: 0.8 },
                                { id: 0.85, valie: 0.85 },
                                { id: 0.9, valie: 0.9 },
                                { id: 0.95, valie: 0.95 },
                                { id: 1, valie: 1 }
                            ]
                        },
                        {
                            margin: 20,
                            id: 'modalButtons',
                            cols: [
                                {
                                    view: 'button',
                                    value: 'Cancel',
                                    click: '$$("staffPropsModal").hide()'
                                },
                                {
                                    view: 'button',
                                    value: 'Save',
                                    id: 'addEmployeeBtn'
                                }
                            ]
                        }
                    ]
                }
            });

            modal = $$('staffPropsModal');
            addEmployeeBtn = $$('addEmployeeBtn');
            modalForm = $$('staffPropsForm');

            // Save button. Get data from modal form and send to server.
            addEmployeeBtn.attachEvent('onItemClick', () => {
                let formData = modalForm.getValues();
                addNewEmployee(formData).then((data) => {
                    data = data.json();
                    datatable.add(data);
                    modal.hide();
                });
            });


            addEmployeeModalBtn.attachEvent('onItemClick', () => {
                modal.show();
                modalForm.clear();
            });
        });

        datatable.attachEvent('onScrollY', () => {
            let rowsCount = datatable.count();
            let rowH = datatable.config.rowHeight;

            // if the table is scrolled to the bottom
            if (datatable.getScrollState().y + datatable.Vj !== rowsCount * rowH) {
                return;
            }

            let filter = datatable.getState().filter;
            let sort = sortInfo;
            let filterData = {
                rows: rowsCount, 
                filter: filter, 
            }

            if (Object.keys(sort).length) {
                filterData.sort = sort;
            }

            datatable.showProgress({
                type: 'bottom'
            });

            getStaff(filterData).then((data) => {
                data = data.json();
                data.forEach((row) => {
                    datatable.add(row);
                });
                datatable.hideProgress();
            }).fail((err) => {
                throw new Error(err);
            });
        });

        removeEmployeeBtn.attachEvent('onItemClick', () => {
            let selectedInfo = datatable.getSelectedId();
            if (!selectedInfo) {
                return;
            }
            $$('confirmDeleteModal').show();
        });

        $$('deleteButton').attachEvent('onItemClick', () => {
            let selectedInfo = datatable.getSelectedId();
            let selectedId;
            // debugger;
            if (!selectedInfo) {
                return;
            }

            selectedId = selectedInfo.id;
            removeEmployee({id: selectedId});
            datatable.remove(selectedId);
            $$('confirmDeleteModal').hide();
        });

    }
};

