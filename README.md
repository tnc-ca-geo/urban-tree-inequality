# US Urban Tree Cover Inequality Atlas 2016

## Description

The Urban Tree Cover Inequality Atlas (version 2016.9) is a Google Earth Engine web tool that maps tree canopy across 100 urbanized areas in the U.S. and displays the relationship between tree canopy and income inequality. The data was developed from high-resolution aerial imagery, satellite remotely sensed land summer temperatures, and census demographics. The tool allows users to explore the information on tree canopy cover, summer temperatures, income, population density, and "tree gap" (the difference in tree canopy between low-income and high-income census blocks) in each urban area. The web tool is available at: https://tinyurl.com/tree-inequality. A manuscript with a full description of the methods used is in review and all datasets will soon be made publicly available.

**Primary Points of Contact:**
- Dr. Rob McDonald, rob_mcdonald@tnc.org
- Dr. Tanushree Biswas, tanushree.biswas@tnc.org

## Installation and Usage
To use this code, you must have a Google Earth Engine account. You can create an account at: https://code.earthengine.google.com/ 

**Google Earth Engine (GEE) Repository**

All of the scripts related to this project, Assessment of Urban Tree Cover Inequality across the US, are within the [TNC_TreeInequality GEE Repository](https://code.earthengine.google.com/?accept_repo=users/Shree1175/tnc_treeinequality). 

The repository contains three scripts: 

- **Step 1: View Classified Urban Tree Canopy**: View the classified urban tree canopy across 5,723 US cities, overlaid with NAIP 2016 imagery. [Click here to run the code on Earth Engine.](https://code.earthengine.google.com/0c38d1fe4e26a561363f9eaabd33cbd0?accept_repo=TNC_CA)
- **Step 2: Assessing Land Surface Temperature US Cities**: This script provides an automated way to summarize land surface temperature using Landsat. [Click here to run the code on Earth Engine.](https://code.earthengine.google.com/0f86a97b11bb4cc891ef784abf92a6ba?accept_repo=TNC_CA)
- **Step 3: US Urban Tree Inequality Viewer**: This app provides a view of the disparity in urban tree cover across 5,723 US cities, and presents the difference between urban tree cover, summer surface temperature, and income inequality in each city. [Click here to run the code on Earth Engine.](https://code.earthengine.google.com/?scriptPath=users%2FShree1175%2Ftnc_treeinequality%3AStep4_US_UrbanTreeInequality_Viewer) You can also download the code for the web app as a text file ("Code_US_Urban_Canopy_Viewer.js"). 

## Data
The "censusBlock_data" folder contains CSV files with tree canopy data for each U.S. urban area mapped ("censusBlock_urban_treeCanopy_CityName.csv"). Download your city of interest to view the data. The file "DataDescription.csv" describes the fields in the tree canopy CSV files.

To view the tree canopy data spatially, you will need to download spatial data for census blocks from the U.S. Census Bureau [here](https://www.census.gov/geographies/mapping-files.2020.html). Then, join the tree canopy CSV file to the respective city's census block level data on the field "census_block_GEOID". [This website](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) provides a description of the Block GEOIDs. 

You can also download a geodatabase with tree canopy data for all 100 studied U.S. urban areas [here.](https://knb.ecoinformatics.org/view/doi:10.5063/MS3R5F)

## Credits
Tanushree Biswas, Charlotte Stanley and Rob McDonald (2020). The Nature Conservancy. Please contact tanushree.biswas@tnc.org if you have any questions.
