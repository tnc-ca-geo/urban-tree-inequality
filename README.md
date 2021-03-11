# US Urban Tree Cover Inequality Atlas 2016

The Urban Tree Cover Inequality Atlas (version 2016.9) is a Google Earth Engine web tool that maps tree canopy across 100 urban areas in the U.S. and displays the relationship between tree canopy and income inequality. The data was developed from high-resolution aerial imagery, summer temperatures, and census demographics. The tool allows users to explore information on tree canopy cover, summer temperatures, income, population density, and "tree gap" (the difference in tree canopy between low-income and high-income census blocks) in each urban area. The web tool is available at: https://tinyurl.com/tree-inequality. A manuscript with a full description of the methods used is in review and all datasets will soon be made publicly available.

# Installation and Usage
To use this code, you must have a Google Earth Engine account. You can create an account at: https://code.earthengine.google.com/ 

[Click here to run the code on Earth Engine.](https://code.earthengine.google.com/?scriptPath=users%2FShree1175%2Ftnc_treeinequality%3AUSUrbanCanopyViewer_FINAL) 

# Data
The Github page above includes CSV files with data for each U.S. urban area mapped ("censusBlock_urban_treeCanopy_CityName.csv"). Download your city of interest to view tree canopy data. The file "DataDescription.csv" describes the fields in the tree canopy CSV files.

census block level, join to census block data using the field "census_block_GEOID"
[Block GEOID](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html)

Download spatial data from the US Census here(https://www.census.gov/geographies/mapping-files.2020.html)

You can download a geodatabase with tree canopy data for all 100 studied U.S. urban areas [here]. (https://knb.ecoinformatics.org/view/doi:10.5063/MS3R5F)

# Credits
Tanushree Biswas, Charlotte Stanley and Rob McDonald (2020). The Nature Conservancy. Please contact tanushree.biswas@tnc.org if you have any questions.
