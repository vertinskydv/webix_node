let mysql = require('mysql');
let bodyParser = require('body-parser');
let uniqid = require('uniqid');

let jsonParser = bodyParser.json();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wbx_db'
});
db.connect();

module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.post('/locations', (req, res) => {
        db.query('SELECT * FROM studios ORDER BY name', (err, rows, fields) => {
            if (err) throw err;
            res.send(rows);
        });
    });

    app.post('/add_new_location', (req, res) => {
        let data = req.body;
        db.query(`INSERT INTO studios (id, name, address, staff_count)
        VALUES ('${data.id = uniqid()}', '${data.name}', '${data.address}', '${data.staff_count}')`, (err, rows, fields) => {
            if (err) res.status(500).send({error: err.message});
            res.status(200).send(data);
        });
    });

    app.post('/edit_location', (req, res) => {
        let data = req.body;
        db.query(`UPDATE studios SET name = '${data.name}', address = '${data.address}', staff_count = ${data.staff_count} WHERE id='${data.id}'`, (err, rows, fields) => {
            if (err) res.status(500).send({error: err.message});
            res.status(200).send();
        });
    });

    app.post('/delete_location', (req, res) => {
        let data = req.body;
        db.query(`DELETE FROM studios WHERE id = '${data.id}'`, (err, rows, fields) => {
            if (err) res.status(500).send({error: err.message});
            res.status(200).send();
        });
    });
};
