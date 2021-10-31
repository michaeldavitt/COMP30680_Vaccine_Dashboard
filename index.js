// Show weekly vaccination information and cumulative vaccination figures
function weekly_info(args){
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
            var dropdown_content = "";
            for (i = 0; i < features.length; i++) {
                dropdown_content += "<button type=\"button\" onclick=weekly_info({cum_perc:true,user_week:" + i + "})>Week " + i + " (" + dates[i] + ") </button>"
            }

            document.getElementById("dropdown-week").innerHTML = dropdown_content


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
            
            vax_total(features, user_week);
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

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

        var this_week = [attributes.TotalweeklyVaccines, attributes.Moderna, attributes.Pfizer, attributes.Janssen, attributes.AstraZeneca]
        text += "<tr align=center><td>" + total_vaccinated + "</td>";

        // Add the cumulative figures to the table
        for (j = 0; j < this_week.length; j++){
            text += "<td>" + this_week[j] + "</td>"
        }

        text += "</tr></table>"
        
        document.getElementById("Total_Vaccinated").innerHTML = text

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
            var this_week_age = [attributes.FullyCum_Age10to19, attributes.FullyCum_Age20to29, attributes.FullyCum_Age30to39, attributes.FullyCum_Age40to49, 
                attributes.FullyCum_Age50to59, attributes.FullyCum_Age60to69, attributes.FullyCum_Age70to79, attributes.FullyCum_80_]

            // Add the cumulative figures to the table
            for (j = 0; j < this_week_age.length; j++){
                age_text += "<td>" + this_week_age[j] + "</td>"
            }

        } 
        
        // Get percentage age data
        else {
            var this_week_age = [attributes.FullyPer_Age10to19, attributes.FullyPer_Age20to29, attributes.FullyPer_Age30to39, attributes.FullyPer_Age40to49, 
                attributes.FullyPer_Age50to59, attributes.FullyPer_Age60to69, attributes.FullyPer_Age70to79, attributes.FullyPer_80_]

            // Add the percent figures to the table
            for (j = 0; j < this_week_age.length; j++){
                age_text += "<td>" + Math.round(this_week_age[j] * 100) + "% </td>"
            }

        }

        age_text += "</tr></table>"

        document.getElementById("Vacced_by_age").innerHTML = age_text
    }
}


// Show weekly vaccination information and cumulative vaccination figures
function county_info(args){

    // Get the JSON data
    var xmlhttp = new XMLHttpRequest();
    var url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,ConfirmedCovidCases,PopulationProportionCovidCases&returnGeometry=false&outSR=4326&f=json"

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            var parsedJSON = JSON.parse(xmlhttp.responseText);  
            var features = parsedJSON.features;  
            var attributes = features[0].attributes
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
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