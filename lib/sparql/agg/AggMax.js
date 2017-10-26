var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggMax = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMax',
    initialize: function($super, expr) {
        $super('Max', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        var subExprCopy = this.expr.copySubstitute(fnNodeMap);

        var result = new AggMax(subExprCopy);
        return result;
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggMax;