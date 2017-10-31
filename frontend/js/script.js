webix.ready(function () {

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
                        view: 'datatable'

                    }
                ]
            }
        ]
    });


});
