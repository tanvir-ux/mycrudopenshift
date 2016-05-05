#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var mongojs = require('mongojs');

var app = express();

var mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "mycrudmean";

if (typeof mongodbConnectionString == "undefined")
{
    mongodbConnectionString = "mycrudmean";
}

var db = mongojs(mongodbConnectionString, ["serviceData"]);


app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());


//----------------------------------------------------


app.get("/serviceClients", function (req, res) {

    // var svc1 = {
    //     name : "LinkedIn"
    // };

    // var svc2 = {
    //     name : "IMDB"
    // };

    // var svc3 = {
    //     name : "Google"
    // };

    // var service_Clients = [svc1, svc2, svc3];

   // res.json(service_Clients);
   // res.json([]);
   db.serviceData.find(function (err, docs) {
        res.json(docs);
    });
});

// because it is a post the request is encoded in the body of the http request
//.. and we need to extract it from the body 
app.post("/serviceClients", function (req, res) {

    var svc = req.body;
    // angular doesnot know how to parse the request from the body,   into json.

    // We can use Express to parse the body, and extract the JSON out of the body 
    console.log(svc);

    db.serviceData.insert(req.body, function (err, doc) {
        res.json(doc);
    });

}); 

app.get("/serviceClients/:id", function (req, res) {
     var anID = req.params.id;
    //console.log(anID);
    db.serviceData.findOne({_id : mongojs.ObjectId(anID)}, 
        function (err, doc ) { 
            res.json(doc );
        });

});



app.put("/serviceClients/:id", function (req, res) {

    //console.log(req.body);

    //----------------
    var aName = req.body.name;

        db.serviceData.findAndModify(
        {   // Find the object by ID
            query:
            {
                 _id : mongojs.ObjectId(req.params.id)
            },
            update:
            {   // new vals are in req.body, update it's name
                $set:{name: aName}
            },
            // single one
            new: true
        }, 
        function(err, doc, lastErrorObject)
        {   // respond with new document
            
             res.json(doc);
        
        });
    //----------------

});

app.delete("/serviceClients/:id", function (req, res) {
    var anID = req.params.id;
    //console.log(anID.str);
    db.serviceData.remove({_id : mongojs.ObjectId(anID)},
      function (err, doc){
             res.json(doc);
      });
});
//----------------------------------------------------

app.get('/env',function(req, res){

    res.json(process.env);
});


     var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
     var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ipaddress);