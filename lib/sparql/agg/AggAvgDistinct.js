var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggAvgDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggAvgDistinct',
    initialize: function($super, expr) {
        $super('Avg', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggAvgDistinct(this.expr);
    }
});

module.exports = AggAvgDistinct;