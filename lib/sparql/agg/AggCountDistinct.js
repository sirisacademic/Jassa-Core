var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggCountDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggCountDistinct',
    initialize: function($super, expr) {
        $super('Count', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        var subExprCopy = this.expr.copySubstitute(fnNodeMap);

        var result = new AggCountDistinct(subExprCopy);
        return result;
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggCountDistinct;