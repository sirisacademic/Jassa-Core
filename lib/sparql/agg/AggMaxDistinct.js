var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggMaxDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMaxDistinct',
    initialize: function($super, expr) {
        $super('Max', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMaxDistinct(this.expr);
    }
});

module.exports = AggMaxDistinct;