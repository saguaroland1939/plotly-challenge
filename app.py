# This Flask app has two routes that interact with index.htm and app.js to render the interactive web page. 
# The first route calls index.html to render the web page.
# The second route reads in a json data file and returns that file to when called by app.js.
# The second route is needed because app.js must access the json via a URL to get around the CORS restriction.
# This app uses the Waitress web server (rather than the built-in Flask web server) in order to deploy to Heroku.

# Import dependencies
import json
from flask import Flask
from flask import render_template
from waitress import serve # production web server

# Flask object instance
app = Flask(__name__)

# Root route renders webpage
@app.route("/")
def render():
    return render_template("index.html")

# Data route provides data to app.js
@app.route("/data")
def data():
    with open("data/samples.json") as file:
        data = json.load(file)
    return data

if __name__ == "__main__":
    serve(app) # Serve app with Waitress