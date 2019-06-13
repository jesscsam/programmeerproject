from cleandata import clean_data
import pandas as pd
import json


all_data = pd.read_csv("online_sex_work.csv")

# Clean data
data = clean_data(all_data)

# Group the necessary data
grouped_df = data.groupby(['Gender', 'Sexual_orientation', 'Sexual_polarity', 'Age_group', 'Risk'])
piechart_df = pd.DataFrame(grouped_df.size().reset_index(name = "Group_Count"))
piechart_df = piechart_df.drop(piechart_df.index[456:])

piedict = {}

# for each entry in the grouped dataframe, add it to a dictionary
for index, row in piechart_df.iterrows():
    gender = row[0]
    sex_or = row[1]
    sex_pol = row[2]
    age_group = row[3]
    risk = row[4]
    count = row[5]

    if gender not in piedict:
        piedict[gender] = {}
    if sex_or not in piedict[gender]:
        piedict[gender][sex_or] = {}
    if sex_pol not in piedict[gender][sex_or]:
        piedict[gender][sex_or][sex_pol] = {}
    if age_group not in piedict[gender][sex_or][sex_pol]:
        piedict[gender][sex_or][sex_pol][age_group] = []
    if risk not in piedict[gender][sex_or][sex_pol][age_group]:
        piedict[gender][sex_or][sex_pol][age_group].append({'Risk': risk, 'Count': count})



# Group risks without taking into account age groups
grouped_for_all = pd.DataFrame(data.groupby(['Gender', 'Sexual_orientation', 'Sexual_polarity', 'Risk']).size().reset_index(name = "Group_Count"))
alldict = {}

# For each entry, add it to a dictionary for all age groups
for index, row in grouped_for_all.iterrows():
    gender = row[0]
    sex_or = row[1]
    sex_pol = row[2]
    risk = row[3]
    count = row[4]

    if gender not in alldict:
        alldict[gender] = {}
    if sex_or not in alldict[gender]:
        alldict[gender][sex_or] = {}
    if sex_pol not in alldict[gender][sex_or]:
        alldict[gender][sex_or][sex_pol] = []
    if risk not in alldict[gender][sex_or][sex_pol]:
        alldict[gender][sex_or][sex_pol].append({'Risk': risk, 'Count': count})

# Add data for combined age groups to main dictionary
piedict['All'] = alldict


with open('pieTEST.json', 'w') as outfile:
    json.dump(piedict, outfile)
