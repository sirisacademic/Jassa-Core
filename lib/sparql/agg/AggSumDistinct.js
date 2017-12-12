var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggSumDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggSumDistinct',
    initialize: function($super, expr) {
        $super('Sum', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggSumDistinct(this.expr);
    }
});

module.exports = AggSumDistinct;