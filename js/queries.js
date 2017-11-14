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
            console.log(rows);
            rows = rows.map((rowObject) => {
                let staffIdArr = JSON.parse(rowObject.staff_id);
                if (!staffIdArr) {
                    rowObject.staff_count = 0
                } else {
                    rowObject.staff_count = staffIdArr.length;
                }
                delete rowObject.staff_id;
                return rowObject;
            })
            
            res.send(rows);
        });
    });

    app.post('/add_new_location', (req, res) => {
        let data = req.body;
        db.query(`INSERT INTO studios (id, name, address)
        VALUES ('${data.id = uniqid()}', '${data.name}', '${data.address}')`, (err, rows, fields) => {
            if (err) res.status(500).send({error: err.message});
            data.staff_count = 0;
            res.send(data);
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

    app.post('/get_staff', (req, res) => {
        let data = req.body;
        db.query(`DELETE FROM studios WHERE id = '${data.id}'`, (err, rows, fields) => {
            if (err) res.status(500).send({error: err.message});
            res.status(200).send();
        });
    });
};
