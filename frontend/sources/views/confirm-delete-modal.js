import {JetView} from 'webix-jet';

export default class ConfirmDeleteModal extends JetView {
    config() {
        return {
            view: 'window',
            id: 'confirmDeleteModal',
            head: 'Are you shure?',
            position: 'top',
            modal: true,
            move: true,
            width: 500,
            body: {
                cols: [
                    {
                        view: 'button',
                        value: 'No',
                        click: "$$('confirmDeleteModal').hide()"
                    },
                    {
                        view: 'button',
                        id: 'deleteButton',
                        value: 'Delete',
                        css: 'btn-danger'
                    }
                ]
            }
        };
    }

    init() {
        $$('deleteButton').attachEvent('onItemClick', () => {
            this.app.callEvent("confirm:delete");    
        });
    }
}
