let mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wbx_db'
});
db.connect();

module.exports = function (app) {
    app.post('/locations', (req, res) => {
        db.query('SELECT * FROM studios', (err, rows, fields) => {
            if (err) throw err;
            res.send(rows);
        });
    });
};
