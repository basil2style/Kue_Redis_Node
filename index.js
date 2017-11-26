'use strict';
var kue = require('kue');
var redisConfig = require('./redisConfig');
//For production
//var queue = kue.createQueue(redisConfig);
var queue = kue.createQueue();
var express = require('express');
var app = express();

//Kue is not atomic on job state changes, so anything causing redis connection to be intrupted
// causes inconsistencies with job indexes on redis
queue.watchStuckJobs(6000);

queue.on('ready', () => {
    // If you need to
    console.info('Queue is ready!');
});

queue.on('error', (err) => {
    // handle connection errors here
    console.error('There was an error in the main queue!');
    console.error(err);
    console.error(err.stack);
});


queue.process('test', function (job, done) {
    console.log('job data', job.data);
    console.log('completed the job');
    done();
})

app.use('/kue-ui', kue.app); //dashboard for active jobs

app.post('/triggerJob', function (req, res) {
    var data = {
        title: 'job ran at ' + Date.now()
    };
    var job = queue.create('test', data)
        .priority('critical')      //https://github.com/Automattic/kue#job-priority
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

app.listen(3000);