var Class = require('../../ext/Class');
var ExprFunction2 = require('./ExprFunction2');
var ExprHelpers = require('../ExprHelpers');

var E_LessThan = Class.create(ExprFunction2, {
    initialize: function($super, left, right) {
        $super('<', left, right);
    },

    copySubstitute: function(fnNodeMap) {
        return new E_LessThan(this.left, this.right);
    },

    copy: function(args) {
        return ExprHelpers.newBinaryExpr(E_LessThan, args);
    },

    toString: function() {
        return '(' + this.left + ' < ' + this.right + ')';
    },
});

module.exports = E_LessThan;
