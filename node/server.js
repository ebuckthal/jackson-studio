var express = require('express');
var redis = require('redis');
var async = require('async');
var db = redis.createClient();
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());

db.flushdb();

app
.get('/comments', function(req, res) {

   var ret = [];

   db.smembers('comments', function(err, replies) {

      async.each(replies, function(reply, callback) {

         db.hgetall('cid:'+reply, function(err, obj) {
            ret.push(obj);
            callback();
         });

      }, function(err) {
         if(err) return next();
         
         console.log('fetched');
         console.log(ret);

         res.json(ret);
      });
   });
})
.post('/comments', function(req, res, next) {

   if(!(req.body.time && req.body.text && req.body.lat && req.body.lon)) {
      return next();
   }

   db.incr('global:cidNext', function(err, reply) {
      if(err) return next();


      db.hmset('cid:'+reply, 
         'text', req.body.text, 
         'time', req.body.time, 
         'lat', req.body.lat, 
         'lon', req.body.lon);

      db.sadd('comments', reply);
      console.log('pushed');

      res.send(200);
   });

});

app.listen(8888);
