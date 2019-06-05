# Code design 

## Preprocessing
### From csv to DataFrame
The raw data comes from a .csv file which will be read into a Pandas dataframe. Using Pandas, I will remove any missing data or columns that I have deemed unneccesary. 

### Splitting & from DataFrame to JSON 
For each visualisation, I plan to create a seperate JSON file. Therefore, I must first create three seperate DataFrames containing only the data needed for the visualisation they're meant for. For example, the JSON for the sunburst chart will look something like this:

- Female
  * Heterosexual
  * Bicurious
  * Bisexual
  * Homosexual 
    + Dominant
    + Switch
    + Submissive
- Male
  ...
  
## JavaScript Functions
The JavaScript code that ultimately generates the visualisations will be comprised of at least the following functions: 
- draw_Sunburst: called upon page load, loads relevant JSON and creates main visualisation
- draw_Barchart: called upon page load, loads relevant JSON and creates bar chart
- draw_Piechart: called upon page load, loads relevant JSON and creates pie chart
- update_Barchart: called whenever a user either selects a new gender in the sunburst, or selects a new variable in the dropdown menu. Loads new data from JSON and updates the bar chart. 
- update_Piechart: called whenever a user either selects a new subgroup in the sunburst, or selects a new age group in the dropdown menu. Loads new data from JSON and updates the bar chart.  
    
