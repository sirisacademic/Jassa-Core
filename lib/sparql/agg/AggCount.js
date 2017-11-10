var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggCount = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggCount',
    initialize: function($super, expr) {
        $super('Count', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggCount(this.expr);
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggCount;