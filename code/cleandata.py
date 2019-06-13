import pandas as pd
import json
import random
import numpy as np
import warnings; warnings.filterwarnings('ignore')

def clean_data(all_data):
    """
    Preprocesses the adult forum user data
    """

    all_data = all_data.iloc[: 28831, :]

    # drop unnecessary columns
    data = all_data.drop(['Location', 'Verification', 'Looking_for', 'Points_Rank', 'Member_since', 'Friends_ID_list'], axis=1)

    # specify column datatypes
    data['Number_of_advertisments_posted'] = data['Number_of_advertisments_posted'].astype(int)
    data['Gender'] = data['Gender'].astype(str)
    data['Risk'] = data['Risk'].astype(str)
    data['Sexual_orientation'] = data['Sexual_orientation'].astype(str)
    data['Sexual_polarity'] = data['Sexual_polarity'].astype(str)
    data['Number_of_Comments_in_public_forum'] = data['Number_of_Comments_in_public_forum'].str.replace(' ', '').astype(int)
    data['Number_of_advertisments_posted'] = data['Number_of_advertisments_posted'].astype(int)
    data['Number_of_offline_meetings_attended'] = data['Number_of_offline_meetings_attended'].astype(int)
    data['Profile_pictures'] = data['Profile_pictures'].astype(int)

    # fix age data
    data['Age'] = data['Age'].apply(lambda x: x.replace(',', '.'))
    data['Age'] = data['Age'].replace('???', np.nan)
    data['Age'] = data['Age'].astype(float)
    data['Age'].fillna(data['Age'].mean(), inplace=True)

    # calculate time spent chatting in minutes
    data['Time_spent_chating_H:M'] = data['Time_spent_chating_H:M'].str.replace(' ', '')
    data['Time_spent_chating_H:M'] = data['Time_spent_chating_H:M'].apply(get_n_minutes)

    # rename columns
    data = data.rename({'Number_of_Comments_in_public_forum': 'Num_com'}, axis=1)
    data = data.rename({'Number_of_advertisments_posted': 'Num_adv'}, axis=1)
    data = data.rename({'Number_of_offline_meetings_attended': 'Num_meet'}, axis=1)
    data = data.rename({'Time_spent_chating_H:M': 'Chat_time'}, axis=1)

    # add age categories
    data = add_age_groups(data)

    # fake the risk data
    data = create_fake_risk(data)
    data = data.drop('Risk', axis=1)
    data = data.rename({'Risk2':'Risk'},axis=1)


    return data


def data_for_sunburst(data):
    """
    Creates dataframe to be used to write JSON for sunburst diagram
    """

    #print(data.pivot(index='Gender',columns=['Sexual_orientation', 'Sexual_polarity']))

    grouped_df = data.groupby(['Gender', 'Sexual_orientation', 'Sexual_polarity'])

    sunburst_df = pd.DataFrame(grouped_df.size().reset_index(name = "Group_Count"))
    sunburst_df = sunburst_df.drop(sunburst_df.index[24:])

    filename = 'sunjson'
    to_sunburst_json(sunburst_df, filename)



def to_sunburst_json(df, filename):
    """
    Convert dataframe into nested JSON as in flare files used for D3.js
    """
    flare = dict()
    d = {"name":"flare", "children": []}

    for index, row in df.iterrows():
        parent = row[0]
        child = row[1]
        child2 = row[2]
        size = row[3]


        # Make a list of keys
        key_list = []

        for item in d['children']:
            key_list.append(item['name'])

        #if 'parent' is NOT a key in flare.JSON, append it
        if not parent in key_list:
            d['children'].append({"name": parent, "children":[{"name": child, "children": [{"name": child2, "size": size}]}]})

        else:
            check = False
            for item in d['children']:

                for item2 in item['children']:
                    if item2['name'] == child and item['name'] == parent:
                        item2['children'].append({"name": child2, "size": size})
                        check = True

                if item['name'] == parent:
                    if check == False:
                        item['children'].append({"name": child, "children":[]})



        print(d)

    flare = d

    # export the final result to a json file
    with open(filename +'.json', 'w') as outfile:
        json.dump(flare, outfile, indent=4)



def data_for_piechart(data):
    """
    Creates dataframe to be used to write JSON for pie chart
    """

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


    with open('piejson.json', 'w') as outfile:
        json.dump(piedict, outfile)


