var async = require('async');

function fibonacci(n, done) {
    console.log("From Fib function, start number is" + n);
    var a = 1,
        b = 0,
        temp;
    //async while loop
    async.whilst(
        function () {
            return n >= 0;
        },
        function (callback) {
            console.log("Runing number :" + b);
            //n++;
            temp = a;
            a = a + b;
            b = temp;
            n--;
            // If you don't do that and there are many loops without any real async function call or if you do not wait for the callback, 
            // your RangeError: Maximum call stack size exceeded will be inevitable.
            setTimeout(function() {
                callback(null, b);
            }, 1000);
        },
        function (err, n) {
            if (err) {
                console.log("Error", err.message);
            } else {
                console.log("Number is :" + n);
                done();
            }
        });

}
//fibonacci = async.memoize(fibonacci);

module.exports = {
    fibonacci: fibonacci
};