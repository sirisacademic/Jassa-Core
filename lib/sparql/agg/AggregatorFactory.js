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
        return distinct?    new AggAvgDistinct(new ExprVar(v)) : new AggAvg(new ExprVar(v));
    },

    createCount: function(distinct, v) {
        return distinct?    new AggCountDistinct(new ExprVar(v)) : new AggCount(new ExprVar(v));
    },

    createMax: function(distinct, v) {
        return distinct?    new AggMaxDistinct(new ExprVar(v)) : new AggMax(new ExprVar(v));
    },

    createMin: function(distinct, v) {
        return distinct?    new AggMinDistinct(new ExprVar(v)) : new AggMin(new ExprVar(v));
    },

    createSum: function(distinct, v) {
        return distinct?    new AggSumDistinct(new ExprVar(v)) : new AggSum(new ExprVar(v));
    }
};

module.exports = AggregatorFactory;