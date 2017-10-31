import {JetView, plugins} from 'webix-jet';

export default class TopView extends JetView {
    config() {
        let leftMenuUiData = [
            {
                id: 'locations',
                icon: 'home',
                value: 'Locations'
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

        return {
            rows: [
                {
                    view: 'toolbar',
                    id: 'mainToolbar',
                    padding: 3,
                    elements: [
                        {
                            view: 'label',
                            css: 'logo',
                            label: '<span class="logo"><span class="logo__name">Book a studio</span> owner app</span>'
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: 'sidebar',
                            id: 'nav',
                            data: leftMenuUiData
                        },
                        {
                            $subview: true
                        }
                    ]
                }
            ]
        };
    }
    init() {
        console.log(plugins);
        this.use(plugins.Menu, {
            id: 'nav',
            urls: {
                locations: '/data',
                staff: '/start',
                equipment: '/data',
                rental_schedule: '/data',
                staff_work_schedule: '/start'
            }
        });
    }
}
