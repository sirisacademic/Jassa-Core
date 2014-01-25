    var ns = {};

    
    
    ns.SparqlServiceFactoryDefault = Class.create({
        initialize: function() {
            this.hashToCache = {};
        },
        
        createSparqlService: function(sparqlServiceIri, defaultGraphIris) {
            var tmp = new service.SparqlServiceHttp(sparqlServiceIri, defaultGraphIris);
            tmp = new service.SparqlServiceCache(tmp);
            
            var hash = tmp.getStateHash();
            
            var cacheEntry = this.hashToCache[hash];
            
            var result;
            if(cacheEntry) {
                result = cacheEntry;                
            } else {
                this.hashToCache[hash] = tmp;
                result = tmp;
            }
            
            return result;
        }
    });

    
    ns.GeoMapFactory = Class.create({
        initialize: function(baseSponateView, bboxExprFactory) {
            //this.template = template;
            //this.baseElement = baseElement;
            this.baseSponateView = baseSponateView;
            this.bboxExprFactory = bboxExprFactory;
        },

        createMapForGlobal: function() {
            var result = this.createMapForBounds(null);
            return result;
        },
        
        createMapForBounds: function(bounds) {
            var baseSponateView = this.baseSponateView;
            var bboxExprFactory = this.bboxExprFactory;
            
            var pattern = baseSponateView.getPattern();
            var baseElementFactory = baseSponateView.getElementFactory();
            
            var baseElement = baseElementFactory.createElement();
            var element = baseElement;         
            if(bounds) {
                var filterExpr = bboxExprFactory.createExpr(bounds);
                var filterElement = new sparql.ElementFilter(filterExpr);
               
                element = new sparql.ElementGroup([baseElement, filterElement]);
            }
               
            var result = new sponate.Mapping(null, pattern, new sparql.ElementFactoryConst(element));
            return result;
        }
    });
    
    ns.FacetConfig = Class.create({
        initialize: function(baseConcept, rootFacetNode, constraintManager) {
            this.baseConcept = baseConcept;
            this.rootFacetNode = rootFacetNode;
            this.constraintManager = constraintManager;
        },
        
        getBaseConcept: function() {
            return this.baseConcept;
        },
        
        setBaseConcept: function(baseConcept) {
            this.baseConcept = baseConcept;
        },
        
        getRootFacetNode: function() {
            return this.rootFacetNode;
        },
        
        setRootFacetNode: function(rootFacetNode) {
            this.rootFacetNode = rootFacetNode;
        },
        
        getConstraintManager: function() {
            return this.constraintManager;
        },
        
        setConstraintManager: function(constraintManager) {
            this.constraintManager = constraintManager;
        }
        
        // The following attributes are pretty much UI dependent
        // facetStateProvider, pathToFilterString, expansionSet
    });

    ns.FacetConfig.createDefaultFacetConfig = function() {
        var baseVar = rdf.NodeFactory.createVar("s");
        var baseConcept = facete.ConceptUtils.createSubjectConcept(baseVar);
        //var sparqlStr = sparql.SparqlString.create("?s a ?t");
        //var baseConcept = new facete.Concept(new sparql.ElementString(sparqlStr));
        var rootFacetNode = facete.FacetNode.createRoot(baseVar);

        var constraintManager = new facete.ConstraintManager();
        
        var result = new ns.FacetConfig(baseConcept, rootFacetNode, constraintManager);
        return result;
    };
    
    ns.FacetTreeConfig = Class.create({
        initialize: function(facetConfig, labelMap, expansionSet, facetStateProvider, pathToFilterString) {
            this.facetConfig = facetConfig || ns.FacetConfig.createDefaultFacetConfig();
            this.labelMap = labelMap; // TODO Use some default
            this.expansionSet = expansionSet || new util.HashSet();
            this.facetStateProvider = facetStateProvider || new facete.FacetStateProviderImpl(10);
            this.pathToFilterString = pathToFilterString || new util.HashMap();
        },
        
        getFacetConfig: function() {
            return this.facetConfig;
        },
        
        getLabelMap: function() {
            return this.labelMap;
        },
        
        getExpansionSet: function() {
            return this.expansionSet;
        },
        
        getFacetStateProvider: function() {
            return this.facetStateProvider;
        },
        
        getPathToFilterString: function() {
            return this.pathToFilterString;
        }
    });
    
    
    ns.FaceteUtils = {
        createFacetConceptGenerator: function(facetConfig) {
            var baseConcept = facetConfig.getBaseConcept();
            var rootFacetNode = facetConfig.getRootFacetNode();
            var constraintManager = facetConfig.getConstraintManager();
            
            var result = this.createFacetConceptGenerator2(baseConcept, rootFacetNode, constraintManager);
            return result;
        },
        
        createFacetConceptGenerator2: function(baseConcept, rootFacetNode, constraintManager) {
            // Based on above objects, create a provider for the configuration
            // which the facet service can build upon
            var facetConfigProvider = new facete.FacetGeneratorConfigProviderIndirect(
                new facete.ConceptFactoryConst(baseConcept),
                new facete.FacetNodeFactoryConst(rootFacetNode),
                constraintManager
            );
            
            var fcgf = new facete.FacetConceptGeneratorFactoryImpl(facetConfigProvider);
            var result = fcgf.createFacetConceptGenerator();
            
            return result;
        },
        
//        createFacetService: function(facetConfig) {
//            var result = this.createFacetService2(facetConfig.);
//        },
//        
        createFacetService: function(sparqlService, facetConfig, labelMap) {
            var facetConceptGenerator = this.createFacetConceptGenerator(facetConfig);

            var facetService = new facete.FacetServiceImpl(sparqlService, facetConceptGenerator, labelMap);

            return facetService;
        },
        
        
        
        createFacetTreeService: function(sparqlService, facetTreeConfig, labelMap) {


            var facetService = this.createFacetService(sparqlService, facetTreeConfig.getFacetConfig(), labelMap);
            
            var expansionSet = facetTreeConfig.getExpansionSet();
            var facetStateProvider = facetTreeConfig.getFacetStateProvider();
            var pathToFilterString = facetTreeConfig.getPathToFilterString();
            

            var facetTreeService = new facete.FacetTreeServiceImpl(facetService, expansionSet, facetStateProvider, pathToFilterString);

            return facetTreeService;

            //var constraintTaggerFactory = new facete.ConstraintTaggerFactory(constraintManager);       
            
            
            //var faceteConceptFactory = new ns.ConceptFactoryFacetService(facetService);
            
            
            //var result = new ns.ConceptSpace(facetTreeService);
            
            //return result;            
        },
        
        createFacetTreeTagger: function(pathToFilterString) {
            var tableMod = new facete.FaceteTableMod(); 
            tableMod.togglePath(new facete.Path());
            
            
            var pathTagger = new ns.ItemTaggerManager();
            pathTagger.getTaggerMap()['table'] = new ns.ItemTaggerTablePath(tableMod);
            pathTagger.getTaggerMap()['filter'] = new ns.ItemTaggerFilterString(pathToFilterString);
            var facetTreeTagger = new ns.FacetTreeTagger(pathTagger);
            
            return facetTreeTagger;
        }

    };
    
    

    ns.flattenTree = function(node, childPropertyName, result) {
        if(result == null) {
            result = [];
        }
        
        if(node) {
            result.push(node);
        }
        
        var children = node[childPropertyName];
        if(children) {
            _(children).each(function(childNode) {
                ns.flattenTree(childNode, childPropertyName, result);
            });
        }
        
        return result;
    };

    
    ns.ConceptFactoryFacetService = Class.create(facete.ConceptFactory, {
        initialize: function(facetService) {
            this.facetService = facetService;
        },
        
        createConcept: function() {
            var result = this.facetService.createConceptFacetValues(new facete.Path());
            return result;
        }
    });
    
    
    ns.ViewStateCtrlOpenLayers = Class.create({
        initialize: function(mapWidget) {
            this.mapWidget = mapWidget;
            
            this.oldViewState = null;
        },
        
        showNode: function(node) {
            var mapWidget = this.mapWidget;
            
            if(!node.isLoaded) {
                //console.log('box: ' + node.getBounds());
                mapWidget.addBox('' + node.getBounds(), node.getBounds());
            }
            
            var data = node.data || {};
            var docs = data.docs || [];

            _(docs).each(function(doc) {
                mapWidget.addWkt(doc.id, doc.wkt);
            });                                 
        },
        
        hideNode: function(node) {
            var mapWidget = this.mapWidget;
            
            var data = node.data || {};
            var docs = data.docs || [];

            //console.log('box: ' + node.getBounds());
            mapWidget.removeBox('' + node.getBounds());//, node.getBounds());
            
            _(docs).each(function(doc) {
                mapWidget.removeItem(doc.id);
            });
        },

        
        updateView: function(newViewState) {
            var mapWidget = this.mapWidget;
            var oldViewState = this.oldViewState;
            
            var diff = geo.ViewStateUtils.diffViewStates(newViewState, oldViewState);
            
            console.log('ViewStateDiff: ', diff);
            
            
            
            mapWidget.clearItems();
            
            var self = this;
            //_(diff.removed).each(this.hideNode);
            _(diff.retained).each(function(node) { self.showNode(node); });
            _(diff.added).each(function(node) { self.showNode(node); });
            
            
            
            this.oldViewState = newViewState;
        }
    });
    
    
    /**
     * Interface for retrieval of tags for a given object
     *
     */
    ns.ItemTagger = Class.create({
        createTags: function(item) {
            throw 'Not overidden';
        } 
    });
    
    ns.ItemTaggerTablePath = Class.create(ns.ItemTagger, {
        initialize: function(tableMod) {
            this.tableMod = tableMod;
        },
        
        createTags: function(path) {
            var paths = this.tableMod.getPaths();
            var isContained = paths.contains(path);
            
            var result = { isContained: isContained };
            //console.log('table: ' + path, isContained);
            return result;
        }
    });
    
    
    
    /**
     * Returns all paths and their contexts in an appContext
     * 
     */
    ns.AppContextUtils = { // These are domain specific utils - not generic ones - for the app context
        getMapLinks: function(appContext) {
            //console.log('inside getMapLinks()');
            
            var workSpaces = appContext.getWorkSpaces();
            var conceptSpaces = _(workSpaces).chain().map(function(workSpace) {
                return workSpace.getConceptSpaces();
            }).flatten().value();

            var result = _(conceptSpaces).chain()
                .map(function(conceptSpace) {

                    var data = conceptSpace.getData();

                    var activeMapLinkPaths = data.activeMapLinkPaths ? data.activeMapLinkPaths.getArray() : [];
                    
                    var r = _(activeMapLinkPaths).map(function(path) {
                        return {
                            conceptSpace: conceptSpace.getId(),
                            path: path
                        }
                    })
                    
                    return r;
                })
                .flatten().value();
            
            //result = [];
//            console.log('mapLinks returned:', result);
//            if(result.length !== 0) {
//                debugger;
//            }
            return result;
        }
    };
    
    
    
    /**
     * Tags paths as active when they are in the collection of
     * active map links
     */
    ns.ItemTaggerMapLinkPath = Class.create(ns.ItemTagger, {
        initialize: function(mapLinkManager, conceptSpace) {
            this.mapLinkManager = mapLinkManager;
            this.conceptSpace = conceptSpace;
        },
        
        createTags: function(path) {
            var result = { isActive: isContained };
            return result;
        }
    });

    
    ns.ItemTaggerFilterString = Class.create(ns.ItemTagger, {
        initialize: function(pathToFilterString) {
            this.pathToFilterString = pathToFilterString;
        },
        
        createTags: function(path) {
            var filterString = this.pathToFilterString.get(path);
            //var isContained = paths.contains(path);
            
            var result = { filterString: filterString };
            //console.log('table: ' + path, isContained);
            return result;
        }
    });


    ns.ItemTaggerManager = Class.create(ns.ItemTagger, {
       initialize: function() {
           this.taggerMap = {}
       },
       
       getTaggerMap: function() {
           return this.taggerMap;
       },
       
       /**
        * @param item The object for which to create the tags
        */
       createTags: function(item) {
           var result = {};
           _(this.taggerMap).each(function(tagger, key) {
               var tags = tagger.createTags(item);
               
               result[key] = tags;
           });
           
           return result;
       }
    });

    ns.FacetTreeTagger = Class.create({
        initialize: function(itemTagger) {
            this.itemTagger = itemTagger;
        },
        
        applyTags: function(facetNode) {
            var itemTagger = this.itemTagger;
            
            var facetNodes = ns.flattenTree(facetNode, 'children');
            
            _(facetNodes).each(function(node) {
                var path = node.item.getPath();
                var tags = itemTagger.createTags(path);
                _(node).extend(tags);
                
                //console.log('tagging: ' + path, tags, node);
            });
        }
    });
    
    
    // TODO This class is NOT used yet - its purpose is to make the FacetValueListCtrl simpler 
    ns.FacetValueService = Class.create({
        initialize: function(facetService, facetConceptGenerator, constraintTaggerFactory) {
            this.sparqlService = sparqlService;
            this.facetService = facetService;
            this.constraintTaggerFactory = constraintTaggerFactory;
        },
       
        fetchFacetValues: function(path, excludeSelfConstraints) {
            var facetService = this.facetService;
            var constraintTaggerFactory = this.constraintTaggerFactory;


            var concept = facetConceptGenerator.createConceptResources(path, excludeSelfConstraints);

            var concept = facetService.createConceptFacetValues(path, true);
            var countVar = rdf.NodeFactory.createVar("_c_");
            var queryCount = facete.ConceptUtils.createQueryCount(concept, countVar);
            var qeCount = qef.createQueryExecution(queryCount);
            var countPromise = service.ServiceUtils.fetchInt(qeCount, countVar);
            
            var query = facete.ConceptUtils.createQueryList(concept);           
            
            

            
            var pageSize = 10;
            
            query.setLimit(pageSize);
            query.setOffset(($scope.currentPage - 1) * pageSize);
            
            var qe = qef.createQueryExecution(query);
            var dataPromise = service.ServiceUtils.fetchList(qe, concept.getVar()).pipe(function(nodes) {

                var tagger = constraintTaggerFactory.createConstraintTagger(path);
                
                var r = _(nodes).map(function(node) {
                    var tmp = {
                        path: path,
                        node: node,
                        tags: tagger.getTags(node)
                    };

                    return tmp;
                });

                return r;
            });
            
            var result = {
                countPromise: countPromise,
                dataPromise: dataPromise
            };
            
            return result;
        }
    });

    
    ns.MapUtils = {
        getExtent: function(map) {
            var olRawExtent = map.getExtent();
            var e = olRawExtent.transform(map.projection, map.displayProjection);
            
            var result = new geo.Bounds(e.left, e.bottom, e.right, e.top);
            
            return result;
        }
                  
    };

    

    ns.AppContext = Class.create({
        initialize: function() {
            this.workSpaces = [];
        },

        addWorkSpace: function() {
            var id = 'workSpace' + (this.workSpaces.length + 1);
            
            var workSpace = new ns.WorkSpaceContext(id, id);
            
            workSpace.setData({
                config: {
                    sparqlServiceIri: sparqlServiceIri,
                    defaultGraphIris: defaultGraphIris 
                }
            });
            
            /*
            var workSpace = {
                id: id,
                name: id,
                config: {
                    sparqlServiceIri: sparqlServiceIri,
                    defaultGraphIris: defaultGraphIris
                }
            };
            */
            
            this.workSpaces.push(workSpace);
        },
        
        removeWorkSpace: function(index) {
            var workSpace = this.workSpaces[index];

            if(workSpace.isActive()) {
                //this.selectWorkSpace(null);
                workSpace.setActive(false);
            }

            this.workSpaces.splice(index, 1);
        },
        
        /*
        selectWorkSpace: function(index) {
            var workSpace = null;

            if(index != null) {
                workSpace = this.workSpaces[index];
                workSpace.isActive = true;
            }

            //$scope.$emit('facete:workSpaceSelected', workSpace);
        },
        */
        
        getWorkSpaces: function() {
            return this.workSpaces;
        }       
    });

    
    ns.WorkSpaceContext = Class.create({
        initialize: function(id, name) {
            this.id = id;
            this.name = name;
            this.active = false;
            this.conceptSpaces = [];
            
            this.data = null;
        },
        
        isActive: function() {
            return this.active;
        },
        
        setActive: function(isActive) {
            this.active = isActive;
        },      
        
        getId: function() {
            return this.id;
        },
        
        getName: function() {
            return this.name;
        },
        
        setName: function(name) {
            this.name = name;
        },
        
        getConceptSpaces: function() {
            return this.conceptSpaces;
        },
        
        addConceptSpace: function() {
            var id = 'conceptSpace' + (this.conceptSpaces.length + 1);            
            var conceptSpace = new ns.ConceptSpaceContext(this, id, id);
            
            var facetTreeConfig = new ns.FacetTreeConfig();
            conceptSpace.setFacetTreeConfig(facetTreeConfig);
            
            this.conceptSpaces.push(conceptSpace);
        },
        
        removeConceptSpace: function(index) {
            var conceptSpace = this.conceptSpaces[index];

            if(conceptSpace.isActive()) {
                //this.selectWorkSpace(null);
                conceptSpace.setActive(false);
            }

            this.conceptSpaces.splice(index, 1);
        },
        
        setData: function(data) {
            this.data = data;
        },
        
        getData: function() {
            return this.data;
        }
    });

    
    ns.ConceptSpaceContext = Class.create({
        initialize: function(workSpaceContext, id, name) {
            this.workSpaceContext = workSpaceContext;
            this.id = id;
            this.name = name;
            this.active = false;
            //this.facetTreeService = facetTreeService;
            
            this.facetTreeConfig = null;
            
            this.data = {};
        },

        getWorkSpace: function() {
            return this.workSpaceContext;
        },
        
        getId: function() {
            return this.id;
        },
        
        getName: function() {
            return this.name;
        },

        isActive: function() {
            return this.active;
        },

        setActive: function(isActive) {
            this.active = isActive;
        },
        
        getWorkSpaceContext: function() {
            return this.workSpaceContext;
        },

        getFacetTreeConfig: function() {
            return this.facetTreeConfig;
        },
        
        setFacetTreeConfig: function(facetTreeConfig) {
            this.facetTreeConfig = facetTreeConfig;
        },
    
        getConstraintManager: function() {
            var result = this.facetTreeConfig.getFacetConfig().getConstraintManager(); 
            return result;
        },
        
        // Tag node objects at a given path using .createConstraintTagger(path).getTags(node)
        createContraintTaggerFactory: function() {
            var constraintManager = this.getConstraintManager();
            var result = new facete.ConstraintTaggerFactory(constraintManager);       
//constraintTaggerFactory
            
            return result;
        },

        setData: function(data) {
            this.data = data;
        },
        
        getData: function() {
            return this.data;
        }

    });
    