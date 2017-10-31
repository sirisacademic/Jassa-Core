var Class = require('../../ext/Class');

// constructor
var AggregatorSpecification = Class.create({
    classLabel: 'jassa.sparql.AggregatorSpecification',
    initialize: function(varName, isDistinct, aggregationType, aggregationNameAs) {
        this.varName = varName;
        this.isDistinct = isDistinct;
        this.aggregationType = aggregationType;
        this.aggregationNameAs = aggregationNameAs;
    },


    getAggregationNameAs : function() {
        return this.aggregationNameAs?   this.aggregationNameAs : (this.aggregationType + '_' + this.varName);
    },
    
    getVarName : function() {
        return this.varName;
    },

    getIsDistinct : function() {
        return this.isDistinct;        
    },

    getAggregationType : function() {
        return this.getAggregationType;
    }
});

module.exports = AggregatorSpecification;