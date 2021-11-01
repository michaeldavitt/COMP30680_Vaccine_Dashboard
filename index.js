
// Part 1 & 2
// Show weekly vaccination information and cumulative vaccination figures
function weekly_info(args){
    // Get data used to ensure that toggling the cum/perc button doesn't result in a re-population of the vaccine type table
    // User week is used to ensure that we are targetting the week selected by the user (most recent week by default)
    // Cum_perc allows us to toggle between cumulative and percentage data in the age table
    var get_data = args.get_data
    var user_week = args.user_week
    var cum_perc = args.cum_perc

    // Get the JSON data
    var xmlhttp = new XMLHttpRequest();
    var url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,TotalweeklyVaccines,Moderna,Pfizer,Janssen,AstraZeneca,FullyPer_80_,FullyPer_Age70to79,FullyPer_Age60to69,FullyPer_Age50to59,FullyPer_Age40to49,FullyPer_Age30to39,FullyPer_Age20to29,FullyPer_Age10to19,FullyCum_80_,FullyCum_Age70to79,FullyCum_Age60to69,FullyCum_Age10to19,FullyCum_Age20to29,FullyCum_Age30to39,FullyCum_Age40to49,FullyCum_Age50to59&returnGeometry=false&outSR=4326&f=json";


    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            var parsedJSON = JSON.parse(xmlhttp.responseText);  
            var features = parsedJSON.features;  

            // Create the dropdown menu
            get_dropdown(features)


            // This is to ensure that the page automatically displays the information for the most recent week when first loaded
            // It also ensures that when the cumulative/percentage buttons are toggled, it doesn't revert back to the most recent week
            var week_tracker = parseInt(document.getElementById("week_tracker").innerHTML)

            // Evaulates to true when page is first loaded or when the cumulative/percent button is toggled
            if (user_week === -1) {

                // Evaluates to true when the page is first loaded
                if(week_tracker === -1) {
                    document.getElementById("week_tracker").innerHTML = features.length - 1
                    user_week = parseInt(document.getElementById("week_tracker").innerHTML)
                } 
                
                // When the cumulative/percent button is toggled, the user week becomes the week stored in the week tracker element
                else {
                    user_week = parseInt(document.getElementById("week_tracker").innerHTML)
                }
                
            } else {
                // Assigns the week tracker element to the week selected by the user
                // This is necessary as when we toggle the cumulative/percent button, it will get the data from the week stored in the week tracker element
                document.getElementById("week_tracker").innerHTML = user_week
            }
            
            // This condition evaluates to false when we don't want to repopulate the first table (vaccine types and totals)
            if (get_data===true) {
                vax_total(features, user_week);
            }

            by_age(features, user_week)
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function get_dropdown(features){
        var dropdown_content = "";
        for (i = 0; i < features.length; i++) {
            dropdown_content += "<button type=\"button\" onclick=weekly_info({get_data:true,cum_perc:true,user_week:" + i + "})>Week " + i + " (" + dates[i] + ") </button>"
        }

        document.getElementById("dropdown-week").innerHTML = dropdown_content
    }

    // Generates a table containing vaccination information
    function vax_total(response, user_week) {
        var total_vaccinated = 0;

        var text = "";

        text += "<table border=1 cellpadding=10>" +
        "<tr align=center>" + 
        "<th>Total Vaccinated (cumulative)</th>" + 
        "<th>Total Vaccinated (this week)</th>" + 
        "<th>Moderna</th>" + 
        "<th>Pfizer</th>" +
        "<th>Janssen</th>" + 
        "<th>Astra Zenaca</th>" + 
        "</tr>"

        // Get the cumulative number vaccinated
        for (i = 0; i <= user_week; i++){
            var week = response[i]
            var attributes = week.attributes
            total_vaccinated += attributes.TotalweeklyVaccines
        }

        this_week = response[user_week].attributes
        var this_week_values = [this_week.TotalweeklyVaccines, this_week.Moderna, this_week.Pfizer, this_week.Janssen, this_week.AstraZeneca]
        text += "<tr align=center><td>" + numberWithCommas(total_vaccinated) + "</td>";

        // Add the cumulative figures to the table
        for (j = 0; j < this_week_values.length; j++){
            text += "<td>" + numberWithCommas(this_week_values[j]) + "</td>"
        }

        text += "</tr></table>"
        
        document.getElementById("Total_Vaccinated").innerHTML = text
    }

    function by_age(response, user_week) {
        var age_text = "";

        age_text += "<table border=1 cellpadding=10>" + 
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
        if (cum_perc) {
            var this_week_age = response[user_week].attributes
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

        } 
        
        // Get percentage age data
        else {
            var this_week_age = response[user_week].attributes
            var this_week_age_values = [this_week_age.FullyPer_Age10to19, this_week_age.FullyPer_Age20to29, this_week_age.FullyPer_Age30to39, this_week_age.FullyPer_Age40to49, 
                this_week_age.FullyPer_Age50to59, this_week_age.FullyPer_Age60to69, this_week_age.FullyPer_Age70to79, this_week_age.FullyPer_80_]

            // Add the percent figures to the table
            for (j = 0; j < this_week_age_values.length; j++){
                age_text += "<td>" + Math.round((this_week_age_values[j] + Number.EPSILON) * 10000) / 100 + "% </td>"
            }

        }

        age_text += "</tr></table>"

        document.getElementById("Vacced_by_age").innerHTML = age_text
    }
}





















// Part 3 & 4
// Show weekly vaccination information and cumulative vaccination figures
function county_info(args){
    // Args will be 2 values, a county name and a row number
    row_num = args.row_num
    county_name = args.county_name

    // Get the JSON data
    var xmlhttp = new XMLHttpRequest();
    var url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=PopulationProportionCovidCases,PopulationCensus16,ConfirmedCovidCases,CountyName&returnGeometry=false&outSR=4326&f=json" 

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            var parsedJSON = JSON.parse(xmlhttp.responseText);  
            var features = parsedJSON.features

            // Slice the features to account for duplicate entries (each county appears twice in the data)
            var sliced_features = slice_data(features)

            // Get a list of county names and cases per 100000
            // Also get the index of the county provided as an argument to the function
            var county_names = Array();
            var per_hundred_thousand = Array()
            var selected_county_index = 0;
            
            for (i = 0; i < sliced_features.length; i++){
                var attributes = sliced_features[i].attributes
                county_names.push(attributes.CountyName)
                per_hundred_thousand.push( Math.round( (attributes.PopulationProportionCovidCases + Number.EPSILON) * 100 ) / 100 )

                // Find the index of the county we are interested in for data extraction
                if (attributes.CountyName === county_name) {
                    selected_county_index = i
                }
            }

            // Create dropdown menus 
            create_dropdowns(county_names, sliced_features);
            
            // Insert the required data
            insert_data(sliced_features, selected_county_index, per_hundred_thousand)
            

            // Get highest number of cases per 10000 people
            get_max(per_hundred_thousand, county_names)
            

            // Get lowest number of cases per 100000 people
            get_min(per_hundred_thousand, county_names)
        }
    };

    function slice_data(arr) {
        // Function for removing duplicate entries in the county data
        // Reference: https://dev.to/pixari/what-is-the-best-solution-for-removing-duplicate-objects-from-an-array-4fe1
        let arr_new = arr.map(e => JSON.stringify(e))
        set_new = new Set(arr_new)
        cleaned_arr = [...set_new]
        cleaned = cleaned_arr.map(e => JSON.parse(e))
        return cleaned
    }

    function create_dropdowns(county_names, sliced_features){
        // Loop through 1-3, get element by id for each dropdown content, each should have a button with arguments county name and row number
        for (i = 1; i < 4; i++) {
            var dropdown_content = "";
            for (j = 0; j < sliced_features.length; j++) {
                dropdown_content += "<button type=\"button\" onclick=county_info({row_num:" + 
                i + ",county_name:\"" + county_names[j] + "\"})>" + county_names[j] + "</button>"
            }

            var row_name = "dropdown_county_" + i
            document.getElementById(row_name).innerHTML = dropdown_content;
        }
    }

    function insert_data(sliced_features, selected_county_index, per_hundred_thousand){
        // Get the element by id using county_row_num
        // Find the county's feature by looping through the features and storing the index when there's a match
        // Then, find the rest of the data for that county and but it in a td inside the tr selected
        if (county_name) {
            var store_text = "";
            var table_row_name = "county_" + row_num;
            document.getElementById(table_row_name).innerHTML = "";

            var info = sliced_features[selected_county_index].attributes;
            var data = [row_num, info.CountyName, numberWithCommas(info.PopulationCensus16), 
                numberWithCommas(info.ConfirmedCovidCases), per_hundred_thousand[selected_county_index]];
            for (i = 0; i < data.length; i++){
                store_text += "<td>" + data[i] + "</td>"
            }
            
            document.getElementById(table_row_name).innerHTML = store_text;
        }
    }

    function get_max(per_hundred_thousand, county_names){
        var max_value = Math.max(...per_hundred_thousand)
        var max_index = per_hundred_thousand.indexOf(max_value)
        var max_county = county_names[max_index]

        document.getElementById("max_county").innerHTML = max_county + " (" + max_value + " cases per 100,000 people)"
    }

    function get_min(per_hundred_thousand, county_names){
        var min_value = Math.min(...per_hundred_thousand)
        var min_index = per_hundred_thousand.indexOf(min_value)
        var min_county = county_names[min_index]

        document.getElementById("min_county").innerHTML = min_county + " (" + min_value + " cases per 100,000 people)"
    }
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
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