def data_for_barchart(data):
    """
    Creates dataframe to be used to write JSON for bar chart
    """
    # drop irrelevant columns
    data = data.drop(['Sexual_orientation', 'Sexual_polarity', 'User_ID', 'Risk', 'Age'], axis=1)

    # group data needed for bar chart
    #barchart_df = data.groupby('Age_group').mean()

    grouped_df = data.groupby(['Age_group', 'Gender'])

    barchart_df = pd.DataFrame(grouped_df.mean().reset_index())

    print(barchart_df)

    bardict = {}

    male = {'Comments': [], 'Chattime': [], 'Ads': [], 'Meets': [], 'Pics': []}
    female = {'Comments': [], 'Chattime': [], 'Ads': [], 'Meets': [], 'Pics': []}
    all = {'Comments': [], 'Chattime': [], 'Ads': [], 'Meets': [], 'Pics': []}

    for index, row in barchart_df.iterrows():
        if row.Gender == 'male':
            male['Comments'].append({'Group': row.Age_group, 'mean': row.Num_com})
            male['Chattime'].append({'Group': row.Age_group, 'mean': row.Chat_time})
            male['Ads'].append({'Group': row.Age_group, 'mean': row.Num_adv})
            male['Meets'].append({'Group': row.Age_group, 'mean': row.Num_meet})
            male['Pics'].append({'Group': row.Age_group, 'mean': row.Profile_pictures})
        elif row.Gender == 'female':
            female['Comments'].append({'Group': row.Age_group, 'mean': row.Num_com})
            female['Chattime'].append({'Group': row.Age_group, 'mean': row.Chat_time})
            female['Ads'].append({'Group': row.Age_group, 'mean': row.Num_adv})
            female['Meets'].append({'Group': row.Age_group, 'mean': row.Num_meet})
            female['Pics'].append({'Group': row.Age_group, 'mean': row.Profile_pictures})

    grouped_for_all = pd.DataFrame(data.groupby('Age_group').mean().reset_index())
    for index, row in grouped_for_all.iterrows():
        all['Comments'].append({'Group': row.Age_group, 'mean': row.Num_com})
        all['Chattime'].append({'Group': row.Age_group, 'mean': row.Chat_time})
        all['Ads'].append({'Group': row.Age_group, 'mean': row.Num_adv})
        all['Meets'].append({'Group': row.Age_group, 'mean': row.Num_meet})
        all['Pics'].append({'Group': row.Age_group, 'mean': row.Profile_pictures})

    bardict['male'] = male
    bardict['female'] = female
    bardict['all'] = all

    with open('barjson.json', 'w') as outfile:
        json.dump(bardict, outfile)



def add_age_groups(data):
    """
    Adds age group column to the dataframe
    """
    agegroups = []

    for row in data.iterrows():
        if row[1]['Age'] >= 18 and row[1]['Age'] < 25:
            agegroups.append('18-25')
        elif row[1]['Age'] >= 25 and row[1]['Age'] < 30:
            agegroups.append('25-30')
        elif row[1]['Age'] >= 30 and row[1]['Age'] < 40:
            agegroups.append('30-40')
        elif row[1]['Age'] >= 40 and row[1]['Age'] < 50:
            agegroups.append('40-50')
        elif row[1]['Age'] >= 50:
            agegroups.append('50+')
        else:
            agegroups.append(None)

    data['Age_group'] = agegroups

    return data



def create_fake_risk(data):
    """
    Since the raw data had almost only 'unknown_risk' values and I wanted to
    have my visualisations look cool, I decided to do a Diederik Stapeltje and
    make up the data myself. ¯\_(ツ)_/¯
    """

    risks = []


    # for a specific amount of times, add the different risk values
    for i in range(int(len(data) / 7 * 0.5)):
        risks.append('High_risk')

    for i in range(int(len(data) / 7 * 2)):
        risks.append('Low_risk')

    for i in range(int(len(data) / 7 * 3.5)):
        risks.append('No_risk')

    for i in range(int(len(data) / 7 * 1)):
        risks.append('unknown_risk')


    # add two more to get to the exact len(data)
    risks.append('No_risk')
    risks.append('Low_risk')

    # shuffle the list so it's not in order
    random.shuffle(risks)

    # add fake risk data to DataFrame
    data['Risk2'] = risks

    return data


def get_n_minutes(row):
    """
    Cleans chat time data from H:M to just minutes
    """
    time_components = row.split(':')
    if len(time_components) == 2:
        return int(time_components[0]) * 60 + int(time_components[1])
    elif len(time_components) == 3:
        return int(time_components[0]) * 1440 + int(time_components[1]) * 60 + int(time_components[2])



if __name__ == "__main__":

    # Load data into dataframe
    all_data = pd.read_csv("online_sex_work.csv")

    # Clean data
    data = clean_data(all_data)

    # Create sunburst data & write sunburst json
    #sundata = data_for_sunburst(data)

    #piedata = data_for_piechart(data)

    bardata = data_for_barchart(data)
