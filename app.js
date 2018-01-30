'use strict';
var express = require('express');
var app = express();
var queue = require('./index');
var kue = require('kue');

// var queue = kue.createQueue();


app.use('/kue-ui', kue.app); //dashboard for active jobs

app.post('/triggerJob', function (req, res) {
    var data = {
        title: 'job ran at ' + Date.now()
    };
    var job = queue.create('test', data)
        .priority('critical') //https://github.com/Automattic/kue#job-priority
        .attempts(10)
        .backoff(true) //https://github.com/Automattic/kue#failure-attempts
        .removeOnComplete(false) //
        .save(function (err) {
            if (!err) {
                console.log(job.id);
            } else {
                console.log(err.message);
            }
        });
    res.send(200);
});

app.get('/fib/:number', function (req, res) {
    var num = req.params.number;
    var data = {
        num:num
    };
    console.log("Number is " + data);
    var job = queue.create('complex_math', num)
        .priority('critical') //https://github.com/Automattic/kue#job-priority
        .attempts(10)
        .backoff(true) //https://github.com/Automattic/kue#failure-attempts
        .removeOnComplete(false) //
        .save(function (err) {
            if (!err) {
                console.log(job.id);
            } else {
                console.log(err.message);
            }
        });
    res.json({
        "message": "Success"
    });
});


app.listen(3000);