var express = require('express');
var router = express.Router();
var bcrypt  = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

/* GET users listing. */
router.get('/', function(req, res) {
  var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('users', {
            'title':'User',
            'userlist' : docs
        });
    });
   
});

router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

router.post('/adduser', function(req, res) {

    // Set DB variable
    var db = req.db;

    // parameter value
    var npm = req.body.username;
    var nama = req.body.nama;
    var password = req.body.password;
    var confirmpass = req.body.confirmpass;
    
    var hash = bcrypt.hashSync(password, salt);
    console.log(hash)
    
   //select usercollection
    var collection = db.get('users');
    //insert to collection
    collection.insert({
        "username" : username,
        "nama" : nama,
        "password" : hash,
    }, function (err, doc) {
        if (err) {
            res.send("error database.");
        }
        else {
            res.location("/users");
            res.redirect("/users");
        }
    });
});

router.get('/profile/:id',function(req,res){
    var db = req.db;
    var collection = db.get('users');

    collection.findOne({ _id:req.params.id}).on('success', function (doc) {
        console.log(doc)
        res.render('profile', {
            'title':'Profile',
            'userlist' : doc
        });
    });
   
});

router.post('/edituser', function(req, res) {
    // Set DB variable
    var db = req.db;

    // parameter value
    var username = req.body.username;
    var nama = req.body.nama;
    var id = req.body._id;
    
   //select usercollection
    var collection = db.get('users');
    //insert to collection
    collection.updateById(id,
    {
        $set: {
            "nama":nama
        }
    },
    {upsert:true}
    , function (err, doc) {
        if (err) {
            res.send("error database.");
        }
        else {
            res.location("profile/"+id);
            res.redirect("profile/"+id);
        }
    });
});

router.get('/edituser/:id',function(req,res){
    var db = req.db;
    var collection = db.get('users');

    collection.findOne({ _id:req.params.id}).on('success', function (doc) {
        console.log(doc)
        res.render('edituser', {
            'title':'Edit User' + doc.username,
            'userlist' : doc
        });
    });
   
});
module.exports = router;
