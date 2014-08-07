var SparqlServiceBaseString = require('./sparql-service-base-string');
var RequestCache = require('../request-cache');
var QueryExecutionCache = require('../query-execution').Cache;

/**
 * Result Cache stores result sets - this is an instance of a class
 *
 * Execution Cache holds all running queries' promises - this is just an associative array - i.e. {}
 * Once the promises are resolved, the corresponding entries are removed from the execution cache
 *
 * TODO Its not really a cache but more a registry
 *
 */
var SparqlServiceCache = function(queryExecutionFactory, resultCache, executionCache) {
    SparqlServiceBaseString.call(this);

    this.initialize(queryExecutionFactory, resultCache, executionCache);
};
// inherit
SparqlServiceCache.prototype = Object.create(SparqlServiceBaseString.prototype);
// hand back the constructor
SparqlServiceCache.prototype.constructor = SparqlServiceCache;



SparqlServiceCache.prototype.initialize = function(queryExecutionFactory, resultCache, executionCache) {
    this.qef = queryExecutionFactory;
    this.requestCache = new RequestCache();
};

SparqlServiceCache.prototype.getServiceId = function() {
    return this.qef.getServiceId();
};

SparqlServiceCache.prototype.getStateHash = function() {
    return this.qef.getStateHash();
};

SparqlServiceCache.prototype.hashCode = function() {
    return 'cached:' + this.qef.hashCode();
};

SparqlServiceCache.prototype.createQueryExecutionStr = function(queryStr) {
    var serviceId = this.qef.getServiceId();
    var stateHash = this.qef.getStateHash();

    var cacheKey = serviceId + '-' + stateHash + queryStr;

    var qe = this.qef.createQueryExecution(queryStr);

    var result = new QueryExecutionCache(qe, cacheKey, this.requestCache);

    return result;
};

module.exports = SparqlServiceCache;