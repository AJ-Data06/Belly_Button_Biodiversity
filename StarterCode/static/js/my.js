my.js
//activity 01//

function init() {
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

        var filterData = data.samples.filter(function(el) {
            return (el.id === dropdownValue)
        });
        var results = filterData[0]

        var top_ten_otu_ids = results.otu_ids.slice(0, 10).map(numericIds => {
            return 'OTU ' + numericIds;
          }).reverse();
        
        var labels = results.otu_labels.slice(0, 10).reverse();
        
  
        var values = results.sample_values.slice(0, 10).reverse();
        
        var trace = {
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

        var otu_ids_bubble = results.otu_ids.map(id => id).reverse();
        var labels_bubble = results.otu_labels.reverse();
        var values_bubble = results.sample_values.reverse();

        var trace1 = {
            x: otu_ids_bubble,
            y: values_bubble,
            text: labels_bubble,               
            mode: "marker",
            marker: {
                color: otu_ids_bubble,
                size: values_bubble
            }
        };

        var data1 = [trace1];

        var layout1 = {
            showlegend: false
        }
        Plotly.newPlot("bubble", data1);

        ///*Appending the values to the panel//

        var resultArray = data.metadata.filter(sampleObj => sampleObj.id == dropdownValue);
        var result = resultArray[0];

        Object.entries(result).forEach(([key, value]) => {

            PANEL.append("p").text(key.toUpperCase() + ': ' + value); 
        })
    
        

    });
  }



