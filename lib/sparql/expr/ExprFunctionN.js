var Class = require('../../ext/Class');
var ExprFunctionBase = require('./ExprFunctionBase');

var ExprFunctionN = Class.create(ExprFunctionBase, {
    initialize: function($super, name, args) {
        $super(name, args);

        this.args = args;
    },

    copySubstitute: function(fnNodeMap) {
        return new ExprFunctionN(this.name, this.args);
    },

    getArgs: function() {
        return this.args;
    },
});

module.exports = ExprFunctionN;
