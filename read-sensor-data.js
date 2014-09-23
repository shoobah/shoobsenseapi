var util = require('util');
var EventEmitter = require('events').EventEmitter;
var azure = require('azure-storage');

var tableSvc = azure.createTableService('sensorydata', 'vgxlMPTNh8vDGpufbFKac/JZynYRVAwmo3IvidGElyaU58h340WgpDboteAWSWXtzZLOMeDbZ0Y9FRKdJYau6w==');

function ReadSensorData() {
    EventEmitter.call(this);
}

util.inherits(ReadSensorData, EventEmitter);

function queryWithContinuation(query, cb) {
    tableSvc.queryEntities('temperature', query, null, function(error, entities, continuationToken) {
        if (continuationToken.nextPartitionKey) {
            nextPage(entities, continuationToken, cb);
        } else {
            cb(entities);
        }
    });
}

// used to recursively retrieve the results
function nextPage(entities, continuationToken, cb) {
	console.log('continuationToken', continuationToken)
    continuationToken.getNextPage(function(error, results, newContinuationToken) {
        entities = entities.concat(results);
        if (newContinuationToken.nextPartitionKey) {
            nextPage(entities, newContinuationToken, cb);
        } else {
            cb(entities);
        }
    });
}

ReadSensorData.prototype.getData = function() {
    var self = this;
    console.log('Trying to read from table store')
    var query = new azure.TableQuery().where('PartitionKey eq ?', '10-000800e45c44');
    tableSvc.queryEntities('temperature', query, null, function(error, result, response){
    	if(!error){
    		self.emit('result', result);
    	}
    	else{
    		self.emit('error',error);
    	}
    });
}

module.exports = ReadSensorData;
