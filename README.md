# US Urban Tree Cover Inequality Atlas 2016

The Urban Tree Cover Inequality Atlas (version 2016.9) is a Google Earth Engine web tool that maps tree canopy across 100 urbanized areas in the U.S. and displays the relationship between tree canopy and income inequality. The data was developed from high-resolution aerial imagery, satellite remotely sensed land summer temperatures, and census demographics. The tool allows users to explore the information on tree canopy cover, summer temperatures, income, population density, and "tree gap" (the difference in tree canopy between low-income and high-income census blocks) in each urban area. The web tool is available at: https://tinyurl.com/tree-inequality. A manuscript with a full description of the methods used is in review and all datasets will soon be made publicly available.

# Installation and Usage
To use this code, you must have a Google Earth Engine account. You can create an account at: https://code.earthengine.google.com/ 

[TNC_TreeInequality GEE Repository](https://code.earthengine.google.com/?accept_repo=users/Shree1175/tnc_treeinequality)

"Assessment of Urban Tree Cover Inequity across US : "

"Step 1 : Map Urban Tree Cover using NAIP 2016" [Click here to run the code on Earth Engine.](https://code.earthengine.google.com/8133aae126123850ca672a561e64f086?accept_repo=TNC_CA)

"Step 2 : Assessment of Land Surface Temperature across US Urban Areas using Landsat" [Click here to run the code on Earth Engine.](https://code.earthengine.google.com/0f86a97b11bb4cc891ef784abf92a6ba?accept_repo=TNC_CA)

You can also download the code as a text file ("Code_US_Urban_Canopy_Viewer.js"). 

# Data
The "censusBlock_data" folder contains CSV files with tree canopy data for each U.S. urban area mapped ("censusBlock_urban_treeCanopy_CityName.csv"). Download your city of interest to view the data. The file "DataDescription.csv" describes the fields in the tree canopy CSV files.

To view the tree canopy data spatially, you will need to download spatial data for census blocks from the U.S. Census Bureau [here](https://www.census.gov/geographies/mapping-files.2020.html). Then, join the tree canopy CSV file to the respective city's census block level data on the field "census_block_GEOID". [This website](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) provides a description of the Block GEOIDs. 

You can also download a geodatabase with tree canopy data for all 100 studied U.S. urban areas [here.](https://knb.ecoinformatics.org/view/doi:10.5063/MS3R5F)

# Credits
Tanushree Biswas, Charlotte Stanley and Rob McDonald (2020). The Nature Conservancy. Please contact tanushree.biswas@tnc.org if you have any questions.
