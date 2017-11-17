export default webix.ui({
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
});
