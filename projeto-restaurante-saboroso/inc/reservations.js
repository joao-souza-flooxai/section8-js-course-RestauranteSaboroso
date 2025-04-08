const conn = require('./db');
var Pagination = require("./../inc/pagination");
module.exports = {
    render(req, res, error, success) {
        res.render('reservations', {
            title: 'Reservas - Restaurante Saboroso!',
            background: 'images/img_bg2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body, 
            error,
            success
        });
    },

    getReservations(req) {

        return new Promise((resolve, reject) => {
            
            let page = req.query.page;
            dtstart = req.query.start;
            dtend = req.query.end;
            
            if (!page) page = 1;

            let params = [];
            if (dtstart && dtend) params.push(dtstart, dtend);
            
            let pag = new Pagination(
                `SELECT SQL_CALC_FOUND_ROWS *
                FROM tb_reservations
                ${ (dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : '' }
                ORDER BY name LIMIT ?, ?`,
                params
            );
            
            pag.getPage(page).then(data => {
                resolve({
                    data,
                    links: pag.getNavigation(req.query)
                });
            }).catch(err => reject(err));
        
        });
    },

    save(fields){

        if (fields.date.indexOf('/') > -1) {

            let date = fields.date.split('/');

            fields.date = `${date[2]}-${date[1]}-${date[0]}`;
        }


        let query;
        let params = [
            fields.name,
            fields.email,
            fields.people,
            fields.date,
            fields.time
        ];

        if (parseInt(fields.id) > 0) {
            query = `
                UPDATE tb_reservations
                SET
                    name = ?,
                    email = ?,
                    people = ?,
                    date = ?,
                    time = ?
                    WHERE id = ?
            `;
            params.push(fields.id);
        } else {
            query =`INSERT INTO tb_reservations (name, email, people, date, time)
            VALUES (?, ?, ?, ?, ?)`;
        
        }


        return new Promise((resolve, reject) => {
            conn.query(query, params, (err, results) => {

                if (err) reject(err);

                else  resolve(results);
                
            });
        });


    },

    delete(id){

        return new Promise((resolve, reject) => {
       
            conn.query('DELETE FROM tb_reservations WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });

        });

    }

};