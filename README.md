# Belly Button Biodiversity Study Visualizations
#
### This is an interactive web app that displays results for each participant in the Belly Button Biodiversity Study, a playful, but scientifically rigorous study carried out by The Public Science Lab: http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/
### This web app is available at https://saguaroland1939-1st-dashboard.herokuapp.com.
### Three main files interact to render the web page:
1. App.py is a Flask app and is the starting file for the app. App.py contains two routes. The root route renders the web page (index.html) and the data route provides the json data file to app.js via a URL to circumvent CORS restrictions. The flask app utilizes the free production-grade web server Waitress which is compatible with the Heroku web hosting platform.
2. Index.html runs app.js and has its menu options and chart data dynamically appended and updated by app.js. Index.html utilizes the Bootstrap grid for layout
3. App.js utilizes the D3 library to load the json data from app.py and append data dynamically to the DOM. App.js also uses the Plotly library to create a horizontal bar chart and a bubble chart.
### The app was deployed to Heroku (a free web hosting platform) by linking the Heroku app to this GitHub repo.
