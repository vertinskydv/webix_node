import {JetView} from 'webix-jet';

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

    init() {
        $$('refresh').attachEvent('onItemClick', function (id, e) {
            let datatable = $$('locationsDt');
            datatable.clearAll();
        });
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
        {view: 'button', id: 'refresh', type: 'icon', icon: 'refresh', width: 30},
        {view: 'button', type: 'icon', icon: 'share-square', width: 30}
    ]
};

let leftMenuUiData = [
    {
        id: 'locations',
        icon: 'home',
        value: 'Locations',
        name: 'locations',
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
    id: 'nav',
    data: leftMenuUiData
};

