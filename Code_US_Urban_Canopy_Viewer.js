/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var treeViz = {"opacity":1,"bands":["classification"],"palette":["3daf3e"]},
    tempViz = {"opacity":1,"bands":["temp"],"min":293.0870062255859,"max":309.78039489746095,"palette":["104aff","7a8eff","ffece7","ff9685","e2470c"]},
    table_new = ee.FeatureCollection("users/Shree1175/CODA_assets/Block_summary_all_fc"),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-122.21920418779035, 47.96834325925114],
          [-122.74654793779035, 47.95730838326097],
          [-122.74654793779035, 47.040675262272835],
          [-121.96651864091535, 47.1005372579493],
          [-121.74679207841535, 47.79150231408636]]], null, false),
    tc_NE = ee.FeatureCollection("users/charlotteks/TreeCanopy_NE"),
    tc_W = ee.FeatureCollection("users/charlotteks/TreeCanopy_W"),
    tc_SE = ee.FeatureCollection("users/charlotteks/TreeCanopy_SE"),
    treeGap = ee.FeatureCollection("users/charlotteks/TreeGap_Block"),
    bloc_temp = ee.FeatureCollection("users/Shree1175/UrbanForest/Block_Summary_Temp"),
    imageVisParam = {"opacity":0.79,"bands":["Tree gap"],"min":0.21429048551670934,"max":0.23488689030492635,"palette":["c47512","fff6f1","86c16f"]},
    imageVisParam2 = {"opacity":0.79,"bands":["Tree target"],"min":0.6714880751138371,"max":0.6714884450861628,"palette":["c47512","fff6f1","86c16f"]},
    viz_Target = {"opacity":0.79,"bands":["Tree target"],"min":0.27238161079986023,"max":0.4693206558003941,"palette":["65cfda","ffe10c","635999"]},
    us_summ = ee.FeatureCollection("users/Shree1175/UrbanForest/US_TreeInEquity_MSA_Mean_FC_Temp"),
    TIGER_cities = ee.FeatureCollection("users/charlotteks/tl_2017_us_uac10"),
    Table_S6_Clean = ee.FeatureCollection("users/charlotteks/UrbanAtlas_TABLE_S6"),
    Table_s4 = ee.FeatureCollection("users/Shree1175/UrbanForest/Table_s4"),
    raster_temp = ee.ImageCollection("users/Shree1175/UrbanForest/TempCollection"),
    bloc_temp_new = ee.ImageCollection("users/Shree1175/UrbanForest/Block_Temp"),
    table2 = ee.FeatureCollection("users/Shree1175/CODA_assets/CODA_MSA_with_FC_per_summary");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// -------------------------------------------------------------
// Assessment of Urban Tree Cover Inequality across US 
// The Nature Conservancy, 2021
// Step 3 : Final U.S. Urban Tree Cover Inequality Atlas 2016
// -------------------------------------------------------------
// This app provides a synoptic view of the disparity in urban tree cover across 5723 US cities, and 
// presents the difference between urban tree cover, summer surface temperature, and income 
// inequality in each city at census block level. Urban tree cover was mapped at 2m resolution 
// using NAIP 2016 by ten mapping zones following a Random Forest approach to get an estimate 
// to tree cover at census block and explore spatial patterns of tree cover inequality across income and 
// population group. Refer to McDonal et al., (2021) for more information on methods. 
// -----------------------------------------------------------------
// Developed by Tanushree Biswas, Charlotte Stanley and Rob McDonald (The Nature Conservancy, 2021). 
// Please contact tanushree.biswas@tnc.org if you have any questions.
// ------------------------------------------------------------------
// Citation : McDonald R.I, Biswas T, Sachar C, Housman I, Boucher T.M., Balk D, Nowak D, Spotswood E,Stanley C.K., 
// and Leyk S., (2021). PLOSone. The urban tree cover and temperature disparity in US urbanized areas: 
// Quantifying the effect of income across 5,723 communities
// --------------------------------------------------------------------
//  ABSTRACT : Urban tree cover provides benefits to human health and well-being, but previous studies suggest that
// tree cover is often inequitably distributed. Here, we use survey the tree cover inequality for US Census
// blocks in U.S. large urbanized areas, home to 167 million people across 5,723 municipalities 
// and other places. In 92% of the urbanized areas surveyed, low-income blocks have less tree cover than 
// high-income blocks. On average low-income blocks have 15.2% less tree cover and are 1.5⁰C hotter 
// (surface temperature) than high-income blocks. The greatest difference between low- and high-income 
// blocks was found in urbanized areas in the Northeast of the United States, where low-income blocks 
// often have at least 30% less tree cover and are at least 4.0⁰C hotter. Even after controlling for
// population density and built-up intensity, the association between income and tree cover is 
// significant, as is the association between race and tree cover. We estimate, after controlling 
// for population density, that low-income blocks have 62 million fewer trees than high-income blocks, 
// a compensatory value of $56 billion dollars ($1,349/person). An investment in tree planting and 
// natural regeneration of $17.6 billion would close the tree cover disparity for 42 million people 
// in low-income blocks.
//===============================================================================================


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create a split panel to display two maps side-by-side 
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// clear the initial map
ui.root.clear();

// set center location and zoom 
var center = {lon: -85, lat: 40, zoom: 7};

// create two maps to display 
var leftMap = ui.Map(center);
var rightMap = ui.Map(center);

// set the visibility of the controls on the two maps
leftMap.setControlVisibility(false);
rightMap.setControlVisibility(false);
rightMap.setControlVisibility({zoomControl: true});

// create a split panel with the two maps.
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true
});

// add the split panel to the display
ui.root.add(splitPanel);

// link the two maps to synchronize movement 
var linker = ui.Map.Linker([leftMap, rightMap]);

////////////////////////////////////////
// Add data 
////////////////////////////////////////

// set coordinate system
var outputCRS = 'EPSG:5070';

// add cities data  
var cities =ee.FeatureCollection(table2);
var sa = cities.filter(ee.Filter.inList('zone',[1,2,3,4,5,8,10,12,13,19,31]));

// add census blocks
var blocks = ee.FeatureCollection('TIGER/2010/Blocks'); 

// add summary data that contains mean variables
var US_Mean = ee.FeatureCollection(us_summ);

// import all TIGER urban areas (>= 50k people)
var TIGER_US_cities = TIGER_cities.filterMetadata('UATYP10','equals','U'); 

// data for 1st chart (Average Percent Tree Cover)
var s4 = ee.FeatureCollection(Table_s4);

// data for 2nd chart (Inequality in Tree Cover by Income and Population)
var s6 = ee.FeatureCollection(Table_S6_Clean);

// join the tree canopy census block data into one feature collection 
var tc_all = ee.FeatureCollection([tc_NE,tc_W,tc_SE]).flatten();

// add tree canopy and temperature census block data 
var tree = ee.FeatureCollection(table_new).filterBounds(sa);
var temp = ee.FeatureCollection(bloc_temp).filterBounds(sa);

////////////////////////////////////////
// Convert data layers to images
////////////////////////////////////////

//var treeRed = tree.reduceToImage(["fc_in_BG_g"],ee.Reducer.max());
var treeRed_all = tc_all.reduceToImage(["fc_in_BG_g"],ee.Reducer.max()).rename('Tree canopy'); 
var treeGap_US = treeGap.reduceToImage(["TreeTarget"],ee.Reducer.max()).rename('Tree target');  
var income = treeGap.reduceToImage(["IncomeGrp"],ee.Reducer.max());
//var Surf_temp = temp.reduceToImage(["SurfaceTem"],ee.Reducer.max()).rename('Temperature'); 
var Surf_temp = (bloc_temp_new.mosaic()).clip(sa).rename('Temperature');
var popGrp= treeGap.reduceToImage(["PopDensGrp"],ee.Reducer.max());
var incomeUSD = treeGap.reduceToImage(["IncPr"],ee.Reducer.max()).rename('Income_USD');  

////////////////////////////////////////
// Create visualization settings 
////////////////////////////////////////

var redPalette = {min:0, max : 1, palette:["e4e9b9","81bd6e","238433","004529"]};
var bluePalette = {min:0, max : 1, palette:["084081","41B6C4","FFFFE5","D9F0A3","78C679","238443","004529"]};
var yellowPalette = {min:1, max: 4, palette: ["f7fb0c","b2b444","87842d","60562f"]};
var vis_temp = {min: 29.2, max: 34.3, opacity: 1, palette: ["4425e9","ffffe5","d83611"]};
var vis_gap = {max: 0.23, min: 0.21, opacity: 0.79, palette:["c47512","fff6f1","86c16f"]}; 
var popPalette = {min:1, max: 4, opacity: 0.71, palette: ["e1e68f","acaf9b","636c4f","3e3952"]}; 

////////////////////////////////////////
// Add layers to map for initial split panel display 
////////////////////////////////////////

// buffer city points for map display 
var bufferFunction = function(feature){
  return feature.buffer(30000);
};
var US_Mean_Buffer = US_Mean.map(bufferFunction);

// display of buffered city points by tree cover 
var empty3 = ee.Image().byte();
var outlines_US_Mean_Buffer_treecover = empty3.paint({
  featureCollection: US_Mean_Buffer,
  color: 'Mean_FC_pr'
});

// display of buffered city points by temperature 
var outlines_US_Mean_Buffer_temp = empty3.paint({
  featureCollection: US_Mean_Buffer,
  color: 'Ave_Surfac'
});

// add mean tree cover to right map 
rightMap.addLayer(outlines_US_Mean_Buffer_treecover, {palette:["brown","yellow","green"], min:5, max: 50}, 'Mean Tree Cover');

// add mean temperature to left map 
leftMap.addLayer(outlines_US_Mean_Buffer_temp, {palette:["4425e9","f3fbff","d83611"], min:24.5, max: 38.5}, 'Mean Temperature');

// visualization to display US cities
var empty = ee.Image().byte();
var UScities = empty.paint({featureCollection: sa, color: 1, width: 0.05});

// add city boundaries to both maps
rightMap.addLayer(UScities,{palette: '323232'}, 'US Cities Mapped');
leftMap.addLayer(UScities,{palette: '323232'}, 'US Cities Mapped');

////////////////////////////////////////
// Mask tree gap to only show income group 1
////////////////////////////////////////

var treeGapMask = income.eq(1);
var treeGap_US_income1 = treeGap_US.updateMask(treeGapMask);

////////////////////////////////////////
// Create legend for initial map display (Tree Canopy and Temperature)
////////////////////////////////////////

// set position of panel
var Simple_Legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 10px'
  }
});
leftMap.widgets().set(0, Simple_Legend);

// canopy legend title (initial map display)
var CanopyLegendTitle_1 = ui.Label({
  value: 'Mean Tree Cover (%)',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '10px 0 4px 0',
    padding: '0'
    }
});

// canopy color bar 
function CanopyColorBar_1(CanopyPalette) {
  return ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '200x10',
      format: 'png',
      min: 0,
      max: 1,
      palette:CanopyPalette,
    },
    style: {stretch: 'horizontal', margin: '0px 8px'},
  });
}

// create display for canopy legend entry (horizontal color bar)
function CanopyLegend_1(low, high, CanopyPalette) {
  var CanopyLabelPanel = ui.Panel(
      [
        ui.Label(low, {margin: '4px 8px'}),
        ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
      ],
      ui.Panel.Layout.flow('horizontal'));
  return ui.Panel([CanopyColorBar_1(CanopyPalette), CanopyLabelPanel]);
}
var CanopyPanel_1 = CanopyLegend_1('Low', 'High', ["brown","yellow","green"]); 

// temperature legend title (initial map display)
var TempDiffLegendTitle_1 = ui.Label({
  value: 'Mean Summer Temperature (deg C)',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '10px 0 4px 0',
    padding: '0'
    }
});

// temperature color bar
function TempDiffColorBar_1(TempDiffPalette) {
  return ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '200x10',
      format: 'png',
      min: 0,
      max: 1,
      palette: TempDiffPalette,
    },
    style: {stretch: 'horizontal', margin: '0px 8px'},
  });
}

// create display for temperature legend entry (horizontal color bar)
function TempDiffLegend_1(low, high, TempDiffPalette) {
  var TempDiffLabelPanel = ui.Panel(
      [
        ui.Label(low, {margin: '4px 8px'}),
        ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
      ],
      ui.Panel.Layout.flow('horizontal'));
  return ui.Panel([TempDiffColorBar_1(TempDiffPalette), TempDiffLabelPanel]);
}
var TempDiffPanel_1 =TempDiffLegend_1('Low', 'High', ["4425e9","f3fbff","d83611"]); 

// add legend entries to initial map display 
Simple_Legend.widgets().set(0, TempDiffLegendTitle_1);
Simple_Legend.widgets().set(1, TempDiffPanel_1);
Simple_Legend.widgets().set(2, CanopyLegendTitle_1);
Simple_Legend.widgets().set(3, CanopyPanel_1);

////////////////////////////////////////
// Create Side Panel 
////////////////////////////////////////

// create panel and set style 
var panel = ui.Panel();
panel.style().set('width', '500px');

// create title text 
var intro = ui.Panel([
  ui.Label({
    value: 'US Urban Tree Cover Inequality Atlas 2021',
    style: {fontSize: '24px', fontWeight: 'bold'}
  })
]);

// add title to panel
panel.add(intro);

// upload The Nature Conservancy logo
var logo = ee.Image('users/charlotteks/TNC_Logo').visualize({
    bands:  ['b1', 'b2', 'b3'],
    min: 0,
    max: 255
    });
var thumb = ui.Thumbnail({
    image: logo,
    params: {
        dimensions: '1329x384', 
        format: 'png'
        },
    style: {height: '48px', width: '166px',padding :'0'}
    });
var Logo = ui.Panel(thumb, 'flow', {width: '300px'});

// add logo to panel
panel.add(Logo);

// add hyperlink to tree canopy viewer
var label_url = ui.Label({
    value:'Click here to view the classified urban tree cover.',
    style: {fontSize: '14px', fontWeight: 'bold'}
  });
label_url.setUrl('https://shree1175.users.earthengine.app/view/usurbantreecover2016');

// write description text
var description = ui.Panel([
  ui.Label({
  value: 'The Urban Tree Cover Inequality Atlas (version 2016.9) maps urban tree canopy across 5,723 US cities and displays how tree cover relates to income inequality. The data was developed from high-resolution aerial imagery, summer temperatures, and census demographics. In 92% of urban areas surveyed, low-income census blocks on average have 15.2% lower canopy cover and are 1.5 degrees C hotter than high-income blocks (McDonald et al., accepted PLOSone Feb 2021). A manuscript with a full description of the methods used to make these layers and all datasets will soon be made publicly available.',
  style: {fontSize: '16px' }
  }),
  ui.Label({
  value: 'How To Use the App: Click on a city on the map to get a more detailed picture of the urban tree cover in your area of interest. When you click inside a block, three charts will appear at the bottom of this panel displaying more information on the relationship between tree cover, income, population, and temperature.',
  style: {fontSize: '14px' }
  }),
  label_url,
  ui.Label({
  value: 'Layers: “Mean Tree Cover” is the percent tree cover within a census block. “Temperature” shows the mean summer temperature. “Income” shows the income quartile that block belongs to within the city. “Population” shows the population density quartile that block belongs to within the city. “Tree Gap” shows the gap in tree cover between low-income and high-income census blocks.',
  style: {fontSize: '14px' }
  }),
  ui.Label({
    value:'Tanushree Biswas, Charlotte Stanley and Rob McDonald (2020). The Nature Conservancy. Please contact tanushree.biswas@tnc.org if you have any questions.',
    style: {fontSize: '11px' }
  }),
  ui.Label({
    value:'Citation : McDonald R.I, Biswas T, Sachar C, Housman I, Boucher T.M., Balk D, Nowak D, Spotswood E, Stanley C.K., and Leyk S., The urban tree cover and temperature disparity in US urbanized areas: Quantifying the effect of income across 5,723 communities (PLOSone April 2021).',
    style:{fontSize: '11px'}
  })
  
]);

// add description to panel
panel.add(description);

// Create empty labels to hold lon/lat values
var lon = ui.Label();
var lat = ui.Label();
panel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));

////////////////////////////////////////
// Create a list of locations the user selects 
////////////////////////////////////////

// A list of points the user has clicked on, as [lon,lat] tuples.
var selectedPoints = [];
 
// Returns the list of locations the user has selected.
function getSelectedBlocks() {
  return tree.filterBounds(ee.Geometry.MultiPoint(selectedPoints));
}

////////////////////////////////////////
// User clicks on map, then filter data by census block, city, and biome at the selected location 
// After user clicks on map, set new display and add charts to panel (for right map only)
////////////////////////////////////////
 
// register a callback to be invoked when the right-side map is clicked
rightMap.onClick(function(coords) {
  
  // remove text instructions from map display 
  leftMap.remove(treeCoverPanel);
  rightMap.remove(treeCoverPanel2);
  
  // remove initial legend from map display 
  leftMap.remove(Simple_Legend);

  // Update the lon/lat panel with values from the click event
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));
  
  // Create a point for the location clicked on
  var point = ee.Geometry.Point(coords.lon, coords.lat);

  // Zoom in on clicked location 
  rightMap.centerObject(point, 13);
  leftMap.centerObject(point, 13);
  
////////////////////////////////////////
// After click -- Select data for location clicked on
////////////////////////////////////////
 
  // filter for city and biome clicked 
  var city = ee.Feature(cities.filterBounds(point).first());
  var biome = city.get('zone');
  var citiesWithBiome = cities.filterMetadata('zone', 'equals', biome);
  
  // city and biome label names 
  var cityName = city.get('CityNames');
  var biomeName = city.get('zone_names');

  // calculate weighted mean 
  var weightedMean = function(biome_name){
    var cities_biome = cities.filter(ee.Filter.equals({leftField:'zone',rightValue:biome_name}));
    var TotArea2 = ee.FeatureCollection(cities_biome).reduceColumns(ee.Reducer.mean().splitWeights().combine(ee.Reducer.first()),
    ['per_Tree', 'Area_SqKM','zone_names']);
    return ee.Feature(null,TotArea2);
  };
  
  // select data for location clicked on 
  var block = ee.Feature(table_new.filterBounds(geometry).first()).get('fc_in_BG_g');
  var US = sa.reduceColumns(ee.Reducer.mean(), ['per_Tree']).get('mean');
  var city_fc = ee.Feature(null,{'value':city.get('per_Tree'),'Label': cityName});
  var biome_fc = ee.Feature(null,{'value':weightedMean(biome).get('mean'),'Label': biomeName});
  var block_fc = ee.Feature(null,{'value':block,'Label':'Block'});
  var US_fc = ee.Feature(null,{'value':US,'Label':'US Mean'});
  
////////////////////////////////////////
// After click -- Visualization
////////////////////////////////////////

  // select city clicked on 
  var city2 = cities.filterBounds(point).first();
  
  // create tree gap visualization based on percentiles of city clicked on 
  var visPct = treeGap_US.reduceRegion({
  reducer: ee.Reducer.percentile([5,95]).setOutputs(['min','max']),
  geometry: city2.geometry(),
  scale: 30});
  
  // create dictionary to hold percentile values
  var minMax = ee.Dictionary({
  minVal: visPct.getNumber('Tree target_min'),
  maxVal: visPct.getNumber('Tree target_max')
  });
  
  // apply visualization to the values of the selected city  
  minMax.evaluate(function(dict) {
  var vis_gap_ByCity = {
    min: dict.minVal, 
    max: dict.maxVal, 
    opacity: 0.79,
    palette: ["65cfda","ffe10c","635999"]
  };

  // set visualization settings for selected city boundary 
  var vis_city_boundary = ({palette: '323232'});
  var city_boundary1 = UScities.visualize(vis_city_boundary);

  // clip data layers to selected city boundary and set visualization settings 
  var treeGap_US_cityClick = treeGap_US_income1.visualize(vis_gap_ByCity); 
  var income_cityClick = income.clip(city).visualize(popPalette); 
  var pop_cityClick = popGrp.clip(city).visualize(popPalette); 
  var treeRed_cityClick = treeRed_all.clip(city).visualize(redPalette); 
  var surfTemp_cityClick = Surf_temp.clip(city).visualize(vis_temp); 

////////////////////////////////////////
// After click -- Display data on map 
// and create layer selections for each side of the split panel 
////////////////////////////////////////

  // create dropdown selection options for left map
  var selection_options_left = {
    'Temperature': surfTemp_cityClick,
    'Population': pop_cityClick,
    'Tree Gap in Low-Income Blocks': treeGap_US_cityClick
  };
  
  // create dropdown selection options for right map
  var selection_options_right = {
    'Tree Canopy': treeRed_cityClick,
    'Income': income_cityClick,
    'Tree Gap in Low-Income Blocks': treeGap_US_cityClick
  };
  
  // add dropdown selectors to both maps 
  var leftSelector = addLayerSelector(leftMap, 0, 'top-left');
  var rightSelector = addLayerSelector_right(rightMap, 0, 'top-right');

  // Function (for left map): Adds a layer selection widget to the given map, to allow users to change which image is displayed in the associated map.
  function addLayerSelector(mapToChange, defaultValue, position) {
    var labelSelect = ui.Label('Choose a layer to view:');
  
    // This function changes the given map to show the selected image.
    function updateMap(selection) {
      mapToChange.layers().set(0, ui.Map.Layer(selection_options_left[selection]));
    }
  
    // Configure a selection dropdown to allow the user to choose between selection_options, and set the map to update when a user makes a selection.
    var select = ui.Select({items: Object.keys(selection_options_left), onChange: updateMap});
    select.setValue(Object.keys(selection_options_left)[defaultValue], true);
  
    var controlPanel =
        ui.Panel({widgets: [labelSelect, select], style: {position: position}});
  
    mapToChange.widgets().set(0, controlPanel);
  }
  
  // add the city boundary to the left map 
  leftMap.layers().set(1, ui.Map.Layer(city_boundary1));

  // Function (for right map): Adds a layer selection widget to the given map, to allow users to change which image is displayed in the associated map.
  function addLayerSelector_right(mapToChange, defaultValue, position) {
    var labelSelect = ui.Label('Choose a layer to view:');
  
    // This function changes the given map to show the selected image.
    function updateMap(selection) {
      mapToChange.layers().set(0, ui.Map.Layer(selection_options_right[selection]));
    }
  
    // Configure a selection dropdown to allow the user to choose between selection_options, and set the map to update when a user makes a selection.
    var select = ui.Select({items: Object.keys(selection_options_right), onChange: updateMap});
    select.setValue(Object.keys(selection_options_right)[defaultValue], true);
  
    var controlPanel =
        ui.Panel({widgets: [labelSelect, select], style: {position: position}});
  
    mapToChange.widgets().set(0, controlPanel);
  }
  
  // add the city boundary to the right map 
  rightMap.layers().set(1, ui.Map.Layer(city_boundary1));

  // add clicked location point to map 
  leftMap.layers().set(2, ui.Map.Layer(point));
  rightMap.layers().set(2, ui.Map.Layer(point));

////////////////////////////////////////
// After click -- Add panel with block level information
////////////////////////////////////////
  
  // TREE CANOPY
  // get tree canopy census block level data 
  var block_canopy = treeRed_all.reduceRegion(ee.Reducer.first(), point, 30).get('Tree canopy');
  var block_canopy_print = ee.Number(block_canopy).multiply(100).round().getInfo();

  // TEMPERATURE
  // create constant image where temperature = 0 
  var temp_noData_Image = ee.Image(0).rename('Temperature');
  
  // create new surface temperature layer where no data is filled in with temperature=0
  var Surf_temp_2 = ee.ImageCollection([Surf_temp, temp_noData_Image]).max();
  
  // get temperature data on click 
  var block_temp = Surf_temp_2.reduceRegion(ee.Reducer.first(), point, 30).get('Temperature');
  var block_temp_num = ee.Number(block_temp).round();

  // condition: if temperature = 0, then print "no data". if temperature <> 0 then print value.
  var condition = block_temp_num.eq(0);
  var true_statement = ee.String('No temperature data available at this location');
  var false_statement = ee.Number(block_temp).round().getInfo() + ' degrees Celsius';
  var blockLabelTemp_conditional = ee.Algorithms.If(condition, true_statement, false_statement);
  
  // print out selected temperature results to panel
  var blockLabelTemp = ui.Label('Average temperature: ' + blockLabelTemp_conditional.getInfo());

  // INCOME
  // create constant image where income = 0 
  var income_noData_Image = ee.Image(0).rename('Income_USD');
  
  // create new income layer where no data is filled in with income=0
  var income_2 = ee.ImageCollection([incomeUSD, income_noData_Image]).max();
  
  // get income data on click 
  var block_income = income_2.reduceRegion(ee.Reducer.first(), point, 30).get('Income_USD');
  var block_income_num = ee.Number(block_income);

  // condition: if income = 0, then print "no data". if income <> 0 then print value.
  var condition1 = block_income_num.eq(0);
  var true_statement1 = ee.String('No income data available at this location');
  var false_statement1 = '$' + ee.Number(block_income).round().getInfo() ;
  var blockLabelIncome_conditional = ee.Algorithms.If(condition1, true_statement1, false_statement1);
  
  // print out selected income results to panel
  var blockLabelIncome = ui.Label('Average household income: ' + blockLabelIncome_conditional.getInfo());
  
  // print out all selected census block text to panel 
  var blockLabelHeader = ui.Label({
  value:'In the census block you clicked on:'});
  blockLabelHeader.style().set('fontWeight', 'bold');
  var blockLabelCanopy = ui.Label('Tree canopy: ' + block_canopy_print + '%'+ '\n', {whiteSpace: 'pre'});
  var blockLabelFooter = ui.Label('Click again within any city to view data for another census block.');
  blockLabelFooter.style().set('fontWeight', 'bold').set('fontSize', '11px');
  
  var blockPanel = ui.Panel({widgets: [blockLabelHeader, blockLabelCanopy, blockLabelTemp, blockLabelIncome, blockLabelFooter],
  style: {position: 'bottom-right', 
  padding: '8px 10px'}
  });
 
  // add census block panel on right map after click
  rightMap.widgets().set(1, blockPanel);
  });

////////////////////////////////////////////
// After click -- Create 1st side panel chart (Average Percent Tree Cover in City)
////////////////////////////////////////////

  // get name of city that user clicked on
  var city_name_s4 = ee.String(city.get('Name'));
  
  // filter data to select city 
  var table_s4_filter_city = s4.filterMetadata('Urbanized Area','equals',city_name_s4);
  
  // get city data 
  var s4_USmean = ee.Number(s4.reduceColumns(ee.Reducer.mean(), ['City median']).get('mean'));
  
  // create new features with US mean data
  var US_mean = ee.Feature(null,{'value':s4_USmean,'Label': 'US Average'}); 
  
  // create new features with city median data 
  var city_med = ee.Feature(null,{'value':ee.Number(table_s4_filter_city.first().get('City median')),'Label': 'City Median'});
  
  // create new features with city's poorest census block data
  var poor = ee.Feature(null,{'value':ee.Number(table_s4_filter_city.first().get('FC Poorest census blocks')),'Label': 'Poorest Census Block'});
  
  // create new features with city's richest census block data
  var rich = ee.Feature(null,{'value':ee.Number(table_s4_filter_city.first().get('FC Richest census blocks')),'Label': 'Richest Census Block'});
  
  // create feature collection from new features
  var s4collect = ee.FeatureCollection([US_mean, city_med, poor, rich]);
  
  // create chart 
  var s4chart = ui.Chart.feature.byFeature({features: s4collect, yProperties: 'value', xProperty: 'Label'});
    s4chart.setChartType('BarChart');
    s4chart.setOptions({
      title: 'Average Percent Tree Cover in '+ ee.String(city_name_s4).getInfo(),
      vAxis: {title: null},
      hAxis: {title: 'Approximate 2016 Percent Tree Cover', minValue: 0},
      series: {0: {color: 'green'}}
    });
  
  // set 1st chart in the panel, overwrite previous chart when user clicks on another location
  panel.widgets().set(3, s4chart); 

