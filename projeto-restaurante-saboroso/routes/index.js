var con = require("./../inc/db");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
   con.query(
    `SELECT * FROM tb_menus ORDER BY title `
   ,(err, results)=>{

      if(err){
        console.log(err);
        return res.status(500).send("Erro no banco de dados.");
      }

      res.render('index', {
        title: 'Restaurante Saboroso!',
        menus: results

      });

   });
  
});


router.get('/contacts', function(req, res, next) {
    res.render('contacts',{
      title: 'Contato - Restaurante Saboroso!',
      background: 'images/img_bg_3.jpg',
      h1: 'Diga oi!'
    });
});

router.get('/menus', function(req, res, next) {
    res.render('menus',{
      title: 'Menus - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'Saboreie nosso menu!'
    });
});

router.get('/reservations', function(req, res, next) {
    res.render('reservations',{
      title: 'Reservations - Restaurante Saboroso!',
      background: 'images/img_bg_2.jpg',
      h1: 'Reserve uma Mesa!'
    });
});

router.get('/services', function(req, res, next) {
    res.render('services',{
      title: 'Services - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'É um prazer poder servir!'
    });
});



module.exports = router;
