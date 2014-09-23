var Percolator = require('percolator').Percolator;
var _ = require('underscore-node');
var ReadSensorData = require('./read-sensor-data.js');
var rs = new ReadSensorData();

var server = new Percolator();
server.route('/hello', {
    GET: function(req, res) {
        res.object({
            message: 'Hello World!'
        }).send();
    }
});



server.route('/data', {
    GET: function(req, res) {
        console.log('Trying to read data from emitter');
        rs.getData();
        rs.on('result', function(result) {
        	var stuff=[];
        	result.entries.forEach(function(item){
        		stuff.push({
        			time: item.time._,
        			temp: item.temp._
        		});
        	});
            res.object(_.sortBy(stuff, 'time')).send();
        });
        rs.on('error', function(error) {
            console.log('Poop!', error);
            res.object(error).send();
        })
    }
});

server.listen(function(err) {
    console.log('server is listening on port ', server.port);
});