////////////////////////////////////////////
// After click -- Create 2nd side panel chart (Inequality in Tree Cover by Income and Population)
////////////////////////////////////////////

  // get name of city that user clicked on
  var city_name = ee.String(city.get('Name'));
  
  // filter data to select city 
  var table_s6_filter_city = s6.filterMetadata('City','equals',city_name);
  
  // create series for chart 
  var fields = {
    'TreeCov_LI': 1,
    'TreeCov_HI': 2
  };
  
  // format chart 
  var s6chartOptions = {
        title: 'Inequality in Tree Cover by Income and Population',
        hAxis: {title: 'Population Density Category (1=Low, 4=High)', format: '#', gridlines: {count: 2}},
        vAxis: {title: 'Percent Tree Cover', gridlines: {count: 2}},
        series: {0: {color: 'FFD700'},
          1: {color: '9932CC'}
        }
    };
  
  // create chart 
  var s6chart =
    ui.Chart.feature.byFeature(table_s6_filter_city, 'PopCat', Object.keys(fields))
    .setSeriesNames(['Low Income', 'High Income'])
    .setChartType('ColumnChart')
    .setOptions(s6chartOptions);
  
  // set 2nd chart in the panel, overwrite previous chart when user clicks on another location
  panel.widgets().set(4, s6chart);

////////////////////////////////////////////
// After click -- Create 3rd side panel chart (Tree Canopy and Temperature Variability by Income Class )
////////////////////////////////////////////

  // get 4 income groups 
  var incomeGrps = income.gt(0).add(income.gt(1)).add(income.gt(2)).add(income.gt(3));
  
  // Convert the income groups to vectors 
  var incomeVector = incomeGrps.addBands(income).reduceToVectors({
    geometry: city.geometry(),
    crs: income.projection(),
    scale: 10,
    geometryType: 'polygon',
    eightConnected: false,
    labelProperty: 'income_group',
    reducer: ee.Reducer.mean(),
    maxPixels: 1e15
  });
   
  // dissolve income vector by income group number 
  var incomeVals = ee.List(incomeVector.aggregate_array('income_group')).distinct().sort();
  
  // union by income group number property to create regions for chart 
  var unionByProp = ee.FeatureCollection(incomeVals.map(function(incomeVal){
    var unionIncome = incomeVector.filter(ee.Filter.eq('income_group', incomeVal));
    return ee.Feature(unionIncome.first()).set('income_group', incomeVal);
  })); 
  
  // format chart 
  var incomeChartOptions = {
      title: 'Tree Canopy and Temperature Variability by Income Class',
      series: { 0: {targetAxisIndex: 0, color: 'red'},
                1: {targetAxisIndex: 1, color: 'green'},
                2: {targetAxisIndex: 1, color: 'brown'}
               },
      hAxis: {title: 'Income Quantiles (1=Low Income, 4=High Income)', format: '#'},
      vAxes: {
        0: {title: 'Temperature (C)', gridlines: {count: 1}},
        1: {title: 'Percent', gridlines: {count: 2}},
      }
    };
  
  // income data for chart 
  var incomeChartData = treeRed_all.addBands(Surf_temp);
  
  // create chart 
  var chart_by_income = ui.Chart.image.byRegion(
      incomeChartData, unionByProp, ee.Reducer.mean(), 100, 'income_group').setChartType('ColumnChart') 
      .setOptions(incomeChartOptions);
  
  // set 3rd chart in the panel, overwrite previous chart when user clicks on another location
  panel.widgets().set(5, chart_by_income);

