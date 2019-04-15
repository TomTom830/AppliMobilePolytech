//datalayer
var dataLayer = require('./datalayer/dataLayer.js');
var dataUserLayer = require('./datalayer/dataUserLayer.js');
var fonction_heure = require('./heure');

//server web 
var router = require('express').Router();



router.get("/", function(req,res){
    res.sendFile(__dirname+'/users/connect.html');
});

router.get("/getListSet", function(req,res){
    dataLayer.getListSet( function(dtSet){
        res.send(dtSet);
    });
});

router.post('/creerListe', function(req, res){

    if(req.body && typeof req.body.text !='undefined' && req.body.text !=''){

        var proj = {nom_liste:req.body.text};
        dataLayer.getList(proj,function(result){
            if(result == null){

                dataLayer.insertList(proj, function(){
                    dataLayer.getListSet( function(dtSet){
                        res.send(dtSet);
                    });
                });
            }
            else{
                res.status(404).send({
                    success : false,
                    errorCode : "LIST_ALREADY_EXIST"
                });
            }
        });
    }
    else{
        res.status(404).send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }
});

//insert task
router.post("/addTask", function(req, res){
    
    console.log("text : "+req.body.text+" req.body.creat : "+req.body.creat);
    if(req.body && typeof req.body.text !='undefined' && typeof req.body.creat != 'undefined'
    && req.body.creat!='' && typeof req.body.nom_liste !='undefined' && req.body.nom_liste !=''){
     
        var task = {
            tache : req.body.text,
            auteur : req.body.creat,
            heure : fonction_heure.heure()+" "+fonction_heure.jour(),
            nom_liste : req.body.nom_liste
        };
        var obj_rech = {nom_liste: req.body.nom_liste};

        dataLayer.insertTask(task,function(){
            
            dataLayer.getTaskSet( obj_rech,function(dtSet){
                res.send(dtSet);
            });
            
        })
    }else if(req.body.nom_liste==''){
        res.status(404).send({
            success : false,
            errorCode : "NO_LIST_SELECTED"
        });
    }else if(req.body.creat==''){
        res.status(404).send({
            success : false,
            errorCode : "NOT_CONNECTED"
        });
    }
    else{
        res.status(404).send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }
});


//insert task
router.post("/Connect", function(req, res){


    if(req.body && typeof req.body.id !='undefined' && req.body.id!=''
        && typeof req.body.passwd !='undefined' && req.body.passwd!=''){


        var proj = {id:req.body.id};
        dataUserLayer.getUser(proj,function(result){
        
            if(result != null){
                if(result.pwd.localeCompare(req.body.passwd) == 0){
                res.send({
                    success : true,
                    url : "/public/index.html"
                });
                }
                else{
                    res.status(404).send({
                        success : false,
                        errorCode : "AUTH_FAIL"
                    });
                }
            }else{
                res.status(404).send({
                    success : false,
                    errorCode : "AUTH_FAIL"
                });
            }
        });
    }else{
        res.status(404).send({
            success : false,
            errorCode : "MISSING PARAM"
        });
    }
});



//get all InfosUser
router.get('/getInfos', function(req, res) {

    dataUserLayer.getInfos( function(dtSet){
        res.send(dtSet);
    });
});


router.get('/goSinscrire',function(req,res){
    res.send('/users/inscrire.html');
    
});

router.post('/addUser', function(req,res){

    if(req.body && typeof req.body.sub_id !='undefined' && typeof req.body.sub_passwd != 'undefined'){

        var proj = {id:req.body.sub_id};
        dataUserLayer.getUser(proj,function(result){
            
            if(result == null){
                var myobj = { id: req.body.sub_id, pwd: req.body.sub_passwd };
                dataUserLayer.newUser(myobj,function(){
                    res.send({
                        success : true
                    });
                });
            }
            else{
                res.status(404).send({
                    success : false,
                    errorCode : "USER_ALREADY_REGISTRED"
                });
            }
        });
    }else{
        res.status(404).send({
            success : false,
            errorCode : "MISSING PARAM"
        });
    }
})



//get all TaskSet
router.get('/getTaskSet/:name', function(req, res) {

    var obj_rech = {nom_liste:""};
    obj_rech.nom_liste = req.params.name;
    dataLayer.getTaskSet( obj_rech,function(dtSet){
        res.send(dtSet);
    });
});

router.delete('/delTask/:name/:id',function(req,res){
    var obj_rech = {nom_liste:req.params.name};
    dataLayer.deleteTask( req.params.id, function(){
        dataLayer.getTaskSet( obj_rech, function(dtSet){
            res.send(dtSet);
        });
    });
});


router.delete('/delList/:name',function(req,res){
    var myquery = { nom_liste: req.params.name };
    dataLayer.deleteList(myquery,function(){
        dataLayer.getListSet( function(dtSet){
            res.send(dtSet);
        });
    })

});

router.put('/updTask/:name/:id', function(req, res){
    var obj_rech = {nom_liste:req.params.name};
    if(req.body && typeof req.body.text !='undefined' && req.body.text !=''){
        dataLayer.updateTask(req.params.id, req.body.text,function(){
            dataLayer.getTaskSet( obj_rech,function(dtSet){
                res.send(dtSet);
            });
        });
    }
    else{
        res.status(404).send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }
});

module.exports = router;