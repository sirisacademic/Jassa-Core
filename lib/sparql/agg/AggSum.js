var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggSum = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggSum',
    initialize: function($super, expr) {
        $super('Sum', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggSum();
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggSum;