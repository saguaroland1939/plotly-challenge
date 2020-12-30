// This script reads in data.js (will be switched to samples.json), parses data of interest
// and builds two interactive charts (a horizontal bar chart and a bubble chart). A drop-down menu, implemented in index.html
// allows the user to select which dataset (individual) to display. Both charts are updated simultaneously with the user's selection.

// Keys of interest from dataset:
// names: list of study participant IDs
// metadata: demographics for each participant
// otu_ids: list of OTUs present in a sample (numeric code)
// otu_labels: list of text labels for each otu found in a sample
// sample_values: list containing the count associated with each OTU found in a sample

// Import JavaScript object from data.js
var results = data;

// Read in first name from names array. Will be used in drop-down menu.
var nameDefault = results.names[0];

// Select element in index.html where metadata will be appended
var metadataElement = d3.select("ul");

// Extract values from first metadata object and convert to array
var metadataDefault = Object.entries(results.metadata[0]);
metadataDefault.forEach(function([key, value])
{
    var metadataItem = metadataElement.append("li");
    metadataItem.text(`${key}: ${value}`);
});

// Extract otu_ids and convert to formatted string to be used as categorical y-values
var otu_idsDefault = results.samples[0].otu_ids;
otu_idsDefaultText = otu_idsDefault.map(x => `OTU-${x}`);

// Extract sample_values to be used as x-values
var measurementsDefault = results.samples[0].sample_values;

// Extract otu_labels to be used as hovertext
var hoverDefault = results.samples[0].otu_labels;

// Combine otu_idsDefaultText, measurementsDefault, and hoverDefault arrays into an array of objects so
// they can be sorted simultaneously
var combinedLists = [];
for (var i = 0; i < otu_idsDefaultText.length; i++)
{
    combinedLists.push({"otu_idsDefaultText": otu_idsDefaultText[i], "measurementsDefault": measurementsDefault[i], "hoverDefault": hoverDefault[i]});
}

// Sort the array of objects descending by measurementsDefault
var combinedListsSorted = combinedLists.sort((a, b) => b.measurementsDefault - a.measurementsDefault);

// Extract top 10 from sorted list
var top10 = combinedListsSorted.slice(0, 10);

// Separate three arrays for plotting
var xValues = top10.map(x => x.measurementsDefault);
var yValues = top10.map(x => x.otu_idsDefaultText);
var hoverValues = top10.map(x => x.hoverDefault);

// Plot otu_ids and sample_values as horizontal bar chart
var trace = 
{
    x: xValues,
    y: yValues,
    type: "bar",
    orientation: "h",
    text: hoverValues
};

var traces = [trace];

var layout = 
{
    title: `OTU counts for sample ${nameDefault}`,
    xaxis: {title: "Count"},
    yaxis: {title: "OTU ID"}
};

Plotly.newPlot("bar-chart", traces, layout)


// Function to extract data from results based on user's input
// function switchDataset(userChoice)
// {

// }
