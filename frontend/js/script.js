webix.ready(function () {
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
    let locationsUiData = {
        view: 'datatable',

    };

    webix.ui({
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
                        data: leftMenuUiData
                    },
                    {
                        view: 'datatable',

                    }
                ]
            }
        ]
    });


});
