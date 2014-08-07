/**
 * A data service only provides a single method for retrieving data based on some 'key' (thing)
 * The key can be an arbitrary object that identifies a collection (e.g. a tag), a sparql concept, etc...
 */
var DataService = function() {};

DataService.prototype.fetchData = function(thing) {
    console.log('Not implemented');
	throw 'Not implemented';
};

module.exports = DataService;