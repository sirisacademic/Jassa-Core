var GenSym = require('./gen-sym');
var GeneratorBlacklist = require('./generator-blacklist');
var VarGenerator = require('./var-generator');
var NodeFactory = require('../rdf/node-factory');

var VarUtils = {
    /**
     * Convert an array of variable names to variable objects
     * 
     */
    createVars: function(varNames) {
        var result = varNames.map(function(varName) {
            return NodeFactory.createVar(varName);
        });

        return result;
    },
    
    
    /**
     * Convert an array of variable objects into an array of variable names
     * 
     * 
     */
    getVarNames: function(vars) {
        var result = vars.map(function(v) {
            return v.getName();
        });
        
        return result;
    },
    
    /**
     * Create a generator which yields fresh variables that is not contained in the array 'vars'.
     * The new var name will have the given prefix
     * 
     */
    createVarGen: function(prefix, excludeVars) {
        if(!prefix) {
            prefix = 'v';
        }
        
        var excludeVarNames = this.getVarNames(excludeVars);
        var generator = GenSym.create(prefix);
        var genVarName = new GeneratorBlacklist(generator, excludeVarNames);

        var result = new VarGenerator(genVarName);
        
        return result;
    }
};

module.exports = VarUtils;