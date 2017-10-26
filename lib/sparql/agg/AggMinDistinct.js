var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggMinDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMin',
    initialize: function($super, expr) {
        $super('Min', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        var subExprCopy = this.expr.copySubstitute(fnNodeMap);

        var result = new AggMinDistinct(subExprCopy);
        return result;
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggMinDistinct;