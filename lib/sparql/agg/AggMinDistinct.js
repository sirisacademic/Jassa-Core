var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggMinDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMinDistinct',
    initialize: function($super, expr) {
        $super('Min', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMinDistinct(this.expr);
    }
});

module.exports = AggMinDistinct;