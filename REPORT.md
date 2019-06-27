# Project report
MPROG Programming Project Summer 2019 | Jessica Sam, 10752498

## Description
A visualisation of user data from a European adult online forum. This data includes user characteristics and an AI-calculated risk factor, showing how likely that individual is to enter into online sex trade.
To view the visualisation, click [here](https://jesscsam.github.io/programmeerproject/).

## Screenshots

![screenshot 1](https://github.com/jesscsam/programmeerproject/blob/master/pictures/screenshot1.png)
![screenshot 2](https://github.com/jesscsam/programmeerproject/blob/master/pictures/screenshot2.png)


## Technical design
##### Parsing & pre-processing in Python
The raw data comes from a CSV file stored locally. I chose to pre-process the data in Python, since felt somewhat comfortable working with Pandas Dataframes.  I created `cleandata.py` to load the data into DataFrames, manipulate them and ultimately write 3 JSON files: one for each visualisation. At this stage, I also randomly assigned risk values to the data. In 'Choices', I will talk more about faking these results.

##### JavaScript
Each visualisation originates from a seperate JavaScript file. Within those, a single main function exists that gets called on pageload and creates the first visualisation. Nested inside is an update function (dependent on a promise, to prevent asynchronicity) that gets called on an event: for example, a change within a select menu or a click in the sunburst diagram.

The functions are structured in the same way:
1. Firstly, an SVG is created with the right dimensions and variables. It's placed in its corresponding HTML <div> element.
2. Then the JSON is loaded and user input is used to retrieve the correct data from the file.
3. For each datapoint, a path (sunburst part, pie slice or bar) is created in the svg and attributes are added.
4. Finally, each visualisation has their own interactive functions like tooltips and mouse-over functions.

So, the main function gets called on pageload. There are several cases in which an `update` function gets called:
* A click in the outer ring of the sunburst updates the pie chart
* A click in the inner ring of the sunburst updates the bar chart
* Selecting an age group from the drop-down menu updates the pie chart
* Selecting a subject from the second drop-down menu updates the bar chart

Because there can only be one `onclick` function for the sunburst I chose to call `updatePie`, which is actually a nested function, from within barchart.js. It ain't pretty (or so I've heard), but it gets the job done.

##### HTML & CSS
My website is a one-page based on a [Bootstrap](https://getbootstrap.com/) template. All additional html is written in `index.html` and all additional styling in `project.css`. I used CSS grid containers to align the visualizations on my page.


## Challenges
##### Actually choosing a topic
As I am notoriously bad at making decisions, it took me a long time to actually choose a dataset to work with. I felt like there was too much at stake: what if, after working on it for a few days, the data proves unsuitable for my visualisations? I found datasets that I for sure believed to be suitable, but very boring. I'm happy that I finally found data on a topic that interests me greatly - as I am not sure that I would've enjoyed this process if I didn't. ;-)

##### JSON formatting
The fist challenge I came across had to do with structuring the data to be used for the visualisations. I spent many days on this. I knew what I wanted to show, but what I didn't know was that specific D3 visualisations require JSON formatted in a specific way. So after formatting the data into JSON that I felt was 'logical', I quickly learnt that D3 wasn't able to read it. After a lot of Googling, it still took me quite some time to put the data together the right way.

##### Splitting functions
Each of my JavaScript files is basically one large function. I would've preferred splitting them up more according to their functions, or at least have the `update` function outside of the main function. I tried this a couple of times, but it would mean copying and pasting a lot of D3 code. Therefore, I chose to have everything nested within one function, to have all variables easily available to me.

## Changes & choices
The final product does not differ much from what I outlined in my proposal. In fact, I take some pride in creating exactly what I envisioned! There were some important choices along the way, though, which I've outlined below.

##### Faking data
An important choice I made is the fact dat I faked the data on 'risk'. This makes my pie chart fully fictional, but because this assignment is for the actual *visualisation*, I cared more about actually having something to show. Because the original dataset had 28,000 'unknown_risk' entries, I randomly changed those to high, low and no risk, leaving some unknown, too. At first I thought about judging risk levels myself, for example: `for all entries that are male, homosexual and switch, give 50% of them high_risk, 30% low_risk` etcetera. This, however, would mean looping over the data far too much. Also, ethically, I thought this would go too far. So random risk assignment it was!

##### Other choices
All other choices I've made during the course of this project are because I either outlined the idea in my proposal, or because of practical matters. I chose for a one-page website because that is how I wanted it from the start. Or for example, I would've liked the pie chart to also be able to show risk data if you click on a partition within the inner or middle ring of the sunburst, but I know I couldn't've been able to create JSON for that in the time that I had. 



## Future adjustments & reflection

If I had some more time, I would have included tooltips or percentage labels in the pie chart. I forgot about adding that for very long, and because percentages are not included in my JSON (only raw numbers), it didn't manage to implement it in time. And of course, there are always i's to dot - like actually spelling 'submissive' right (the data says 'Submisive'). It would've been an easy fix, but I just never did it.

All in all, I really enjoyed focusing entirely on one project for a month. It's a real deep dive into JavaScript and D3, but it's nice to have built it all yourself (or with a little help from StackOverflow of course) and I'm proud of the result.
