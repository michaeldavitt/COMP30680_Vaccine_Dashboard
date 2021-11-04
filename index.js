// Part 1 & 2
// Global variables for storing information that will be used by the functions below
var weekly_features = "";
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
    
    for (i = 0; i < weekly_features.length; i++) {
        dropdown_content += "<button type=\"button\" onclick=vax_total(" + i + ")>Week " + i + " (" + dates[i] + ") </button>"
    }

    document.getElementById("dropdown-content-week").innerHTML = dropdown_content
}

// Generates a table containing weekly vaccination information (total vaccinations up to that point, weekly total, by vaccine type)
function vax_total(user_week) {
    week_tracker = user_week

    var total_vaccinated = 0;

    var text = "<h3>Week " + week_tracker + " (" + dates[week_tracker] + ")</h3>" +
    "<table cellpadding=10>" +
    "<tr align=center>" + 
    "<th>Total Vaccinated (cumulative)</th>" + 
    "<th>Total Vaccinated (this week)</th>" +  
    "</tr>"

    // Get the cumulative number vaccinated
    for (i = 0; i <= week_tracker; i++){
        var attributes = weekly_features[i].attributes
        total_vaccinated += attributes.TotalweeklyVaccines
    }

    // Get vaccine data for this week only
    this_week = weekly_features[week_tracker].attributes
    var this_week_values = [this_week.TotalweeklyVaccines, this_week.Moderna, this_week.Pfizer, this_week.Janssen, this_week.AstraZeneca]
    text += "<tr align=center><td>" + numberWithCommas(total_vaccinated) + "</td>" + 
    "<td>" + numberWithCommas(this_week_values[0]) + "</td>";
    text += "</tr></table>"

    document.getElementById("Total_Vaccinated").innerHTML = text

    var type_text = "<table cellpadding=10>" +
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
    var age_text = "<table border=1 cellpadding=10>" + 
    "<tr align=center>" + 
    "<th>10 - 19</th>" + 
    "<th>20 -29</th>" + 
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
    var age_text = "<table border=1 cellpadding=10>" + 
    "<tr align=center>" + 
    "<th>10 - 19</th>" + 
    "<th>20 -29</th>" + 
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

// Get a list of county names and cases per 100000
// Also get the index of the county provided as an argument to the function
var county_names = Array();
var per_hundred_thousand = Array()
var selected_county_index = 0;


// Get the JSON data
var county_xmlhttp = new XMLHttpRequest();
var county_url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=PopulationProportionCovidCases,PopulationCensus16,ConfirmedCovidCases,CountyName&returnGeometry=false&outSR=4326&f=json" 

county_xmlhttp.onreadystatechange = function() {
    if (county_xmlhttp.readyState == 4 && county_xmlhttp.status == 200) {
            
        //Parse the JSON data to a JavaScript variable. 
        var parsedJSON = JSON.parse(county_xmlhttp.responseText);  

        
        // Slice the features to account for duplicate entries (each county appears twice in the data)
        county_features = slice_data(parsedJSON.features)

        
        // Create an array of county names and cases per 100000
        counties_and_cases()    


        // Create dropdown menus 
        create_dropdowns()
            

        // Get highest number of cases per 10000 people
        get_max()
            

        // Get lowest number of cases per 100000 people
        get_min()
    }
};


county_xmlhttp.open("GET", county_url, true);
county_xmlhttp.send();

function slice_data(arr) {
    // Function for removing duplicate entries in the county data
    // Reference: https://dev.to/pixari/what-is-the-best-solution-for-removing-duplicate-objects-from-an-array-4fe1
    let arr_new = arr.map(e => JSON.stringify(e))
    set_new = new Set(arr_new)
    cleaned_arr = [...set_new]
    cleaned = cleaned_arr.map(e => JSON.parse(e))
    return cleaned
}

function counties_and_cases(){
    for (i = 0; i < county_features.length; i++){
        var attributes = county_features[i].attributes
        county_names.push(attributes.CountyName)
        per_hundred_thousand.push( Math.round( (attributes.PopulationProportionCovidCases + Number.EPSILON) * 100 ) / 100 )
    }
}

function create_dropdowns(){
    // Loop through 1-3, get element by id for each dropdown content, each should have a button with arguments county name and row number
    for (i = 1; i < 4; i++) {
        var dropdown_content = "";
        for (j = 0; j < county_features.length; j++) {
            dropdown_content += "<button type=\"button\" onclick=insert_data({row_num:" + 
            i + ",county_name:\"" + county_names[j] + "\"})>" + county_names[j] + "</button>"
        }

        var row_name = "dropdown_county_" + i
        document.getElementById(row_name).innerHTML = dropdown_content;
    }
}

function insert_data(args){
    row_num = args.row_num
    county_name = args.county_name
    // Get the element by id using county_row_num
    // Find the county's feature by looping through the features and storing the index when there's a match
    // Then, find the rest of the data for that county and but it in a td inside the tr selected
    var store_text = "";
    var table_row_name = "county_" + row_num;
    document.getElementById(table_row_name).innerHTML = "";

    selected_county_index = get_county_index(county_name)

    var info = county_features[selected_county_index].attributes;
    var data = [row_num, info.CountyName, numberWithCommas(info.PopulationCensus16), numberWithCommas(info.ConfirmedCovidCases), per_hundred_thousand[selected_county_index]];
    for (i = 0; i < data.length; i++){
        store_text += "<td>" + data[i] + "</td>"
    }
        
    document.getElementById(table_row_name).innerHTML = store_text;
}

function get_county_index(county_name){
    for (i=0; i<county_names.length; i++){
        if (county_names[i] === county_name){
            return i;
        }
    }
}

function get_max(){
    var max_value = Math.max(...per_hundred_thousand)
    var max_index = per_hundred_thousand.indexOf(max_value)
    var max_county = county_names[max_index]

    document.getElementById("max_county").innerHTML = max_county + " (" + max_value + " cases per 100,000 people)"
}

function get_min(){
    var min_value = Math.min(...per_hundred_thousand)
    var min_index = per_hundred_thousand.indexOf(min_value)
    var min_county = county_names[min_index]

    document.getElementById("min_county").innerHTML = min_county + " (" + min_value + " cases per 100,000 people)"
}


// Reference: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
"December 27, 2021 - January 2, 2022"]