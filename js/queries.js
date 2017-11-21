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

    // Locations page queries
    // ============================================
    app.post('/locations', (req, res) => {
        db.query('SELECT * FROM studios ORDER BY name', (err, rows, fields) => {
            if (err) throw err;
            rows = rows.map((rowObject) => {
                let staffIdStr = rowObject.staff_id;
                if (!staffIdStr) {
                    rowObject.staff_count = 0
                } else {
                    let staffIdArr = JSON.parse(staffIdStr);
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
        VALUES ('${data.id = uniqid()}', '${data.name}', '${data.address}')`,
        (err, rows, fields) => {
            if (err) res.status(500).send({ error: err.message });
            data.staff_count = 0;
            res.send(data);
        });
    });

    app.post('/edit_location', (req, res) => {
        let data = req.body;
        db.query(`UPDATE studios 
        SET name = '${data.name}', address = '${data.address}' WHERE id='${data.id}'`,
        (err, rows, fields) => {
            if (err) res.status(500).send({ error: err.message });
            res.status(200).send();
        });
    });

    app.post('/delete_location', (req, res) => {
        let data = req.body;
        db.query(`DELETE FROM studios WHERE id = '${data.id}'`, (err, rows, fields) => {
            if (err) res.status(500).send({ error: err.message });
            res.status(200).send();
        });
    });
    // ============================================
    // End Locations page queries

    // Staff page queries
    // ============================================

    app.post('/get_staff_modal_form', (req, res) => {
        let getPositions = new Promise((resolve, reject) => {
            db.query(`
                SELECT 
                    * 
                FROM 
                    positions`,
                (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
        });


        let getStudios = new Promise((resolve, reject) => {
            let result;
            db.query(`
                SELECT  
                    id, name AS value 
                FROM 
                    studios`,
                (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
        });

        Promise.all([getPositions, getStudios]).then((data) => {
            res.status(200).send({ positions: data[0], studios: data[1] });
        });
    });

    app.post('/add_employee', (req, res) => {
        let data = req.body;
        let currentEmployeeId = data.id = uniqid()
        db.query(`
            INSERT INTO 
                staff (id, name, position, rate, studio_id)
            VALUES 
                ('${currentEmployeeId}', '${data.name}', '${data.position}', '${data.rate}', '${data.studio_id}')`,
        (err, rows, fields) => {
            if (err) res.status(500).send({ error: err.message });
        });

        db.query(`
            SELECT 
                name AS studio_name
            FROM 
                studios
            WHERE 
                id='${data.studio_id}'`,
            (err, rows, fields) => {
                if (err) res.status(500).send({ error: err.message });
                data.studio_name = rows[0].studio_name;
                res.send(data);
            });

        db.query(`SELECT staff_id FROM studios WHERE id='${data.studio_id}'`, (err, rows, fields) => {
            if (err) res.status(500).send({ error: err.message });

            let staffIdList;
            if (!rows[0].staff_id) {
                staffIdList = [];
            } else {
                staffIdList = JSON.parse(rows[0].staff_id);
            }

            staffIdList.push(currentEmployeeId);

            db.query(`UPDATE studios SET staff_id = '${JSON.stringify(staffIdList)}' WHERE id='${data.studio_id}'`, (err, rows, fields) => {
                if (err) res.status(500).send({ error: err.message });
            });
        });
    });

    app.post('/remove_employee', (req, res) => {
        let id = req.body.id;
        console.log(id);
        db.query(`
            DELETE FROM staff WHERE id = '${id}'`,
            (err, rows) => {
                if (err) res.status(500).send({ error: err.message });
            });
    });

    app.get('/staff', (req, res) => {
        let data = req.query;
        (typeof data.filter == 'string') && (data.filter = JSON.parse(data.filter));
        (typeof data.sort == 'string') && (data.sort = JSON.parse(data.sort));
        removeEmptyProps(data, 'filter');

        let queryCode = `
        SELECT 
            staff.id, staff.name, staff.rate, staff.position, studios.name AS studio_name
        FROM 
            staff 
        LEFT JOIN 
            studios
        ON 
            staff.studio_id=studios.id
        `;

        // set filter
        if (data.filter) {
            let filterData = data.filter;
            let flterKeys = Object.keys(filterData);
            let filterLength = flterKeys.length;

            queryCode += `WHERE`;
            flterKeys.forEach((key, index) => {
                switch (key) {
                    case 'studio_name':
                        queryCode += ` studios.name LIKE '%${data.filter[key]}%'`;
                        break;

                    default:
                        queryCode += ` staff.${key} LIKE '%${data.filter[key]}%'`;
                        break;
                }
                (index + 1 !== filterLength) && (queryCode += ' AND');
            });
        }


        removeEmptyProps(data, 'sort');
        //set order
        if (data.sort) {
            let sortData = data.sort;
            let sortKey = Object.keys(sortData)[0];
            let desc = (sortData[sortKey] === 'desc') ? ' DESC' : '';

            switch (sortKey) {
                case 'name':
                    queryCode += ` ORDER BY staff.name`;
                    break;
                case 'position':
                    queryCode += ` ORDER BY staff.position`;
                    break;
                case 'rate':
                    queryCode += ` ORDER BY staff.rate`;
                    break;
                case 'studio_name':
                    queryCode += ` ORDER BY studios.name`;
                    break;
                default:
                    break;
            }
            queryCode += desc;
        } else {
            queryCode += ` 
            ORDER BY
                staff.name`;
        }

        // set limit
        queryCode += `
        LIMIT 
            ${data.rows ? data.rows : 0}, 20;`;


        db.query(queryCode, (err, rows) => {
            if (err) res.status(500).send({ error: err.message });
            res.status(200).send(rows);
        });
    });

    app.get('/get_studios', (req, res) => {
        let queryCode = `
        SELECT 
            id, name AS value
        FROM
            studios
        `;
        db.query(queryCode, (err, rows) => {
            if (err) res.status(500).send({ error: err.message });
            res.status(200).send(rows);
        });
    });
    // ============================================
    // End Staff page queries
};

// helper functions
// ===========================================

/**
 * Removes object properties that do not contain useful information.
 * If the object becomes empty - the object itself.
 * 
 * @param {*} parObj - parent object.
 * @param {*} objKey - the key to the object, which the need to clean.
 * @returns none
 */
function removeEmptyProps(parObj, objKey) {
    let obj = parObj[objKey];
    if (!obj) {
        return;
    }

    for (let key in obj) {
        if (!obj[key]) {
            delete obj[key];
        }
    }

    if  (Object.keys(obj).length === 0) {
        delete parObj[objKey];
    }
}
// ===========================================
// end helper functions
