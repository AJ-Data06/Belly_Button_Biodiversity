
//activity 01//

function init() {                                  //Creating the initial function to populate the dropdown from the names from the JSON data//
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      //console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })};
  
  init();

 d3.select("#selDataset").on("change", updatePage); 

  function updatePage() {
      var dropdownMenu = d3.select("#selDataset");            // selecting the dropdown//
      var dropdownValue = dropdownMenu.property("value");     //Getting the value for dropdown//
      var PANEL = d3.select("#sample-metadata");              // Selecting the panel for displaying the demo data//
      //console.log(dropdownMenu);
      console.log(dropdownValue);
      
      d3.json("samples.json").then((data) => {              //Accessing the JSON data//

        ///*Appending the values to the panel//
        var metadata = data.metadata;                                                      //Accessing the metadata inside the JSON//
        var resultArray = metadata.filter(sampleObj => sampleObj.id == dropdownValue);    //filtering data relevent to the input value//
        var result = resultArray[0];                                                      //selecting the first result, cause two array of objects are appearing//


        PANEL.html("");    //clearing the panel for using it again//

        Object.entries(result).forEach(([key, value]) => {      //looping the result and getting the keys and values for the relevent input value.//

            PANEL.append("p").text(key.toUpperCase() + ': ' + value);   //Appending those values to the panel /// 
        })

        var filterData = data.samples.filter(function(el) {     //filtering the data from samples array of objects//
            return (el.id === dropdownValue)
        });
        var results = filterData[0]   //selecting the first array//

        var top_ten_otu_ids = results.otu_ids.slice(0, 10).map(numericIds => {   //slicing the first 10, data is already sorted.//
            return 'OTU ' + numericIds;
          }).reverse();
        
        var labels = results.otu_labels.slice(0, 10).reverse();  //getting the first 10 labels//
        
  
        var values = results.sample_values.slice(0, 10).reverse();   //getting the first 10 values//
        
        var trace = {           //creating the horizontal bar//
            x: values,
            y: top_ten_otu_ids,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        
        var data = [trace];

        var layout = {
            title: "Top 10 otu's"
        };

        
        Plotly.newPlot("bar", data, layout);

        var otu_ids_bubble = results.otu_ids.map(id => id).reverse();  //getting the otu_ids,labels and sample_values for the bubble chart(all the values for the sample)//
        var labels_bubble = results.otu_labels.reverse();
        var values_bubble = results.sample_values.reverse();

        var trace1 = {                                  //Creating the bubble chart//
            x: otu_ids_bubble,
            y: values_bubble,
            text: labels_bubble,               
            mode: "markers",
            marker: {
                color: otu_ids_bubble,
                size: values_bubble
            }
        };

        var data1 = [trace1];

        var layout1 = {
            showlegend: false,
            title: "OTU_ID"
        }
        Plotly.newPlot("bubble", data1, layout1);

        
    
        

    });
  }



