import './styles/app.css';
import {JetApp} from 'webix-jet';

webix.ready(() => {
    let app = new JetApp({
        start: '/app/locations'
    });
    app.render();

    app.attachEvent('app:error:resolve', (name, error) => {
        window.console.error(error);
    });
});
