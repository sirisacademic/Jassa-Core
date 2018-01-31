var Class = require('../../ext/Class');
var Element = require('./Element');

var ElementHaving = Class.create(Element, {
    classLabel: 'jassa.sparql.ElementHaving',
    initialize: function(element) {
        this.element = element;

        // element should be an ElementFilter instance
        if (!(element instanceof Element)) {
            throw new Error(this.classLabel + ' only accepts an instance of Element as the argument');
        }

    },

    getArgs: function() {
        return [this.element];
    },

    copy: function() {
        var result = new ElementHaving(this.element);
        return result;
    },

    getVarsMentioned: function() {
        return this.element.getVarsMentioned();
    },

    copySubstitute: function(fnNodeMap) {
        return new ElementHaving(this.element.copySubstitute(fnNodeMap));
    },

    flatten: function() {
        return this;
    },

    toString: function() {
        return 'Having (' + this.element.expr + ')';
    },
});

module.exports = ElementHaving;