////////////////////////////////////////
// After click -- Create legend for  map display 
////////////////////////////////////////

  // tree gap in low income title 
  var TreeGapLegendTitle = ui.Label({
    value: 'Tree Gap in Low Income',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // tree gap in low income color bar 
  function TreeGapColorBar(TreeGapPalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette: TreeGapPalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for "tree gap in low income" legend entry (horizontal color bar)
  function TreeGapLegend(low, high, TreeGapPalette) {
    var TreeGapLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([TreeGapColorBar(TreeGapPalette), TreeGapLabelPanel]);
  }
  var TreeGapPanel = TreeGapLegend('High', 'Low', ["65cfda","ffe10c","635999"]);
  
  // canopy legend title 
  var CanopyLegendTitle = ui.Label({
    value: 'Mean Tree Cover (%)',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // canopy color bar 
  function CanopyColorBar(CanopyPalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette:CanopyPalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for canopy legend entry (horizontal color bar)
  function CanopyLegend(low, high, CanopyPalette) {
    var CanopyLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([CanopyColorBar(CanopyPalette), CanopyLabelPanel]);
  }
  var CanopyPanel = CanopyLegend('Low', 'High', ["e4e9b9","81bd6e","004529"]); 
  
  // temperature Legend title
  var TempDiffLegendTitle = ui.Label({
    value: 'Mean Summer Temperature (deg C)',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // temperature color bar 
  function TempDiffColorBar(TempDiffPalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette: TempDiffPalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for temperature legend entry (horizontal color bar)
  function TempDiffLegend(low, high, TempDiffPalette) {
    var TempDiffLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([TempDiffColorBar(TempDiffPalette), TempDiffLabelPanel]);
  }
  var TempDiffPanel =TempDiffLegend('Low', 'High', ["4425e9","f3fbff","d83611"]); 
  
  // income legend title 
  var IncomeLegendTitle = ui.Label({
    value: 'Income and Population Quartile',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // income color bar 
  function IncomeColorBar(IncomePalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette: IncomePalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for income legend entry (horizontal color bar)
  function IncomeLegend(low, high, IncomePalette) {
    var IncomeLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([IncomeColorBar(IncomePalette), IncomeLabelPanel]);
  }
  var IncomePanel = IncomeLegend("Lowest", "Highest", ["e1e68f","acaf9b","636c4f","3e3952"]);
  
  // add legend entries to map display (after user clicks)
    var panelLeft = ui.Panel({widgets:[TempDiffLegendTitle, TempDiffPanel, CanopyLegendTitle, CanopyPanel, TreeGapLegendTitle, TreeGapPanel, IncomeLegendTitle, IncomePanel],
    style: {
      position: 'bottom-left',
      padding: '8px 10px'
    }
  });
  
  // set legend panel on map 
  leftMap.widgets().set(1, panelLeft);
    
  });

/////////////////////////////////////////////////////////////////////
// User clicks on map, then filter data by census block, city, and biome at the selected location 
// After user clicks on map, set new display and add charts to panel (for left map only)
// Duplicate of right map script 
/////////////////////////////////////////////////////////////////////
leftMap.onClick(function(coords) {
  
  // remove text instructions from map display 
  leftMap.remove(treeCoverPanel);
  rightMap.remove(treeCoverPanel2);
  
  // remove initial legend from map display 
  leftMap.remove(Simple_Legend);

  // Update the lon/lat panel with values from the click event
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));
  
  // Create a point for the location clicked on
  var point = ee.Geometry.Point(coords.lon, coords.lat);

  // Zoom in on clicked location 
  rightMap.centerObject(point, 13);
  leftMap.centerObject(point, 13);
  
////////////////////////////////////////
// After click -- Select data for location clicked on
////////////////////////////////////////
 
  // filter for city and biome clicked 
  var city = ee.Feature(cities.filterBounds(point).first());
  var biome = city.get('zone');
  var citiesWithBiome = cities.filterMetadata('zone', 'equals', biome);
  
  // city and biome label names 
  var cityName = city.get('CityNames');
  var biomeName = city.get('zone_names');

  // calculate weighted mean 
  var weightedMean = function(biome_name){
    var cities_biome = cities.filter(ee.Filter.equals({leftField:'zone',rightValue:biome_name}));
    var TotArea2 = ee.FeatureCollection(cities_biome).reduceColumns(ee.Reducer.mean().splitWeights().combine(ee.Reducer.first()),
    ['per_Tree', 'Area_SqKM','zone_names']);
    return ee.Feature(null,TotArea2);
  };
  
  // select data for location clicked on 
  var block = ee.Feature(table_new.filterBounds(geometry).first()).get('fc_in_BG_g');
  var US = sa.reduceColumns(ee.Reducer.mean(), ['per_Tree']).get('mean');
  var city_fc = ee.Feature(null,{'value':city.get('per_Tree'),'Label': cityName});
  var biome_fc = ee.Feature(null,{'value':weightedMean(biome).get('mean'),'Label': biomeName});
  var block_fc = ee.Feature(null,{'value':block,'Label':'Block'});
  var US_fc = ee.Feature(null,{'value':US,'Label':'US Mean'});
  
////////////////////////////////////////
// After click -- Visualization
////////////////////////////////////////

  // select city clicked on 
  var city2 = cities.filterBounds(point).first();
  
  // create tree gap visualization based on percentiles of city clicked on 
  var visPct = treeGap_US.reduceRegion({
  reducer: ee.Reducer.percentile([5,95]).setOutputs(['min','max']),
  geometry: city2.geometry(),
  scale: 30});
  
  // create dictionary to hold percentile values
  var minMax = ee.Dictionary({
  minVal: visPct.getNumber('Tree target_min'),
  maxVal: visPct.getNumber('Tree target_max')
  });
  
  // apply visualization to the values of the selected city  
  minMax.evaluate(function(dict) {
  var vis_gap_ByCity = {
    min: dict.minVal, 
    max: dict.maxVal, 
    opacity: 0.79,
    palette: ["65cfda","ffe10c","635999"]
  };

  // set visualization settings for selected city boundary 
  var vis_city_boundary = ({palette: '323232'});
  var city_boundary1 = UScities.visualize(vis_city_boundary);

  // clip data layers to selected city boundary and set visualization settings 
  var treeGap_US_cityClick = treeGap_US_income1.visualize(vis_gap_ByCity); 
  var income_cityClick = income.clip(city).visualize(popPalette); 
  var pop_cityClick = popGrp.clip(city).visualize(popPalette); 
  var treeRed_cityClick = treeRed_all.clip(city).visualize(redPalette); 
  var surfTemp_cityClick = Surf_temp.clip(city).visualize(vis_temp); 

////////////////////////////////////////
// After click -- Display data on map 
// and create layer selections for each side of the split panel 
////////////////////////////////////////

  // create dropdown selection options for left map
  var selection_options_left = {
    'Temperature': surfTemp_cityClick,
    'Population': pop_cityClick,
    'Tree Gap in Low-Income Blocks': treeGap_US_cityClick
  };
  
  // create dropdown selection options for right map
  var selection_options_right = {
    'Tree Canopy': treeRed_cityClick,
    'Income': income_cityClick,
    'Tree Gap in Low-Income Blocks': treeGap_US_cityClick
  };
  
  // add dropdown selectors to both maps 
  var leftSelector = addLayerSelector(leftMap, 0, 'top-left');
  var rightSelector = addLayerSelector_right(rightMap, 0, 'top-right');

  // Function (for left map): Adds a layer selection widget to the given map, to allow users to change which image is displayed in the associated map.
  function addLayerSelector(mapToChange, defaultValue, position) {
    var labelSelect = ui.Label('Choose a layer to view:');
  
    // This function changes the given map to show the selected image.
    function updateMap(selection) {
      mapToChange.layers().set(0, ui.Map.Layer(selection_options_left[selection]));
    }
  
    // Configure a selection dropdown to allow the user to choose between selection_options, and set the map to update when a user makes a selection.
    var select = ui.Select({items: Object.keys(selection_options_left), onChange: updateMap});
    select.setValue(Object.keys(selection_options_left)[defaultValue], true);
  
    var controlPanel =
        ui.Panel({widgets: [labelSelect, select], style: {position: position}});
  
    mapToChange.widgets().set(0, controlPanel);
  }
  
  // add the city boundary to the left map 
  leftMap.layers().set(1, ui.Map.Layer(city_boundary1));

  // Function (for right map): Adds a layer selection widget to the given map, to allow users to change which image is displayed in the associated map.
  function addLayerSelector_right(mapToChange, defaultValue, position) {
    var labelSelect = ui.Label('Choose a layer to view:');
  
    // This function changes the given map to show the selected image.
    function updateMap(selection) {
      mapToChange.layers().set(0, ui.Map.Layer(selection_options_right[selection]));
    }
  
    // Configure a selection dropdown to allow the user to choose between selection_options, and set the map to update when a user makes a selection.
    var select = ui.Select({items: Object.keys(selection_options_right), onChange: updateMap});
    select.setValue(Object.keys(selection_options_right)[defaultValue], true);
  
    var controlPanel =
        ui.Panel({widgets: [labelSelect, select], style: {position: position}});
  
    mapToChange.widgets().set(0, controlPanel);
  }
  
  // add the city boundary to the right map 
  rightMap.layers().set(1, ui.Map.Layer(city_boundary1));

  // add clicked location point to map 
  leftMap.layers().set(2, ui.Map.Layer(point));
  rightMap.layers().set(2, ui.Map.Layer(point));

////////////////////////////////////////
// After click -- Add panel with block level information
////////////////////////////////////////
  
  // TREE CANOPY
  // get tree canopy census block level data 
  var block_canopy = treeRed_all.reduceRegion(ee.Reducer.first(), point, 30).get('Tree canopy');
  var block_canopy_print = ee.Number(block_canopy).multiply(100).round().getInfo();

  // TEMPERATURE
  // create constant image where temperature = 0 
  var temp_noData_Image = ee.Image(0).rename('Temperature');
  
  // create new surface temperature layer where no data is filled in with temperature=0
  var Surf_temp_2 = ee.ImageCollection([Surf_temp, temp_noData_Image]).max();
  
  // get temperature data on click 
  var block_temp = Surf_temp_2.reduceRegion(ee.Reducer.first(), point, 30).get('Temperature');
  var block_temp_num = ee.Number(block_temp).round();

  // condition: if temperature = 0, then print "no data". if temperature <> 0 then print value.
  var condition = block_temp_num.eq(0);
  var true_statement = ee.String('No temperature data available at this location');
  var false_statement = ee.Number(block_temp).round().getInfo() + ' degrees Celsius';
  var blockLabelTemp_conditional = ee.Algorithms.If(condition, true_statement, false_statement);
  
  // print out selected temperature results to panel
  var blockLabelTemp = ui.Label('Average temperature: ' + blockLabelTemp_conditional.getInfo());

  // INCOME
  // create constant image where income = 0 
  var income_noData_Image = ee.Image(0).rename('Income_USD');
  
  // create new income layer where no data is filled in with income=0
  var income_2 = ee.ImageCollection([incomeUSD, income_noData_Image]).max();
  
  // get income data on click 
  var block_income = income_2.reduceRegion(ee.Reducer.first(), point, 30).get('Income_USD');
  var block_income_num = ee.Number(block_income);

  // condition: if income = 0, then print "no data". if income <> 0 then print value.
  var condition1 = block_income_num.eq(0);
  var true_statement1 = ee.String('No income data available at this location');
  var false_statement1 = '$' + ee.Number(block_income).round().getInfo() ;
  var blockLabelIncome_conditional = ee.Algorithms.If(condition1, true_statement1, false_statement1);
  
  // print out selected income results to panel
  var blockLabelIncome = ui.Label('Average household income: ' + blockLabelIncome_conditional.getInfo());
  
  // print out all selected census block text to panel 
  var blockLabelHeader = ui.Label({
  value:'In the census block you clicked on:'});
  blockLabelHeader.style().set('fontWeight', 'bold');
  var blockLabelCanopy = ui.Label('Tree canopy: ' + block_canopy_print + '%'+ '\n', {whiteSpace: 'pre'});
  var blockLabelFooter = ui.Label('Click again within any city to view data for another census block.');
  blockLabelFooter.style().set('fontWeight', 'bold').set('fontSize', '11px');
  
  var blockPanel = ui.Panel({widgets: [blockLabelHeader, blockLabelCanopy, blockLabelTemp, blockLabelIncome, blockLabelFooter],
  style: {position: 'bottom-right', 
  padding: '8px 10px'}
  });
 
  // add census block panel on right map after click
  rightMap.widgets().set(1, blockPanel);
  });

////////////////////////////////////////////
// After click -- Create 1st side panel chart (Average Percent Tree Cover in City)
////////////////////////////////////////////

  // get name of city that user clicked on
  var city_name_s4 = ee.String(city.get('Name'));
  
  // filter data to select city 
  var table_s4_filter_city = s4.filterMetadata('Urbanized Area','equals',city_name_s4);
  
  // get city data 
  var s4_USmean = ee.Number(s4.reduceColumns(ee.Reducer.mean(), ['City median']).get('mean'));
  
  // create new features with US mean data
  var US_mean = ee.Feature(null,{'value':s4_USmean,'Label': 'US Average'}); 
  
  // create new features with city median data 
  var city_med = ee.Feature(null,{'value':ee.Number(table_s4_filter_city.first().get('City median')),'Label': 'City Median'});
  
  // create new features with city's poorest census block data
  var poor = ee.Feature(null,{'value':ee.Number(table_s4_filter_city.first().get('FC Poorest census blocks')),'Label': 'Poorest Census Block'});
  
  // create new features with city's richest census block data
  var rich = ee.Feature(null,{'value':ee.Number(table_s4_filter_city.first().get('FC Richest census blocks')),'Label': 'Richest Census Block'});
  
  // create feature collection from new features
  var s4collect = ee.FeatureCollection([US_mean, city_med, poor, rich]);
  
  // create chart 
  var s4chart = ui.Chart.feature.byFeature({features: s4collect, yProperties: 'value', xProperty: 'Label'});
    s4chart.setChartType('BarChart');
    s4chart.setOptions({
      title: 'Average Percent Tree Cover in '+ ee.String(city_name_s4).getInfo(),
      vAxis: {title: null},
      hAxis: {title: 'Approximate 2016 Percent Tree Cover', minValue: 0},
      series: {0: {color: 'green'}}
    });
  
  // set 1st chart in the panel, overwrite previous chart when user clicks on another location
  panel.widgets().set(3, s4chart); 

////////////////////////////////////////////
// After click -- Create 2nd side panel chart (Inequality in Tree Cover by Income and Population)
////////////////////////////////////////////

  // get name of city that user clicked on
  var city_name = ee.String(city.get('Name'));
  
  // filter data to select city 
  var table_s6_filter_city = s6.filterMetadata('City','equals',city_name);
  
  // create series for chart 
  var fields = {
    'TreeCov_LI': 1,
    'TreeCov_HI': 2
  };
  
  // format chart 
  var s6chartOptions = {
        title: 'Inequality in Tree Cover by Income and Population',
        hAxis: {title: 'Population Density Category (1=Low, 4=High)', format: '#', gridlines: {count: 2}},
        vAxis: {title: 'Percent Tree Cover', gridlines: {count: 2}},
        series: {0: {color: 'FFD700'},
          1: {color: '9932CC'}
        }
    };
  
  // create chart 
  var s6chart =
    ui.Chart.feature.byFeature(table_s6_filter_city, 'PopCat', Object.keys(fields))
    .setSeriesNames(['Low Income', 'High Income'])
    .setChartType('ColumnChart')
    .setOptions(s6chartOptions);
  
  // set 2nd chart in the panel, overwrite previous chart when user clicks on another location
  panel.widgets().set(4, s6chart);

////////////////////////////////////////////
// After click -- Create 3rd side panel chart (Tree Canopy and Temperature Variability by Income Class )
////////////////////////////////////////////

  // get 4 income groups 
  var incomeGrps = income.gt(0).add(income.gt(1)).add(income.gt(2)).add(income.gt(3));
  
  // Convert the income groups to vectors 
  var incomeVector = incomeGrps.addBands(income).reduceToVectors({
    geometry: city.geometry(),
    crs: income.projection(),
    scale: 10,
    geometryType: 'polygon',
    eightConnected: false,
    labelProperty: 'income_group',
    reducer: ee.Reducer.mean(),
    maxPixels: 1e15
  });
   
  // dissolve income vector by income group number 
  var incomeVals = ee.List(incomeVector.aggregate_array('income_group')).distinct().sort();
  
  // union by income group number property to create regions for chart 
  var unionByProp = ee.FeatureCollection(incomeVals.map(function(incomeVal){
    var unionIncome = incomeVector.filter(ee.Filter.eq('income_group', incomeVal));
    return ee.Feature(unionIncome.first()).set('income_group', incomeVal);
  })); 
  
  // format chart 
  var incomeChartOptions = {
      title: 'Tree Canopy and Temperature Variability by Income Class',
      series: { 0: {targetAxisIndex: 0, color: 'red'},
                1: {targetAxisIndex: 1, color: 'green'},
                2: {targetAxisIndex: 1, color: 'brown'}
               },
      hAxis: {title: 'Income Quantiles (1=Low Income, 4=High Income)', format: '#'},
      vAxes: {
        0: {title: 'Temperature (C)', gridlines: {count: 1}},
        1: {title: 'Percent', gridlines: {count: 2}},
      }
    };
  
  // income data for chart 
  var incomeChartData = treeRed_all.addBands(Surf_temp);
  
  // create chart 
  var chart_by_income = ui.Chart.image.byRegion(
      incomeChartData, unionByProp, ee.Reducer.mean(), 100, 'income_group').setChartType('ColumnChart') 
      .setOptions(incomeChartOptions);
  
  // set 3rd chart in the panel, overwrite previous chart when user clicks on another location
  panel.widgets().set(5, chart_by_income);

////////////////////////////////////////
// After click -- Create legend for  map display 
////////////////////////////////////////

  // tree gap in low income title 
  var TreeGapLegendTitle = ui.Label({
    value: 'Tree Gap in Low Income',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // tree gap in low income color bar 
  function TreeGapColorBar(TreeGapPalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette: TreeGapPalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for "tree gap in low income" legend entry (horizontal color bar)
  function TreeGapLegend(low, high, TreeGapPalette) {
    var TreeGapLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([TreeGapColorBar(TreeGapPalette), TreeGapLabelPanel]);
  }
  var TreeGapPanel = TreeGapLegend('High', 'Low', ["65cfda","ffe10c","635999"]);
  
  // canopy legend title 
  var CanopyLegendTitle = ui.Label({
    value: 'Mean Tree Cover (%)',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // canopy color bar 
  function CanopyColorBar(CanopyPalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette:CanopyPalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for canopy legend entry (horizontal color bar)
  function CanopyLegend(low, high, CanopyPalette) {
    var CanopyLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([CanopyColorBar(CanopyPalette), CanopyLabelPanel]);
  }
  var CanopyPanel = CanopyLegend('Low', 'High', ["e4e9b9","81bd6e","004529"]); 
  
  // temperature Legend title
  var TempDiffLegendTitle = ui.Label({
    value: 'Mean Summer Temperature (deg C)',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // temperature color bar 
  function TempDiffColorBar(TempDiffPalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette: TempDiffPalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for temperature legend entry (horizontal color bar)
  function TempDiffLegend(low, high, TempDiffPalette) {
    var TempDiffLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([TempDiffColorBar(TempDiffPalette), TempDiffLabelPanel]);
  }
  var TempDiffPanel =TempDiffLegend('Low', 'High', ["4425e9","f3fbff","d83611"]); 
  
  // income legend title 
  var IncomeLegendTitle = ui.Label({
    value: 'Income and Population Quartile',
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      padding: '0'
      }
  });
  
  // income color bar 
  function IncomeColorBar(IncomePalette) {
    return ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {
        bbox: [0, 0, 1, 0.1],
        dimensions: '200x10',
        format: 'png',
        min: 0,
        max: 1,
        palette: IncomePalette,
      },
      style: {stretch: 'horizontal', margin: '0px 8px'},
    });
  }
  
  // create display for income legend entry (horizontal color bar)
  function IncomeLegend(low, high, IncomePalette) {
    var IncomeLabelPanel = ui.Panel(
        [
          ui.Label(low, {margin: '4px 8px'}),
          ui.Label(high, {margin: '4px 8px', textAlign: 'right', stretch: 'horizontal'})
        ],
        ui.Panel.Layout.flow('horizontal'));
    return ui.Panel([IncomeColorBar(IncomePalette), IncomeLabelPanel]);
  }
  var IncomePanel = IncomeLegend("Lowest", "Highest", ["e1e68f","acaf9b","636c4f","3e3952"]);
  
  // add legend entries to map display (after user clicks)
    var panelLeft = ui.Panel({widgets:[TempDiffLegendTitle, TempDiffPanel, CanopyLegendTitle, CanopyPanel, TreeGapLegendTitle, TreeGapPanel, IncomeLegendTitle, IncomePanel],
    style: {
      position: 'bottom-left',
      padding: '8px 10px'
    }
  });
  
  // set legend panel on map 
  leftMap.widgets().set(1, panelLeft);
    
  });

////////////////////////////////////////
// Add instructions to the top of initial map 
////////////////////////////////////////

// Create label with instruction text 
var label1 = ui.Label('Click inside a city boundary on the map to see the inequality in tree canopy  by income');
label1.style().set('fontWeight', 'bold');
label1.style().set({
  fontSize: '16px',
});
var treeCoverPanel = ui.Panel([label1]);
  treeCoverPanel.style().set({ fontSize: '100px', position: 'top-center'});

// Create label with instruction text (duplicate for right map)
var label2 = ui.Label('Click inside a city boundary on the map to see the inequality in tree canopy  by income');
label2.style().set('fontWeight', 'bold');
label2.style().set({
  fontSize: '16px',
});
var treeCoverPanel2 = ui.Panel([label2]);
  treeCoverPanel2.style().set({ fontSize: '100px', position: 'top-center'});

// Add instruction label to both initial maps 
leftMap.add(treeCoverPanel);
rightMap.add(treeCoverPanel2);

Map.style().set('cursor', 'crosshair');

//////////////////////////////////////////////////////////

// CODE OFF or ON
if(1){
// Add the panel to the ui.root.
ui.root.insert(0, panel);

// Clears the set of selected points and resets the overlay and results
// panel to their default state.
function clearResults() {
  selectedPoints = [];
  Map.layers().remove(Map.layers().get(2));
  var instructionsLabel = ui.Label('Select regions to compare tree cover.');
  resultsPanel.widgets().reset([instructionsLabel],[chart]);
  }

// Register a click handler for the map that adds the clicked point to the
// list and updates the map overlay and chart accordingly.
function handleMapClick(location) {
  selectedPoints.push([location.lon, location.lat]);
  //updateOverlay();
  //updateChart();
  }
}
