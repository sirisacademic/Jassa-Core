var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggSum = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggSum',
    initialize: function($super, expr) {
        $super('Sum', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        var subExprCopy = this.expr.copySubstitute(fnNodeMap);

        var result = new AggSum(subExprCopy);
        return result;
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggSum;