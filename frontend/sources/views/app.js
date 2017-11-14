import {JetView, plugins} from 'webix-jet';
import {getLocations} from '../models/queries';

export default class ToolBar extends JetView {
    config() {
        return {
            rows: [
                mainToolbar,
                {
                    cols: [
                        navigation,
                        {$subview: true}
                    ]
                }
            ]
        };
    }

    urlChange(view, url) {
        if (url[1].page === 'locations') {
            $$('toolbarButtons').show();
        } else {
            $$('toolbarButtons').hide();
        }
    }

    init() {
        // refresh button handler
        $$('refreshBtn').attachEvent('onItemClick', function (id, e) {
            let datatable = $$('locationsDt');

            datatable.clearAll();
            getLocations().then((data) => {
                datatable.parse(data.json(), 'json');
            }).fail((error) => {
                throw new Error(error);
            });
        });

        // export to excel button handler
        $$('exportToExcelBtn').attachEvent('onItemClick', () => {
            let datatable = $$('locationsDt');
            webix.toExcel(datatable);
        });

        this.use(plugins.Menu, 'app:nav');
    }
}

let mainToolbar = {
    view: 'toolbar',
    id: 'mainToolbar',
    padding: 3,
    elements: [
        {
            view: 'label',
            css: 'logo',
            label: '<span class="logo"><span class="logo__name">Book a studio</span> owner app</span>'
        },
        {
            id: 'toolbarButtons',
            cols: [
                {view: 'button', id: 'refreshBtn', type: 'icon', icon: 'refresh', width: 30},
                {view: 'button', id: 'exportToExcelBtn', type: 'icon', icon: 'share-square', width: 30}
            ]
        }
    ]
};

let leftMenuUiData = [
    {
        id: 'locations',
        icon: 'home',
        value: 'Locations',
        name: 'locations'
    },
    {
        id: 'staff',
        icon: 'users',
        value: 'Staff'
    },
    {
        id: 'equipment',
        icon: 'headphones',
        value: 'Equipment'
    },
    {
        id: 'calendar',
        icon: 'calendar',
        value: 'Calendar',
        data: [
            {
                id: 'rental_schedule',
                icon: 'clock-o',
                value: 'Rental schedule'
            },
            {
                id: 'staff_work_schedule',
                icon: 'address-card-o',
                value: 'Staff work schedule'
            }
        ]
    }
];

let navigation = {
    view: 'sidebar',
    id: 'app:nav',
    data: leftMenuUiData
};

