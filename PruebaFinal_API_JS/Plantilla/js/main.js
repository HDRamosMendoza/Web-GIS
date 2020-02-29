var map;
var tb;
require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/toolbars/draw",
        "esri/graphic",
  "esri/InfoTemplate",
  "esri/dijit/Legend",
  "esri/dijit/Search",
  "esri/dijit/OverviewMap",
  "esri/dijit/Scalebar",
  "esri/dijit/BasemapGallery",
  "esri/dijit/PopupTemplate",
  "esri/arcgis/utils",  
  "dojo/_base/Color",
  "dojo/_base/array",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
  "dojo/on",
  "dojo/query",
  "dojo/dom",

  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "dojo/domReady!"
  ],function(
    Map,
    FeatureLayer,
    Draw, Graphic,
    InfoTemplate,
    Legend,
    Search,
    OverviewMap,
    Scalebar,
    BasemapGallery,
    PopupTemplate,  
    arcgisUtils,
    Color,
    arrayUtils,
    Query,
    QueryTask,
    SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
    on,
    query,
    dom
  ) {

    // Services 
    let servicesCities = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0";
    let servicesHighways = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1";
    let servicesStates = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2";
    let servicesCounties = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3";
    // Se agrega FEATURE LAYER cities
    let cities = new FeatureLayer(servicesCities, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"]
      });

    // Se agrega FEATURE LAYER highways
    let highways = new FeatureLayer(servicesHighways, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"]
      });

    // Se agrega FEATURE LAYER states
    let states = new FeatureLayer(servicesStates, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        /* Se agrega POPUP TEMPLATE */
        infoTemplate: new PopupTemplate({
          title: "<center>Estado</center>",
          description: [ "",
          "<b>Nombre              : </b> {state_name}<br>",
          "<b>Población           : </b> {pop2000}<br>",
          "<b>Población por milla : </b> {pop00_sqmi}<br>",
          "<b>Área                : </b> {ss6.gdb.States.area}<br>"
          ].join(""),
          fieldInfos: [
            { 
              fieldName: "state_name", label: "Nombre", visible: true,
              format: { digitSeparator: true, places: 0 }
            },{
              fieldName: "pop2000", label: "Población", visible: true,
              format: { digitSeparator: true, places: 0 }
            },{
              fieldName: "pop00_sqmi", label: "Población por milla", visible: true,
              format: { digitSeparator: true, places: 0 }
            },{
              fieldName: "ss6.gdb.States.area", label: "Área", visible: true,
              format: { digitSeparator: true, places: 0 }
            }
          ]
        }),
      });

    // Se agrega FEATURE LAYER counties
    // Se agrego "opacity: 0.3" para tener una mayor visualización
    let counties = new FeatureLayer(servicesCounties, {
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 0.3,
        outFields: ["*"]
      });

    function displayPolygon(evt) {
      // Se obtiene la geometria
      var geometryInput = evt.geometry;
      // Define la simbologia
      let tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));
      // limpia el mapa
      map.graphics.clear();
      // Construye el poligono al gráfico
      let graphicPolygon = new Graphic(geometryInput, tbDrawSymbol);
      map.graphics.add(graphicPolygon);
      // Llama a la nueva función
      selectStates(geometryInput);
    }

    function selectStates(geometryInput) {
        // Define la seleccion del FEATURE
        var symbolSelected = new SimpleMarkerSymbol({
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "color": [255, 115, 0, 128],
            "size": 6,
            "outline": {
                "color": [255, 0, 0, 214],
                "width": 1
            }
        });

        // Se cambio el simbolo
       cities.setSelectionSymbol(symbolSelected);
        // Inicializa el query
        let queryStates = new Query();
        queryStates.geometry = geometryInput;
        // Selecciona la nueva seleccion
        cities.selectFeatures(queryStates, FeatureLayer.SELECTION_NEW);
    }
    
    function fPintaYQuery(){

      let tbDraw = new Draw(map);
      tbDraw.on("draw-end", displayPolygon);
      // Activa el dibujo
      tbDraw.activate(Draw.POLYGON);
    }

    // Zoom de acerca FEATURE LAYER states
    function zoomStates(objectId) {
      try {
        // Limpia la seleccion anterior.
        states.clearSelection();
        // Creamos el query
        let queryFC = new Query();
        // Asignamos el OBJECT ID
        queryFC.objectIds = [objectId];
        states.selectFeatures (
          queryFC, FeatureLayer.SELECTION_NEW, function (features) {
            map.setExtent (features[0].geometry.getExtent().expand(1.6));
          }
        );
      } catch (error) {
        console.log("Error _zoomAAA: " + error.message);
      }
    }

    function fQueryEstados(){
      // Se obtiene el nombre del estado
      let txtDtb = dojo.byId("dtb").value;

      let queryTask = new QueryTask(servicesStates);

      let queryState = new Query();
      queryState.returnGeometry = false;
      queryState.where = "state_name = '"+ txtDtb +"'";
      queryState.outFields = ["*"];

      // Executamos en la tarea del query
      queryTask.execute(
        queryState,
        function(item){
          featureLength = item.features.length;
          // Valida que retorne algún resultado caso contrario
          // muestra que no existe estado.
          if(featureLength > 0){
            for(let i = 0; i < featureLength; i++) {
              featureAttributes = item.features[i].attributes;
              // Envia el OBJECT ID para el ZOOM
              zoomStates(featureAttributes["objectid"]);
            }
          } else {
            alert("No existe ESTADO");
          }
        }
      );
    }

    // Limpia la caja de texto
    /*
    function fQueryEstadosDel(){
      dojo.byId("delButtonNode").value = "";
    }
    */

    /* Evento click */
    on(dojo.byId("pintaYQuery"),"click",fPintaYQuery);
    on(dojo.byId("progButtonNode"),"click",fQueryEstados);
    /* on(dojo.byId("delButtonNode"),"click",fQueryEstadosDel);*/

    // Configuración de mapa principal
    map = new Map("map", {
      basemap: "topo",
      center: [-122.45,37.75], // long, lat
      zoom: 13,
      sliderStyle: "small"
    });
    
    // Se agrega SEARCH
    let search = new Search({
        map: map
     }, "search");
     search.startup();

    // Se agreg BASEMAP GALLERY
    let basemapGallery = new BasemapGallery({
      showArcGISBasemaps: true,
      map: map
    }, "basemapGallery");
    basemapGallery.startup();
    
    basemapGallery.on("error", function(msg) {
      console.log("basemap gallery error:  ", msg);
    });

    // Se agrega SCALEBAR
    let scalebar = new Scalebar({
      map: map,
      // "dual" displays both miles and kilometers
      // "english" is the default, which displays miles
      // use "metric" for kilometers
      scalebarUnit: "dual"
    });

    // Se agrega OVERVIEW
    let overviewMapDijit = new OverviewMap({
      map: map,
      visible: false,
      attachTo: "bottom-right"
    });
    overviewMapDijit.startup();


    // Se ejecuta al cargar el mapa
    map.on("load",function(evt){
      map.resize();
      map.reposition();
    });

    // Se agrega adicionar todas las capas
    map.on("layers-add-result", function (evt) {
      var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
        return {layer:layer.layer, title:layer.layer.name};
      });
      if (layerInfo.length > 0) {
        var legendDijit = new Legend({
          map: map,
          layerInfos: layerInfo
        }, "legendDiv");
        legendDijit.startup();
      }
    });



    // Se agrega capas al mapa
    map.addLayers([cities,highways,states,counties]);
  });