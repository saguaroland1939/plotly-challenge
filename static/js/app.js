// This script reads in a data file (samples.json), parses data of interest,
// and builds two interactive charts (a horizontal bar chart and a bubble chart). A drop-down menu, implemented in index.html
// allows the user to select which dataset (individual) to display. Both charts as well as a list of subject metadata are updated 
// simultaneously with the user's selection.

// Keys of interest from dataset:
// names: list of study participant IDs
// metadata: demographics for each participant
// otu_ids: list of OTUs present in a sample (numeric code)
// otu_labels: list of text labels for each otu found in a sample
// sample_values: list containing the count associated with each OTU found in a sample

// Import JavaScript object from samples.json and draw default plots
d3.json("/data").then((data) => {
    var results = data;
    // Select menu element from DOM and append array of participants as menu options
    var menuElement = d3.select("select");
    var participants = results.names;
    participants.forEach((participant) => {
        menuElement.append("option").text(participant).property("value", participant);
    });

    // Read in first name from names array for default plots
    var nameDefault = results.names[0];

    // Select element in index.html where metadata will be appended
    var metadataElement = d3.select("ul");

    // Extract values from first metadata object and convert to array
    var metadataDefault = Object.entries(results.metadata[0]);
    metadataDefault.forEach(function ([key, value]) {
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
    for (var i = 0; i < otu_idsDefaultText.length; i++) {
        combinedLists.push({ "otu_idsDefaultText": otu_idsDefaultText[i], "measurementsDefault": measurementsDefault[i], "hoverDefault": hoverDefault[i] });
    }

    // Sort the array of objects descending by measurementsDefault
    var combinedListsSorted = combinedLists.sort((a, b) => b.measurementsDefault - a.measurementsDefault);

    // Extract top 10 from sorted list
    var top10 = combinedListsSorted.slice(0, 10);

    // Separate three arrays for plotting
    var otus = top10.map(x => x.measurementsDefault);
    var counts = top10.map(x => x.otu_idsDefaultText);
    var hoverValues = top10.map(x => x.hoverDefault);

    // Plot horizontal bar chart
    var trace =
    {
        x: otus,
        y: counts,
        type: "bar",
        orientation: "h", // Orient chart horizontally
        text: hoverValues // Set hovertext
    };

    var traces = [trace];

    var layout =
    {
        height: 500, // Height is explicitly set to align charts
        title: `Top 10 OTU Counts for Sample ${nameDefault}`,
        xaxis: { title: "OTU Count" },
        yaxis:
        {
            title: "OTU ID",
            tickfont: { size: 8 }
        }
    };

    Plotly.newPlot("bar-chart", traces, layout);

    // Plot bubble chart

    // Resort combinedLists ascending by OTU IDs

    // Combine arrays into array of objects
    var combinedLists2 = []
    for (var i = 0; i < otu_idsDefault.length; i++) {
        combinedLists2.push({ "otu_idsDefault": otu_idsDefault[i], "measurementsDefault": measurementsDefault[i], "hoverDefault": hoverDefault[i] });
    }

    // Sort array of objects acending by OTU IDs
    combinedListsSorted2 = combinedLists2.sort((a, b) => a.otu_idsDefault - b.otu_idsDefault);

    // Separate array of objects back into 3 arrays
    var otus2 = combinedListsSorted2.map(x => x.otu_idsDefault);
    var counts2 = combinedListsSorted2.map(x => x.measurementsDefault);
    var hoverValues2 = combinedListsSorted2.map(x => x.hoverDefault);

    // Generate array of random colors to be applied to bubbles
    colors = [];
    r = 0;
    g = 0;
    b = 0;

    for (var i = 0; i < otu_idsDefault.length; i++) {
        r = parseInt(Math.random() * 255);
        g = parseInt(Math.random() * 255);
        b = parseInt(Math.random() * 255);
        colors.push(`rgb(${r}, ${g}, ${b})`);
    };

    var trace =
    {
        x: otus2,
        y: counts2,
        type: "scatter",
        mode: "markers",
        marker:
        {
            size: counts2,
            sizeref: 0.1,
            sizemode: "area",
            color: colors,
            opacity: [0.6]
        },
        text: hoverValues2
    };

    var traces = [trace];

    var layout =
    {
        height: 500, // Height is explicitly set to align charts
        title: `All OTU Counts for Sample ${nameDefault}`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "OTU Count" },
        height: 500,
        width: 800
    };

    Plotly.newPlot("bubble-chart", traces, layout);
}); //close d3.json.then


function optionChanged(userChoice) {
    // Read in json each time menu selection changes
    d3.json("/data").then((data) => {
        var results = data;
        // Delete current contents of metadata pane
        d3.selectAll("li").remove();

        // Get user choice from drop-down menu
        var inputElement = d3.select("select");
        var inputValue = inputElement.property("value");

        // Get the array index for inputValue in the participants array.
        // Because all data is sorted identically, this index will be used to extract all data for that inputValue.
        var participants = results.names;
        var inputIndex = participants.indexOf(inputValue);

        // Extract appropriate data based on inputIndex
        var name = results.names[inputIndex];

        var metadata = Object.entries(results.metadata[inputIndex]);

        var otu_ids = results.samples[inputIndex].otu_ids;
        var otu_idsText = otu_ids.map(x => `OTU-${x}`);

        var measurements = results.samples[inputIndex].sample_values;

        var hoverText = results.samples[inputIndex].otu_labels;


        // Populate metadata pane with new contents based on user selection
        var metadataElement = d3.select("ul");
        metadata.forEach(function ([key, value]) {
            var metadataItem = metadataElement.append("li");
            metadataItem.text(`${key}: ${value}`);
        });

        // Combine otu_idsDefaultText, measurementsDefault, and hoverDefault arrays into an array of objects so
        // they can be sorted simultaneously
        var combinedLists = [];
        for (var i = 0; i < otu_idsText.length; i++) {
            combinedLists.push({ "otu_idsText": otu_idsText[i], "measurements": measurements[i], "hoverText": hoverText[i] });
        }

        // Sort the array of objects descending by measurementsDefault
        var combinedListsSorted = combinedLists.sort((a, b) => b.measurements - a.measurements);

        // Extract top 10 from sorted list
        var top10 = combinedListsSorted.slice(0, 10);

        // Separate three arrays for plotting
        var otus = top10.map(x => x.measurements);
        var counts = top10.map(x => x.otu_idsText);
        var hoverValues = top10.map(x => x.hoverText);

        // Plot horizontal bar chart
        var trace =
        {
            x: otus,
            y: counts,
            type: "bar",
            orientation: "h", // Orient chart horizontally
            text: hoverValues // Set hovertext
        };

        var traces = [trace];

        var layout =
        {
            height: 500, // Height is explicitly set to align charts
            title: `Top 10 OTU counts for sample ${name}`,
            xaxis: { title: "OTU Count" },
            yaxis:
            {
                title: "OTU ID",
                tickfont: { size: 8 }
            }
        };

        Plotly.newPlot("bar-chart", traces, layout);

        // Plot bubble chart

        // Resort combinedLists ascending by OTU IDs and combine arrays into array of objects
        var combinedLists2 = []
        for (var i = 0; i < otu_ids.length; i++) {
            combinedLists2.push({ "otu_ids": otu_ids[i], "measurements": measurements[i], "hoverText": hoverText[i] });
        }

        // Sort array of objects acending by OTU IDs
        combinedListsSorted2 = combinedLists2.sort((a, b) => a.otu_ids - b.otu_ids);

        // Separate array of objects back into 3 arrays
        var otus2 = combinedListsSorted2.map(x => x.otu_ids);
        var counts2 = combinedListsSorted2.map(x => x.measurements);
        var hoverValues2 = combinedListsSorted2.map(x => x.hover);

        // Generate array of random colors to be applied to bubbles
        colors = [];
        r = 0;
        g = 0;
        b = 0;

        for (var i = 0; i < otu_ids.length; i++) {
            r = parseInt(Math.random() * 255);
            g = parseInt(Math.random() * 255);
            b = parseInt(Math.random() * 255);
            colors.push(`rgb(${r}, ${g}, ${b})`);
        };

        // Create trace object
        var trace =
        {
            x: otus2,
            y: counts2,
            type: "scatter",
            mode: "markers",
            marker:
            {
                size: counts2,
                sizeref: 0.1,
                sizemode: "area",
                color: colors,
                opacity: [0.6]
            },
            text: hoverValues2
        };

        // Convert trace object to array for plotting
        var traces = [trace];

        // Specify plot layout
        var layout =
        {
            height: 500, // Height is explicitly set to align charts
            title: `All OTU Counts for Sample ${name}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "OTU Count" },
            height: 500,
            width: 800
        };

        Plotly.newPlot("bubble-chart", traces, layout);
    }); //close d3.json.then
} // Close optionChanged function