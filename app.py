# This Flask app has two routes. The first route calls index.html to render the web page.
# The second route reads in a json data file and returns that file to app.js when called.
# The second route is needed because app.js must access the json via a URL to get around the CORS restriction.

# Import dependencies
import os
import json
from flask import Flask
from flask import render_template
#from waitress import serve

# Flask object instance
app = Flask(__name__)

# Root route
@app.route("/")
def render():
    return render_template("index.html")

# Data route
@app.route("/data")
def data():
    with open("data/samples.json") as file:
        data = json.load(file)
    print(data)
    return data

if __name__ == "__main__":
    #serve(app)
    app.run(debug=True)