let mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wbx_db'
});
db.connect();

module.exports = function (app) {
    app.get('/', (req, res) => {
        db.query('SELECT * FROM clients', (err, rows, fields) => {
            if (err) throw err;
            res.send(rows);
        });
    });
};
