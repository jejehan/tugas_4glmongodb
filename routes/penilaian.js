var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('nilai');
    collection.find({},{},function(e,docs){
        res.render('penilaian', {
            'title':'penilaian',
            'data' : docs
        });
    });
});

router.get('/inputnilai', function(req, res) {
    res.render('inputnilai', { title: 'Input Nilai' });
});

router.post('/inputnilai', function(req, res) {
    // Set DB variable
    var db = req.db;

    // parameter value
    var kmk = req.body.kmk;
    var npm = req.body.npm;
    var kelas = req.body.kelas;
    var nilai = req.body.nilai;
    
   //select usercollection
    var collection = db.get('nilai');
    //insert to collection
    collection.insert({
        'kmk' : kmk,
        'npm' : npm,
        'kelas':kelas,
        'nilai':nilai
    }, function (err, doc) {
        if (err) {
            res.send("error database.");
        }
        else {
            res.location("/penilaian");
            res.redirect("/penilaian");
        }
    });
});

router.get('/updatenilai/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('nilai');
    collection.findOne({ _id:req.params.id}).on('success', function (doc) {
        res.render('updatenilai', {
            'title':'Update Nilai ' + doc.kmk,
            'data' : doc
        });
    });
});

router.post('/updatenilai', function(req, res) {
    // Set DB variable
    var db = req.db;

    // parameter value
    var kmk = req.body.kmk;
    var npm = req.body.npm;
    var kelas = req.body.kelas;
    var nilai = req.body.nilai;
    var id = req.body._id;
    var prevData = req.body.prevData;
    var CprevData = prevData.split('~');
    
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    
    
   //select usercollection
    var collection = db.get('nilai');
    //insert to collection
    collection.updateById(id,
    {
        $set: {
            'kmk' : kmk,
            'npm' : npm,
            'kelas':kelas,
            'nilai':nilai
        }
    },
    {upsert:true}
    , function (err, doc) {
        if (err) {
            res.send("error database.");
        }
        else {
        
            //var collection = db.get('nilai');
            //collection.findOne({ _id:req.params.id}).on('success', function (doc) {
            //    
            //});
            var dataVersion = db.get('data_version');
            dataVersion.insert({
                'document_id': id,
                'document_values': {
                    '_id':CprevData[0],
                    'kmk' : CprevData[1],
                    'npm' : CprevData[2],
                    'kelas':CprevData[3],
                    'nilai':CprevData[4]
                },
                'updated_at': new Date(),
                'ip_address': ip,
                'collection_name': "nilai",
                
            }, function (err, doc) {
                if (err) {
                    res.send("error database. insert");
                }
                else {
                   
                }
            });
        
            res.location("/penilaian");
            res.redirect("/penilaian");
        }
    });
});

router.get('/versioning/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('data_version');
    collection.find({ document_id:req.params.id}).on('success', function (doc) {
        console.log(doc)
        res.render('versioning', {
            'title':'Versioning Nilai ',
            'data' : doc
        });
    });
});

module.exports = router;
