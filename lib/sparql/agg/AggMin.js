var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggMin = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMin',
    initialize: function($super, expr) {
        $super('Min', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        var subExprCopy = this.expr.copySubstitute(fnNodeMap);

        var result = new AggMin(subExprCopy);
        return result;
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggMin;