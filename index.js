// Part 1 & 2
// Variable where the parsed JSON features will be stored. Initialised with an empty string
var weekly_features = "";

// Variable that keeps track of the week number. Initialised with 0
var week_tracker = 0;

// Get the JSON data
var week_xmlhttp = new XMLHttpRequest();
var week_url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,TotalweeklyVaccines,Moderna,Pfizer,Janssen,AstraZeneca,FullyPer_80_,FullyPer_Age70to79,FullyPer_Age60to69,FullyPer_Age50to59,FullyPer_Age40to49,FullyPer_Age30to39,FullyPer_Age20to29,FullyPer_Age10to19,FullyCum_80_,FullyCum_Age70to79,FullyCum_Age60to69,FullyCum_Age10to19,FullyCum_Age20to29,FullyCum_Age30to39,FullyCum_Age40to49,FullyCum_Age50to59&returnGeometry=false&outSR=4326&f=json";


week_xmlhttp.onreadystatechange = function() {
    if (week_xmlhttp.readyState == 4 && week_xmlhttp.status == 200) {
        
        //Parse the JSON data to a JavaScript variable. 
        var parsedJSON = JSON.parse(week_xmlhttp.responseText);  
        weekly_features = parsedJSON.features;  

        week_tracker = weekly_features.length - 1
        
        // Create the dropdown menu
        get_dropdown()
        
        // Get weekly vaccine data
        vax_total(week_tracker);
    }
};
    
week_xmlhttp.open("GET", week_url, true);
week_xmlhttp.send();


// Generates a dropdown menu so that the user can select the week they require data for
function get_dropdown(){
    var dropdown_content = "";
    
    // Creates a week number and date range for each row in the dropdown menu
    for (i = 1; i < weekly_features.length; i++) {
        dropdown_content += "<button type=\"button\" onclick=vax_total(" + i + ")>Week " + i + " (" + dates[i] + ") </button>"
    }

    document.getElementById("dropdown-content-week").innerHTML = dropdown_content
}

// Generates a table containing weekly vaccination information (total vaccinations up to that point, weekly total, by vaccine type)
function vax_total(user_week) {
    
    // Week_tracker represents the current week
    week_tracker = user_week

    // Variable to keep track of the total number of people vaccinated from the start of 2021 up to the current week
    var total_vaccinated = 0;

    var text = "<h3>Week " + week_tracker + " (" + dates[week_tracker] + ")</h3>" +
    "<table>" +
    "<tr align=center>" + 
    "<th>Total Vaccinated (cumulative)</th>" + 
    "<th>Total Vaccinated (this week)</th>" +  
    "</tr>"

    // Get the cumulative number vaccinated by looping through the weekly totals and adding each total to total_vaccinated
    for (i = 1; i <= week_tracker; i++){
        var attributes = weekly_features[i].attributes
        total_vaccinated += attributes.TotalweeklyVaccines
    }

    // Get vaccine data for this week only and store this data in an array
    this_week = weekly_features[week_tracker].attributes
    var this_week_values = [this_week.TotalweeklyVaccines, this_week.Moderna, this_week.Pfizer, this_week.Janssen, this_week.AstraZeneca]

    // Set up first table, which will give the cumulative and weekly vaccination figures
    text += "<tr align=center><td>" + numberWithCommas(total_vaccinated) + "</td>" + 
    "<td>" + numberWithCommas(this_week_values[0]) + "</td>";
    text += "</tr></table>"

    document.getElementById("Total_Vaccinated").innerHTML = text

    // Set up second table, which will give the weekly vaccination figures, split by vaccine type (Moderna, Pfizer etc.)
    var type_text = "<table>" +
    "<tr align=center>" + 
    "<th>Moderna</th>" + 
    "<th>Pfizer</th>" +
    "<th>Janssen</th>" + 
    "<th>Astra Zenaca</th>" + 
    "</tr>"

    // Add the type figures to the table
    for (j = 1; j < this_week_values.length; j++){
        type_text += "<td>" + numberWithCommas(this_week_values[j]) + "</td>"
    }

    type_text += "</tr></table>"
    
    document.getElementById("Vacced_by_type").innerHTML = type_text

    // Get the weekly age range data (cumulative) for the specified week, so that you are not looking at information pertaining to a different week in the age-range table
    by_age_cum()
}


// Generates a table of weekly vaccine data, grouped by age range (cumulative figures)
function by_age_cum() {

    // Change third table descriptor
    document.getElementById("cum-perc").innerHTML = "cumulative"

    // Set up third table, which gives cumulative vaccination figures by age group
    var age_text = "<table>" + 
    "<tr align=center>" + 
    "<th>10 - 19</th>" + 
    "<th>20 - 29</th>" + 
    "<th>30 - 39</th>" + 
    "<th>40 - 49</th>" +
    "<th>50 - 59</th>" + 
    "<th>60 - 69</th>" + 
    "<th>70 - 79</th>" + 
    "<th>80 +</th>" + 
    "</tr>" + 
    "<tr align = center>";

    // Get cumulative age data
    var this_week_age = weekly_features[week_tracker].attributes
    var this_week_age_values = [this_week_age.FullyCum_Age10to19, this_week_age.FullyCum_Age20to29, this_week_age.FullyCum_Age30to39, this_week_age.FullyCum_Age40to49, 
        this_week_age.FullyCum_Age50to59, this_week_age.FullyCum_Age60to69, this_week_age.FullyCum_Age70to79, this_week_age.FullyCum_80_]

    // Add the cumulative figures to the table
    for (j = 0; j < this_week_age_values.length; j++){

        // Output is zero in the case where we have null data
        if (this_week_age_values[j] === null) {
            age_text += "<td>" + 0 + "</td>"
        } else {
            age_text += "<td>" + numberWithCommas(this_week_age_values[j]) + "</td>"
        }
    }

    age_text += "</tr></table>"

    document.getElementById("Vacced_by_age").innerHTML = age_text
}
 

// Generates a table of weekly vaccine data, grouped by age range (cumulative figures)
function by_age_perc(){

    // Change third table descriptor
    document.getElementById("cum-perc").innerHTML = "proportion fully vaccinated in each age group"

    // Set up third table, which gives cumulative vaccination figures by age group
    var age_text = "<table>" + 
    "<tr align=center>" + 
    "<th>10 - 19</th>" + 
    "<th>20 - 29</th>" + 
    "<th>30 - 39</th>" + 
    "<th>40 - 49</th>" +
    "<th>50 - 59</th>" + 
    "<th>60 - 69</th>" + 
    "<th>70 - 79</th>" + 
    "<th>80 +</th>" + 
    "</tr>" + 
    "<tr align = center>";

    // Get percentage age data
    var this_week_age = weekly_features[week_tracker].attributes
    var this_week_age_values = [this_week_age.FullyPer_Age10to19, this_week_age.FullyPer_Age20to29, this_week_age.FullyPer_Age30to39, this_week_age.FullyPer_Age40to49, 
        this_week_age.FullyPer_Age50to59, this_week_age.FullyPer_Age60to69, this_week_age.FullyPer_Age70to79, this_week_age.FullyPer_80_]

    // Add the percent figures to the table
    for (j = 0; j < this_week_age_values.length; j++){
        age_text += "<td>" + Math.round((this_week_age_values[j] + Number.EPSILON) * 10000) / 100 + "% </td>"
    }

    age_text += "</tr></table>"

    document.getElementById("Vacced_by_age").innerHTML = age_text
}
    





















// Part 3 & 4
// Show weekly vaccination information and cumulative vaccination figures
var county_features = "";

// Array of county names and cases per 100000
var county_names = Array();
var per_hundred_thousand = Array()

// Variable to identify the index of the user-selected county. Initialised at 0
var selected_county_index = 0;

// Array to keep track of which counties are currently being displayed on the dashboard
var current_counties = Array(3)


// Get the JSON data
var county_xmlhttp = new XMLHttpRequest();
var county_url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,ConfirmedCovidCases,PopulationProportionCovidCases&returnGeometry=false&outSR=4326&f=json" 

county_xmlhttp.onreadystatechange = function() {
    if (county_xmlhttp.readyState == 4 && county_xmlhttp.status == 200) {
            
        //Parse the JSON data to a JavaScript variable. 
        var parsedJSON = JSON.parse(county_xmlhttp.responseText);  

        
        // Slice the features to account for duplicate entries (each county appears more than once in the data)
        county_features = slice_data(parsedJSON.features)

        
        // Create an array of county names and cases per 100000
        counties_and_cases()    


        // Create dropdown menus to allow the user to select specific counties for comparison
        create_dropdowns()

        
        // Insert the first three counties. These will be displayed on the dashboard by default when the user enters the site
        insert_data({row_num:1,county_name:county_names[0]})
        insert_data({row_num:2,county_name:county_names[1]})
        insert_data({row_num:3,county_name:county_names[2]})


        // Get highest number of cases per 10000 people
        get_max()
            

        // Get lowest number of cases per 100000 people
        get_min()
    }
};


county_xmlhttp.open("GET", county_url, true);
county_xmlhttp.send();

// Removes duplicate entries in the county data
function slice_data(arr) {
    // Reference: https://dev.to/pixari/what-is-the-best-solution-for-removing-duplicate-objects-from-an-array-4fe1
    let arr_new = arr.map(e => JSON.stringify(e))
    set_new = new Set(arr_new)
    cleaned_arr = [...set_new]
    cleaned = cleaned_arr.map(e => JSON.parse(e))
    return cleaned
}


// Get an array of counties and cases per 100000 people
// These arrays will be important in part 4, where we need to get the county with the highest cases per 100000 and the lowest
function counties_and_cases(){
    for (i = 0; i < county_features.length; i++){
        var attributes = county_features[i].attributes

        // Add the county names to the county_names array
        county_names.push(attributes.CountyName)

        // Add the cases per 100000 to the per_hundred_thousand array
        per_hundred_thousand.push( Math.round( (attributes.PopulationProportionCovidCases + Number.EPSILON) * 100 ) / 100 )
    }
}


// Creates three dropdown menus to enable the user to select three counties for comparison
function create_dropdowns(){

    // Each iteration of the loop corresponds to one of the dropdown menus
    for (i = 1; i < 4; i++) {
        var dropdown_content = "";

        // Create a seperate row in the dropdown menu for each county
        for (j = 0; j < county_features.length; j++) {
            dropdown_content += "<button type=\"button\" onclick=insert_data({row_num:" + 
            i + ",county_name:\"" + county_names[j] + "\"})>" + county_names[j] + "</button>"
        }

        // Put the dropdown menu in the element with id=dropdown_county_i, where i corresponds to the dropdown menu number
        var row_name = "dropdown_county_" + i
        document.getElementById(row_name).innerHTML = dropdown_content;
    }
}


// Insert a county row into the counties table in the dashboard
// This function will be called three times at the start to display the first three counties by default
function insert_data(args){
    row_num = args.row_num
    county_name = args.county_name

    // If statement to prevent more than one row with the same data appearing on the dashboard
    if (!(current_counties.includes(county_name))){

        // Overwrite the current county in the row specified by row_num
        current_counties[row_num - 1] = county_name
        var store_text = "";
        var table_row_name = "county_" + row_num;
        document.getElementById(table_row_name).innerHTML = "";

        // Get the index of the county specified by the user
        selected_county_index = county_names.indexOf(county_name)

        // Extract the features for that particular county and put them into the dashboard
        var info = county_features[selected_county_index].attributes;
        var data = [info.CountyName, numberWithCommas(info.PopulationCensus16), numberWithCommas(info.ConfirmedCovidCases), per_hundred_thousand[selected_county_index]];
        for (i = 0; i < data.length; i++){
            store_text += "<td>" + data[i] + "</td>"
        }
            
        document.getElementById(table_row_name).innerHTML = store_text;
    }
}


// Get county with the highest cases per 100000
function get_max(){

    // Get the highest value per 100000, then get the index of this value, then get the county name using this index
    var max_value = Math.max(...per_hundred_thousand)
    var max_index = per_hundred_thousand.indexOf(max_value)
    var max_county = county_names[max_index]

    document.getElementById("max_county").innerHTML = max_county + " (" + max_value + " cases per 100,000 people)"
}


// Get county with the lowest cases per 100000
function get_min(){

    // Get the highest value per 100000, then get the index of this value, then get the county name using this index
    var min_value = Math.min(...per_hundred_thousand)
    var min_index = per_hundred_thousand.indexOf(min_value)
    var min_county = county_names[min_index]

    document.getElementById("min_county").innerHTML = min_county + " (" + min_value + " cases per 100,000 people)"
}


// Convert numbers into numbers with commas for presentation purposes
// Reference: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


// Date ranges required to construct the dropdown menu from Part 1
// Source: https://www.epochconverter.com/weeks/2021
var dates = ["December 28, 2020	- January 3, 2021",
"January 4, 2021 - January 10, 2021",
"January 11, 2021 - January 17, 2021",
"January 18, 2021 - January 24, 2021",
"January 25, 2021 - January 31, 2021",
"February 1, 2021 - February 7, 2021",
"February 8, 2021 - February 14, 2021",
"February 15, 2021 - February 21, 2021",
"February 22, 2021 - February 28, 2021",
"March 1, 2021 - March 7, 2021",
"March 8, 2021 - March 14, 2021",
"March 15, 2021 - March 21, 2021",
"March 22, 2021 - March 28, 2021",
"March 29, 2021 - April 4, 2021",
"April 5, 2021 - April 11, 2021",
"April 12, 2021 - April 18, 2021",
"April 19, 2021 - April 25, 2021",
"April 26, 2021 - May 2, 2021",
"May 3, 2021 - May 9, 2021",
"May 10, 2021 - May 16, 2021",
"May 17, 2021 - May 23, 2021",
"May 24, 2021 - May 30, 2021",
"May 31, 2021 - June 6, 2021",
"June 7, 2021 - June 13, 2021",
"June 14, 2021 - June 20, 2021",
"June 21, 2021 - June 27, 2021",
"June 28, 2021 - July 4, 2021",
"July 5, 2021 - July 11, 2021",
"July 12, 2021 - July 18, 2021",
"July 19, 2021 - July 25, 2021",
"July 26, 2021 - August 1, 2021",
"August 2, 2021 - August 8, 2021",
"August 9, 2021 - August 15, 2021",
"August 16, 2021 - August 22, 2021",
"August 23, 2021 - August 29, 2021",
"August 30, 2021 - September 5, 2021",
"September 6, 2021 - September 12, 2021",
"September 13, 2021 - September 19, 2021",
"September 20, 2021 - September 26, 2021",
"September 27, 2021 - October 3, 2021",
"October 4, 2021 - October 10, 2021",
"October 11, 2021 - October 17, 2021",
"October 18, 2021 - October 24, 2021",
"October 25, 2021 - October 31, 2021",
"November 1, 2021 - November 7, 2021",
"November 8, 2021 - November 14, 2021",
"November 15, 2021 - November 21, 2021",
"November 22, 2021 - November 28, 2021",
"November 29, 2021 - December 5, 2021",
"December 6, 2021 - December 12, 2021",
"December 13, 2021 - December 19, 2021",
"December 20, 2021 - December 26, 2021",
"December 27, 2021 - January 2, 2022",
"January 3, 2022 - January 9, 2022",
"January 10, 2022 - January 16, 2022",
"January 17, 2022 - January 23, 2022",
"January 24, 2022 - January 30, 2022",
"January 31, 2022 - February 6, 2022",
"February 7, 2022 - February 13, 2022",
"February 14, 2022 - February 20, 2022",
"February 21, 2022 - February 27, 2022",
"February 28, 2022 - March 6, 2022",
"March 7, 2022 - March 13, 2022",
"March 14, 2022 - March 20, 2022",
"March 21, 2022 - March 27, 2022",
"March 28, 2022 - April 3, 2022",
"April 4, 2022 - April 10, 2022",
"April 11, 2022 - April 17, 2022",
"April 18, 2022 - April 24, 2022",
"April 25, 2022 - May 1, 2022",
"May 2, 2022 - May 8, 2022",
"May 9, 2022 - May 15, 2022",
"May 16, 2022 - May 22, 2022",
"May 23, 2022 - May 29, 2022",
"May 30, 2022 - June 5, 2022",
"June 6, 2022 - June 12, 2022",
"June 13, 2022 - June 19, 2022",
"June 20, 2022 - June 26, 2022",
"June 27, 2022 - July 3, 2022",
"July 4, 2022 - July 10, 2022",
"July 11, 2022 - July 17, 2022",
"July 18, 2022 - July 24, 2022",
"July 25, 2022 - July 31, 2022",
"August 1, 2022 - August 7, 2022",
"August 8, 2022 - August 14, 2022",
"August 15, 2022 - August 21, 2022",
"August 22, 2022 - August 28, 2022",
"August 29, 2022 - September 4, 2022",
"September 5, 2022 - September 11, 2022",
"September 12, 2022 - September 18, 2022",
"September 19, 2022 - September 25, 2022",
"September 26, 2022 - October 2, 2022",
"October 3, 2022 - October 9, 2022",
"October 10, 2022 - October 16, 2022",
"October 17, 2022 - October 23, 2022",
"October 24, 2022 - October 30, 2022",
"October 31, 2022 - November 6, 2022",
"November 7, 2022 - November 13, 2022",
"November 14, 2022 - November 20, 2022",
"November 21, 2022 - November 27, 2022",
"November 28, 2022 - December 4, 2022",
"December 5, 2022 - December 11, 2022",
"December 12, 2022 - December 18, 2022",
"December 19, 2022 - December 25, 2022",
"December 26, 2022 - January 1, 2023"]