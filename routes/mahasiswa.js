var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('mhs');
    collection.find({},{},function(e,docs){
        res.render('mahasiswa', {
            'title':'mahasiswa',
            'data' : docs
        });
    });
   
});

router.get('/newmhs', function(req, res) {
    res.render('newmhs', { title: 'Add New mahasiswa' });
});

router.post('/newmhs', function(req, res) {
    // Set DB variable
    var db = req.db;

    // parameter value
    var npm = req.body.npm;
    var nama = req.body.nama;
    var kelas = req.body.kelas;
    
   //select usercollection
    var collection = db.get('mhs');
    //insert to collection
    collection.insert({
        'npm' : npm,
        'nama' : nama,
        'kelas':kelas
    }, function (err, doc) {
        if (err) {
            res.send("error database.");
        }
        else {
            res.location("/mahasiswa");
            res.redirect("/mahasiswa");
        }
    });
});

module.exports = router;
