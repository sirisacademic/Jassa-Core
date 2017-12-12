var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggMin = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMin',
    initialize: function($super, expr) {
        $super('Min', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMin(this.expr);
    }
});

module.exports = AggMin;