var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggAvgDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggAvgDistinct',
    initialize: function($super, expr) {
        $super('Avg', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        var subExprCopy = this.expr.copySubstitute(fnNodeMap);

        var result = new AggAvgDistinct(subExprCopy);
        return result;
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    }

});

module.exports = AggAvgDistinct;