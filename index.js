'use strict';
var kue = require('kue');
var redisConfig = require('./redisConfig');
var math_function = require('./math');

//For production
//var queue = kue.createQueue(redisConfig);
var queue = kue.createQueue();
// var express = require('express');
// var app = express();

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

queue.process('complex_math', function (job, done) {
    if (job) {
        console.log("From job process, job number is ");
        console.log(job.data);
        math_function.fibonacci(job.data, done);
    }
});

module.exports = queue;