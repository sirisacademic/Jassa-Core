var Class = require('../../ext/Class');

var ConceptUtils = require('../../sparql/ConceptUtils');
var FacetNode = require('../FacetNode');
var FacetConceptSupplierExact = require('../facet_concept_supplier/FacetConceptSupplierExact');
var FacetConceptSupplierMeta = require('../facet_concept_supplier/FacetConceptSupplierMeta');

var FacetServiceSparql = require('../facet_service/FacetServiceSparql');
var FacetServiceTransformConcept = require('../facet_service/FacetServiceTransformConcept');
var FacetServiceClientIndex = require('../facet_service/FacetServiceClientIndex');
var FacetServiceLookup = require('../facet_service/FacetServiceLookup');

var LabelUtils = require('../../sparql/LabelUtils');
var KeywordSearchUtils = require('../../sparql/search/KeywordSearchUtils');


var FacetConfig = require('../FacetConfig');
var ConstraintManager = require('../ConstraintManager');


var BestLabelConfig = require('../../sparql/BestLabelConfig');
var MappedConceptUtils = require('../../sponate/MappedConceptUtils');
var LookupServiceUtils = require('../../sponate/LookupServiceUtils');

var LookupServiceMulti = require('../../service/lookup_service/LookupServiceMulti');
var LookupServiceKeyMap = require('../../service/lookup_service/LookupServiceKeyMap');

var FacetUtils = require('../FacetUtils');
var LookupServiceFacetCount = require('../lookup_service/LookupServiceFacetCount');
var LookupServiceFacetPreCount = require('../lookup_service/LookupServiceFacetPreCount');
var LookupServiceFacetExactCount = require('../lookup_service/LookupServiceFacetExactCount');


var FacetSystemSparql = Class.create({
    initialize: function(sparqlService, baseConcept, rootFacetNode) {
        this.sparqlService = sparqlService;
        this.baseConcept = baseConcept || ConceptUtils.createSubjectConcept();
        this.rootFacetNode = rootFacetNode || FacetNode.createRoot(this.baseConcept.getVar());


        this.lookupServiceNodeLabels = null; // TODO init

        //this.baseConcept = baseConcept || ConceptUtils.createSubjectConcept();
        //this.rootFacetNode =

    },

    createFacetService: function(constraintManager) {
        var isSubjectConcept = this.baseConcept.isSubjectConcept();
        var isUnconstrained = constraintManager.getConstraints().length === 0;

        // TODO Maybe the facet config itself should be provided as the argument
        var facetConfig = new FacetConfig(this.baseConcept, this.rootFacetNode, constraintManager);

        var facetConceptSupplierExact = new FacetConceptSupplierExact(facetConfig);
        var facetConceptSupplierMeta = new FacetConceptSupplierMeta(facetConceptSupplierExact);

        if(isSubjectConcept && isUnconstrained) {
            // TODO: We could do a pre-check about whether the set of declared properties is empty

            // We could use the declared set of properties
            console.log('Detected that declared properties could be used');
            //facetConceptSupplierMeta.getPathHeadToConcept().put(new PathHead(), ConceptUtils.listDeclaredProperties);
        }

        var bestLabelConfig = new BestLabelConfig();
        // Label service init
        var mappedConcept = MappedConceptUtils.createMappedConceptBestLabel(bestLabelConfig);
        var lookupServiceNodeLabels = LookupServiceUtils.createLookupServiceMappedConcept(this.sparqlService, mappedConcept);



        // TODO: Make the search function configurable
        var fnTransformSearch = function(searchString) {
            var r;
            if(searchString) {

                var relation = LabelUtils.createRelationPrefLabels(bestLabelConfig);
                r = KeywordSearchUtils.createConceptRegex(relation, searchString);
                //var result = sparql.KeywordSearchUtils.createConceptBifContains(relation, searchString);
            } else {
                r = null;
            }

            return r;
        };

        var result = new FacetServiceSparql(this.sparqlService, facetConceptSupplierMeta);
        result = new FacetServiceTransformConcept(result, fnTransformSearch);

        // NOTE: The client index won't work if there are too many properties - such as on freebase
        result = new FacetServiceClientIndex(result, lookupServiceNodeLabels);


        // Up to this point, the facet service will only create list services
        // that return lists of properties
        // Now we decorate them to include label information and counts

        var self = this;
        var createLookupService = function(pathHead) {
            var facetRelationIndex = FacetUtils.createFacetRelationIndex(facetConfig, pathHead);
            var lsPreCount = new LookupServiceFacetPreCount(self.sparqlService, facetRelationIndex);
            var lsExactCount = new LookupServiceFacetExactCount(self.sparqlService, facetRelationIndex);
            var lsCount = new LookupServiceFacetCount(lsPreCount, lsExactCount);


            var infoLs = new LookupServiceMulti({
                id: new LookupServiceKeyMap(), // identity mapping
                countInfo: lsCount,
                labelInfo: lookupServiceNodeLabels
            });

            return infoLs;
        };


        result = new FacetServiceLookup(result, createLookupService);

        /* Counting */

        /*
        var facetRelationIndex = facete.FacetUtils.createFacetRelationIndex(facetConfig, pathHead);
        var lsPreCount = new facete.LookupServiceFacetPreCount(this.sparqlService, facetRelationIndex);
        var lsExactCount = new facete.LookupServiceFacetExactCount(this.sparqlService, facetRelationIndex);
        var ls = new facete.LookupServiceFacetCount(lsPreCount, lsExactCount);
        */


        //ListServiceConceptKeyLookup(ls,)


        // We still need to append information such as labels, counts and tags to the facets





        //var path = facete.Path.parse('http://fp7-pp.publicdata.eu/ontology/funding');
        //var pathHead = new facete.PathHead(facete.Path.parse(''), false);
        //var listService = facetService.createListService(pathHead);


        return result;
    }
});

module.exports = FacetSystemSparql;