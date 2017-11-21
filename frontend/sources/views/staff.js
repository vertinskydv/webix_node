import { JetView } from 'webix-jet';
import { getStaffModalFormContent, addNewEmployee, getStaff, removeEmployee } from '../models/queries';
import '../models/confirm-delete-modal';
import POSITIONS from '../models/staff/positions';
import RATE from '../models/staff/rate';

export default class Staff extends JetView {
    config() {
        let datatable = {
            view: 'datatable',
            id: 'staffDt',
            editaction: 'dblclick',
            select: 'row',
            columns: [
                {
                    id: 'name',
                    header: ['Name', { content: 'serverFilter' }],
                    sort: 'server',
                    fillspace: true,
                    editor: 'text'
                },
                {
                    id: 'position',
                    header: ['Position', { content: 'serverFilter' }],
                    sort: 'server',
                    fillspace: true,
                    editor: 'select',
                    options: POSITIONS
                },
                {
                    id: 'rate',
                    header: ['Rate', { content: 'serverFilter' }],
                    sort: 'server',
                    width: 200,
                    editor: 'select',
                    options: RATE
                },
                {
                    id: 'studio_name',
                    header: ['Studio', { content: 'serverFilter' }],
                    sort: 'server',
                    fillspace: true,
                    editor: 'combo',
                    options: '/get_studios'
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
            },
            editable: true,
            url: '/staff'
        };

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
                datatable
            ]
        };
    }

    init() {
        this.addEmployeeModalBtn = $$('addNewEmployeeButton');
        this.removeEmployeeBtn = $$('removeEmployeeButton');
        let datatable = this.datatable = $$('staffDt');
        let sortInfo =this.sortInfo = {};
        debugger;


        webix.extend(datatable, webix.ProgressBar);

        // get datatable sort info
        this.datatable.attachEvent('onBeforeSort', (by, dir) => {
            this.sortInfo[by] = dir;
        });

        /**
         * get form data and init Add New Employee form
         */
        getStaffModalFormContent().then((data) => {
            this.initializeModal(data.json());
        });

        /**
         * on Datatable scroll handler
         * If the table is scrolled to the bottom - 
         */
        datatable.attachEvent('onScrollY', () => {
            let rowsCount = datatable.count();
            let rowH = datatable.config.rowHeight;

            // if the table is scrolled to the bottom
            if (datatable.getScrollState().y + datatable.Vj !== rowsCount * rowH) {
                return;
            }

            let filter = datatable.getState().filter;
            let filterData = {
                rows: rowsCount,
                filter: filter,
            }

            if (Object.keys(sortInfo).length) {
                filterData.sort = sortInfo;
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

        this.removeEmployeeBtn.attachEvent('onItemClick', () => {
            console.log(this.app);

        });

        $$('deleteButton').attachEvent('onItemClick', () => {
            debugger;
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

    initializeModal(data) {
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
                        options: RATE
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
                                id: 'saveBtn'
                            }
                        ]
                    }
                ]
            }
        });

        this.modal = $$('staffPropsModal');
        this.saveBtn = $$('saveBtn');
        this.modalForm = $$('staffPropsForm');

        // Save button. Get data from modal form and, send to server.
        this.saveBtn.attachEvent('onItemClick', () => {
            let formData = this.modalForm.getValues();
            addNewEmployee(formData).then((data) => {
                this.datatable.add(data.json());
                this.modal.hide();
            });
        });

        this.addEmployeeModalBtn.attachEvent('onItemClick', () => {
            this.modal.show();
            this.modalForm.clear();
        });
    }
};

