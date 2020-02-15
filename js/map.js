var mapMain;

// @formatter:off
require([
        "esri/map",
        
        "esri/geometry/Extent",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/dijit/BasemapToggle",
        "esri/dijit/Scalebar",
        "esri/dijit/Legend",
        "dojo/ready",
        "dojo/parser",
        "dojo/on",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (
        Map,
        
        Extent,
        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        BasemapToggle,
        Scalebar,
        Legend,
        ready, parser, on,
        BorderContainer,
        ContentPane
    ) {
        // @formatter:on
        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // dojo.toJson(mapMain.extent.toJson());

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();
            /*
             * Step: Specify the initial extent
             * Note: Exact coordinates may vary slightly from snippet/solution
             * Reference: https://developers.arcgis.com/javascript/jssamples/fl_any_projection.html
             */
            let extentInitial = new Extent({
                "xmin":-13664780.377109833,
                "ymin":4523779.569350305,
                "xmax":-13625453.526057161,
                "ymax":4564558.723940392,
                "spatialReference":
                    {
                        "wkid":102100,
                        "latestWkid":3857
                    }
                });
            
            // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "satellite",
                extent: extentInitial
            });

            /*
             * Step: Add the USA map service to the map
             */
            let lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
                {opacity: 0.5});
                    
            //let lyrQuakes = new FeatureLayer("http://services.arcgis.com/ue9rwulloeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0");
            //lyrQuakes.setDefinitionExpression("magnitude >= 2.0");

            mapMain.addLayer(lyrUSA);
            //mapMain.addLayer(lyrQuakes);
            //mapMain.addLayer([lyrUSA,lyrQuakes]);

            let toogle = new BasemapToggle({
                map: mapMain,
                basemap: "topo"
            }, "BasemapToggle");

            toogle.startup();

            /*
             * Step: Add the earthquakes layer to the map
             */

            let dijitScaler = new Scalebar({
                map: mapMain,
                scalebarUnit: "dual",
                attachTo: "bootom-left"
            });

            /*
            * Step: Revise code to use the addLayers() method
            */

            /*
             * Step: Add the BaseMapToggle widget to the map
             */


            /*
             * Step: Add a legend once all layers have been added to the map
             */
            mapMain.on("layer-add-result", function(){
                var dijitLegend = new Legend({
                    map: mapMain,
                    arrangement: Legend.ALIGN_RIGHT
                }, "divLegend");
                dijitLegend.startup()
            }); // stub


        });
    });
