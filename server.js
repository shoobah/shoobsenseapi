var Percolator = require('percolator').Percolator;

var server = new Percolator();
server.route('/hello', {  GET : function(req, res){
                              res.object({message : 'Hello World!'}).send();
                            }});
server.listen(function(err){
  console.log('server is listening on port ', server.port);
});