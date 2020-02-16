var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/tasks/PrintTemplate",
        "esri/dijit/Directions",

        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, PrintTemplate,
                Directions,
              parser, ready,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            /*
             * Step: create an array of JSON objects that will be used to create print templates
             */

            /*     var myLayouts = [{
             "name" : "Letter ANSI A Landscape",
             "label" : "Landscape (PDF)",
             "format" : "pdf",
             "options" : {
             "legendLayers" : [], // empty array means no legend
             "scalebarUnit" : "Miles",
             "titleText" : "Landscape PDF"
             }
             }, {
             "name" : "Letter ANSI A Portrait",
             "label" : "Portrait (JPG)",
             "format" : "jpg",
             "options" : {
             "legendLayers" : [],
             "scaleBarUnit" : "Miles",
             "titleText" : "Portrait JPG"
             }
             }];

             */
            /*
             * Step: create the print templates
             */

            /*    var myTemplates = [];
             dojo.forEach(myLayouts, function(lo) {
             var t = new PrintTemplate();
             t.layout = lo.name;
             t.label = lo.label;
             t.format = lo.format;
             t.layoutOptions = lo.options
             myTemplates.push(t);
             });
             */

            // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });

            /*
             * Step: Add the Directions widget
             */
            var dijitDirections = new Directions({
                 map : mapMain,
                 // Uses World Network Analysis by default, which requires a subscription
                 routeTaskUrl : "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                 }, "divDirections");
                 dijitDirections.startup();
            /*
             * Step: Add the Print widget
             */


        });

    });
