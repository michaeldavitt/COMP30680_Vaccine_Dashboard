# Assignment 2: JavaScript and JSON

## Introduction
This assignment required us to create a webpage that displays COVID-19 information obtained via Ireland's COVID-19 Data Hub. The purpose of this readme file is to describe how I have designed the solution to this problem. For more detailed implementation details, please refer to the comments included in index.js and dashboard.html.

## Dashboard.html
Dashboard.html is split into two sections. In the first section, vaccination data is displayed. The user has the option to select vaccination information for a specific week. This section also includes the total number of people fully vaccinated in each age group, and the user is able to choose whether this information is presented as a total number or as a percentage within the age group. Importantly, the user does not need to reload the site in order to access this information. 

There are a number of div elements in this section belonging to class = "table-wrapper". Data from index.js will be read into these div elements as soon as the user opens the page. The same is true for the div element belonging to class = "dropdown-content". Data is inserted using document.getElementById("id").innerHTML = new_content in the index.js file.

In the second section, county statistics are displayed. The user can select specific counties and view more detailed COVID case numbers for this county. Again, divs belonging to class = "table-wrapper" and class = "dropdown-content" are empty until the user opens the webpage, at which point data is read into these div elements. At the end of dashboard.html, the index.js script is called using the script tags. This facilitates the automatic loading-in of data sent via the aforementioned API.

## Index.js 
When this script is loaded, a XMLHTTP request is sent to the API and the API response is parsed into a JavaScript object and assigned to a global variable. Immediately after this, a few custom functions are called in order to display certain pieces of information by default when the user first opens the webpage. Details of all custom functions are provided below, with more detailed implementation information available in the comments in the index.js file

### Section 1 - Vaccination Information

#### Get_dropdown
This function iterates through the parsed JS object and an array of date ranges, finds the week numbers in the JS object, and creates a button for each week. The date array is hard-coded as it was not available in the API, but the week numbers are read in directly from the API. These buttons are then provided to dashboard.html as dropdown menu items. When the user clicks on the dropdown menu on the website, they will be able to see all available weeks, along with their corresponding date ranges. When the user clicks on one of these buttons, the function vax_total is called with the function argument = week number. Vax_total is described below. This function is called only once, when the user loads the page

Dropdown reference: https://www.w3schools.com/css/css_dropdowns.asp

#### Vax_total
This function takes in a week number as a formal parameter. It then iterates through the total vaccination figures from the first week up to and including the selected week, adds each total to a grand total variable, and sends the grand total to the dashboard to be displayed. It then searches through the row corresponding to the selected week in the JS object and displays information relevent to that week. This function (along with others) call the numbersWithCommas function with the data provided as the argument, which adds commas to the numbers that are greater than or equal to 1,000 for presentation purposes. Finally, the vax_total function calls the by_age_cum() function so that the table displaying vaccination data by age range is showing the information for the same week as the table we created using the vax_total function. This function is called as soon as the webpage is loaded, and is called again whenever the user selects a week from the dropdown menu

#### By_age_cum and by_age_perc
Both these functions operate in a similar way. The only difference is that by_age_cum outputs total figures and by_age_perc outputs percentage figures. Both functions isolate the selected week (which was stored previously in the "week_tracker" variable) in the JS object. They then search through this week and obtain the relevant figures (total/percenatage age data), which are then displayed on the webpage. These functions can both be called by the user when they click the buttons labels "Cumulative" and "Percentage" underneath the weekly vaccination information table created by vax_total(). By_age_cum() is also called by the vax_total() function once it has finished creating the weekly vaccination information table. By_age_perc() makes use of Math.round(), a built-in JS function that allows for numbers to be displayed as decimals with 2 significant figures.

### Section 2 - County Statistics

#### Slice_data
When the data is read in from the API, the counties are sometimes repeated. In order to solve this problem, the parsed JS object is fed into the slice_data() function. This function converts the JS object into a string using JSON.stringify, maps this string into an array using map(), converts this array into a set using new Set(array) to make sure all elements are unique (this is a requirement of sets), and then converts it back into an array, then back into an object, and returns the object. This function is called only once, immediately after the data is read in from the API. 

#### Counties_and_cases
Loops through the parsed JS object and obtains a list of county names and cases per hundred thousand for use in other functions. These lists are global and thus is accessible by any function.

#### Create_dropdowns
Creates three different dropdown menus, each containing all possible counties that can be selected by the user. Functions similarly to the create_dropdown function in the previous section. The main difference is that the function provided to the dropdown menu is insert_data(), which is described below.

#### Insert_data
This function takes two arguments, a row number and a county name. It then checks to make sure that the county name is not already being displayed on the page. If the county is not currently being displayed, the function finds the row index of that county using indexOf. It uses this information to isolate the row in the parsed JS object corresponding to the selected county. It then displays the county information in the specified row in the county statistics table

#### Get_max and get_min
These functions operate in a similar manner. Both search through all cases per hundred thousand, find the max/min value using Math.max and Math.min, get the index of this value using indexOf, and then, using this index, gets the name of the county with the max/min cases per hundred thousand. They then display the max/min county name and the per hundred thousand value.

#### NumbersWithCommas
Function that takes in a number, converts it to a string, then uses RegEx to insert commas in the numbers.

Reference: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript