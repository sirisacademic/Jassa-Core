var Class = require('../../ext/Class');
var AggregatorBase = require('./AggregatorBase');

var AggGroup_Concat = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggGroup_Concat',
    initialize: function($super, expr, separator) {
        $super('Group_Concat', false, expr);
        this.separator = separator || ', ';
    },

    copySubstitute: function(fnNodeMap) {
        return new AggGroup_Concat(this.expr, this.separator);
    },

    toString : function() {
        return this.name +
            '(' + 
            ((this.isDistinct)?  'Distinct ' : '') + 
            ((this.expr)?        this.expr.toString() : '*') +
            '; Separator="' + this.separator + '"' + 
            ')';
    }
});

module.exports = AggGroup_Concat;