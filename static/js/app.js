
// Read in json asynchronously with .then.
//d3.json("data/samples.json", function(data)
//{
//    console.log(data);
//});

console.log("sdkjfhksdjhfk");

// Read in json asynchronously with .then.
sam_dat_promise = d3.json("data/samples.json");
function sam_dat_fail() {
    console.log("failed to get sample data json");
}
function sam_dat_worked(val)  {
    console.log(val);
};
sam_dat_promise.then(sam_dat_worked, sam_dat_fail);
