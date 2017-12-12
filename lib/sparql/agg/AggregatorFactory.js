var Class = require('../../ext/Class');
var AggAvg = require('./AggAvg');
var AggAvgDistinct = require('./AggAvgDistinct');
var AggCount = require('./AggCount');
var AggCountDistinct = require('./AggCountDistinct');
var AggMax = require('./AggMax');
var AggMaxDistinct = require('./AggMaxDistinct');
var AggMin = require('./AggMin');
var AggMinDistinct = require('./AggMinDistinct');
var AggMin = require('./AggMin');
var AggMinDistinct = require('./AggMinDistinct');
var AggSum = require('./AggSum');
var AggSumDistinct = require('./AggSumDistinct');
var ExprVar = require('../expr/ExprVar');

// constructor
var AggregatorFactory = {
    createAvg: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggAvgDistinct(expr) : new AggAvg(expr);
    },

    createCount: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggCountDistinct(expr) : new AggCount(expr);
    },

    createMax: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggMaxDistinct(expr) : new AggMax(expr);
    },

    createMin: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggMinDistinct(expr) : new AggMin(expr);
    },

    createSum: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggSumDistinct(expr) : new AggSum(expr);
    }
};

module.exports = AggregatorFactory;