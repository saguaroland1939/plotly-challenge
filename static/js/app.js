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

// Read in first name from names array
var nameDefault = results.names[0];
console.log(nameDefault);

// Select element in index.html where metadata will be appended
var metadataElement = d3.select("ul");

// Extract values from first metadata object and convert to array
var metadataDefault = Object.entries(results.metadata[0]);
metadataDefault.forEach(function([key, value])
{
    var metadataItem = metadataElement.append("li");
    metadataItem.text(`${key}: ${value}`);
});
// Function to extract data from results based on user's input
// function switchDataset(userChoice)
// {

// }
