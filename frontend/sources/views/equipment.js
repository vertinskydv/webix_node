import {JetView} from 'webix-jet';

export default class Equipment extends JetView {
    config() {
        return {
            minHeight: 500,
            cols: [
                {
                    view: 'list',
                    
                },
                {
                    view: 'datatable'
                }
            ]
        };
    }

    init() {
        alert('eqp');
    }
}
