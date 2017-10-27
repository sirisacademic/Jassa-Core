var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggAvg = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggAvg',
    initialize: function($super, expr) {
        $super('Avg', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggAvg();
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggAvg;