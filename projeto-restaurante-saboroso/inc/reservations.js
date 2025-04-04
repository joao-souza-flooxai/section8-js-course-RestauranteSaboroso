const conn = require('./db');

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

    save(fields){

        let date = fields.date.split('/');

        fields.date = `${date[2]}-${date[1]}-${date[0]}`;

        return new Promise((resolve, reject) => {
            conn.query(`
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES (?, ?, ?, ?, ?)
            `, [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ], (err, results) => {

                if (err) reject(err);

                else  resolve(results);
                
            });
        });


    }

};