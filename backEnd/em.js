var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');

// establish environment: Red Hat or local
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost";
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || "27017";
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var myport    = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var RHLOGIN   = 'admin:bfyfuYQvsKS6';

// mongoose data model
if (mongoHost === 'localhost')
    mongoose.connect('mongodb://localhost/smartgridtools');
else
    mongoose.connect('mongodb://' + RHLOGIN + '@' + mongoHost + ':' + mongoPort + '/smartgridtools');

var Event = mongoose.model('Event', new mongoose.Schema({
    substation:String,
    feeder:String,
    type:String,
    date:String,
    time:String,
    aphase:String,
    bphase: String,
    cphase:String
}));

var User = mongoose.model('User', new mongoose.Schema({
    substation:String,
    feeder:String,
    type:String,
    date:String,
    time:String,
    aphase:String,
    bphase: String,
    cphase:String
}));

// general routing
var app = express();
app.use(cors());
var router = express.Router();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontEnd')));

router.get('/', function (req, res){
    res.json({message: 'this is the API'});
});

// event routing
router.route('/events')
    .post(function(req, res) {
        var event = new Event();

        event.substation = req.body.substation;
        event.feeder = req.body.feeder;
        event.type = req.body.type;
        event.date = req.body.date;
        event.time = req.body.time;
        event.aphase = req.body.aphase;
        event.bphase = req.body.bphase;
        event.cphase = req.body.cphase;

        event.save(function(err) {
            if (err) res.send(err);

            res.json({message: 'Event created'});
        });
    })

    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err) res.send(err);

            res.json(events);
        });
    });

router.route('/events/:id')
    .get(function(req, res) {
        Event.findById(req.params.id, function(err, event) {
            if (err) res.send(err);

            res.json(event);
        });
    })

    .put(function(req, res) {
        Event.findById(req.params.id, function(err, event) {
            if (err) res.send(err);
            event.substation = req.body.substation;
            event.feeder = req.body.feeder;
            event.type = req.body.type;
            event.date = req.body.date;
            event.time = req.body.time;
            event.aphase = req.body.aphase;
            event.bphase = req.body.bphase;
            event.cphase = req.body.cphase;

            event.save(function(err) {
                if (err) res.send(err);
                res.json({message: 'Event updated'});
            });
        });
    })

    .delete(function(req, res) {
        Event.remove({_id: req.params.id}, function(err, event) {
            if (err) res.send(err);
            res.json({message: 'Event deleted'});
        });
    });

// user routing
router.route('/users')
    .post(function(req, res) {
        var user = new User();

        user.substation = req.body.substation;
        user.feeder = req.body.feeder;
        user.type = req.body.type;
        user.date = req.body.date;
        user.time = req.body.time;
        user.aphase = req.body.aphase;
        user.bphase = req.body.bphase;
        user.cphase = req.body.cphase;

        user.save(function(err) {
            if (err) res.send(err);

            res.json({message: 'User created'});
        });
    })

    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);

            res.json(users);
        });
    });

router.route('/users/:id')
    .get(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err) res.send(err);

            res.json(user);
        });
    })

    .put(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err) res.send(err);
            user.substation = req.body.substation;
            user.feeder = req.body.feeder;
            user.type = req.body.type;
            user.date = req.body.date;
            user.time = req.body.time;
            user.aphase = req.body.aphase;
            user.bphase = req.body.bphase;
            user.cphase = req.body.cphase;

            user.save(function(err) {
                if (err) res.send(err);
                res.json({message: 'User updated'});
            });
        });
    })

    .delete(function(req, res) {
        User.remove({_id: req.params.id}, function(err, user) {
            if (err) res.send(err);
            res.json({message: 'User deleted'});
        });
    });


// end routing and start server
router.route('*').get(function(req, res){
    res.status(404).send('We do not have that page');
});

app.use('/api', router);

app.listen(myport, ipaddress, function() {
	console.log('Node/MongoDB Server (CORS) on ' + mongoHost + ':' + myport);
});