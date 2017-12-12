var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggCountDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggCountDistinct',
    initialize: function($super, expr) {
        $super('Count', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggCountDistinct(this.expr);
    }
});

module.exports = AggCountDistinct;