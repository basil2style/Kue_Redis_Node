'use strict';
var kue = require('kue');
var queue = kue.createQueue();
var express = require('express');
var app = express();


queue.process('test', function (job, done) {
    console.log('job data', job.data);
    console.log('completed the job');
    done();
})

app.use('/kue-ui', kue.app);

app.post('/triggerJob', function (req, res) {
    var job = queue.create('test', {
        title: 'job ran at ' + Date.now()
    }).save(function (err) {
        if (!err) {
            console.log(job.id);
        } else {
            console.log(err.message);
        }
    });

    res.send(200);
});

app.listen(3000);