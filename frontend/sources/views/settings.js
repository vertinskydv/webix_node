import {JetView} from 'webix-jet';


export default class Settings extends JetView {
    config() {
        return {
            cols: [
                {
                    view: 'form',
                    padding: 60,
                    elements: [
                        {
                            view: 'text',
                            label: 'Some field',
                            labelWidth: 120
                        },
                        {
                            view: 'text',
                            label: 'Some field2',
                            labelWidth: 120
                        },
                        {
                            view: 'text',
                            label: 'Some field3',
                            labelWidth: 120
                        },
                        {
                            view: 'text',
                            label: 'Some field4',
                            labelWidth: 120
                        },
                        { 
                            view: 'checkbox',
                            id: 'field_a',
                            label: 'Second age',
                            labelWidth: 120,
                            value: 0
                        }

                    ]
                },
                {
                    view: 'form',
                    padding: 60,
                    elements: [
                        {
                            view: 'text'
                        }
                    ]
                }
            ]
        };
    }

    init() {

    }
}
