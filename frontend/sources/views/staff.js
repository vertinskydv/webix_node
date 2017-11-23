import { JetView } from 'webix-jet';
import { addNewEmployee, getStaff, removeEmployee } from '../models/queries';
import ConfirmDeleteModal from './confirm-delete-modal';
import RATE from '../models/staff/rate';
import URLS from '../models/urls';

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
                    options: URLS.get_positions
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
                    id: 'studio_id',
                    header: ['Studio', { content: 'serverFilter' }],
                    sort: 'server',
                    fillspace: true,
                    editor: 'combo',
                    options: URLS.get_studios
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
            url: URLS.get_staff,
            save: {
                update: URLS.update_employee
            }
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
        this.confirmDeleteModal = this.ui(ConfirmDeleteModal); 

        webix.extend(datatable, webix.ProgressBar);

        this.initializeModal();

        // get datatable sort info
        this.datatable.attachEvent('onBeforeSort', (by, dir) => {
            this.sortInfo[by] = dir;
        });

        /**
         * on Datatable scroll handler
         * If the table is scrolled to the bottom
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
            this.confirmDeleteModal.getRoot().show();
        });

        this.app.attachEvent('confirm:delete', () => {
            let selectedInfo = datatable.getSelectedId();
            if (!selectedInfo.id) {
                return;
            }
            removeEmployee(selectedInfo);
            datatable.remove(selectedInfo.id);
        });
    }

    initializeModal() {
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
                        options: URLS.get_positions
                    },
                    {
                        view: 'select',
                        label: 'Studio',
                        name: 'studio_id',
                        labelWidth: 150,
                        options: URLS.get_studios
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

