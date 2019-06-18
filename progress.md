# Progress book
Jessica Sam, 10752498
Minor Programmeren, Programmeerproject
Universiteit van Amsterdam


### 04-06-2019 Onderwerpen en overwegingen
Ik heb tot nu toe verschillende ideeën onderzocht en geschetst, maar nog geen enkele zou voldoen aan de eisen of had mijn interesse. Met Nigel besproken dat ik ook op dinsdag 4 juni nog aan mijn proposal mag werken.
De ideeën die ik overwogen heb volgt hieronder. Voor alle onderwerpen heb ik datasets gevonden, uitvoerig bekeken en gebrainstormd. Voor sommige ben ik ook gekomen tot het maken van een schets.
- Sekswerk en prostitutie (niet genoeg data over te vinden, omdat het in veel landen illegaal en taboe is)
- Het 'volwassen worden' van 15- tot 30-jarigen en of ze in 2018 'eerder volwassen' zijn dan in 2012, aan de hand van verschillende indicatoren. Lastig indicatoren definiëren, en verschil tussen 2012 en 2018 lijkt me niet interessant genoeg.
- De Nederlandse Veiligheidsmonitor (subjectieve veiligheid), vergeleken met daadwerkelijke geregistreerde criminaliteit. Veiligheidsmonitor data was helaas niet zo interessant.
- Energiecentrales over de hele wereld naar type energie en capaciteit. Niet echt een verhaal, had niet mijn interesse.
- Klantbeoordelingen van vliegtuigmaatschappijen. Geen probleemstelling bij te bedenken, te beschrijvend.
- /r/bodybuilding community survey: o.a. lichaamscompositie, steroïdengebruik etc. Self-report, te moeilijk te analyseren.
- Darknet market listings: drugs, wapens en meer en hun prijs (in BTC). Niet genoeg links mogelijk.
- Darknet market cocaïne data: prijs, land van herkomst, kwaliteit, aantal succesvolle transacties van de verkoper, customer rating. Niet genoeg links mogelijk.
- Global Drug Survey: ik heb aan de telefoon gehangen met de head researcher van dat project omdat de data niet publiek is, maar hij had te veel eisen.

### 05-06-2019
Ik ben eindelijk tot een onderwerp gekomen! Toch nog een geschikte dataset gevonden m.b.t. sekswerk.
Besloten om een sunburst, pie chart en bar chart te gaan maken.
Vandaag mijn proposal en design document gefinaliseerd.

### 06-06-2019
Python geschreven om de data te cleanen en om te zetten naar JSON voor de visualisaties. Ging verrassend goed!
Wel helaas veel werk voor niets gedaan, omdat ik er laat achter kwam dat de json voor iedere visualisatie een specifieke format moet hebben - zeker de JSON voor de sunburst moet op een manier die ik nog niet helemaal snap.
Verder vandaag ook de bare bones voor de HTML pagina opgezet, met een Bootstrap template.

### 07-06-2019
Na uren werk is het gelukt om de JSON voor de sunburst te genereren! Eindelijk.
Kan nu een basis sunburst van mijn data plotten op mijn website.

### 11-06-2019
In het weekend was mijn laptop gesneuveld en heb ik een nieuwe moeten kopen, dus het kostte weer even wat tijd om alles werkende te krijgen.
Vandaag heb ik ervoor gezorgd dat de sunburst de juiste kleuren weergeeft en een 'mouseover'-functie heeft. Ik heb de JSON voor de pie chart op de juiste manier gestructureerd en ervoor gezorgd dat nu voor één leeftijdscategorie de pie chart zichtbaar is. Er moet dus nog een knop komen om de variabele te togglen.
Ik heb de JSON voor de bar chart op de juiste manier gestructureerd en ervoor gezorgd dat nu voor één variabele de bar chart zichtbaar is. Er moet dus nog een knop komen om de variabele te togglen.

### 12-06-2019
Ik heb een html dropdown menu toegevoegd en een update-functie geschreven voor de pie chart, zodat hij verandert wanneer er en age group geselecteerd wordt in het dropdown menu.
Wel ben ik er achter gekomen dat ik gisteren iets groots over het hoofd had gezien bij het structureren van de data voor de pie chart. Hij moet namelijk óók te togglen zijn vanuit de sunburst. Het moet dus gestructureerd zijn per age group, maar daarvoor al per 'user characteristics' (geslacht, seksualiteit, sexual polarity). Dat zal ik dus opnieuw moeten gaan doen... Dit heb ik ook over het hoofd gezien bij de data voor de bar chart. Deze moet namelijk ook per geslacht gegroepeerd zijn, omdat je in de sunburst op 'male' en 'female' moet kunnen klikken en dan de activiteit kan zien.

### 13-06-2019
Zowel gisteren als vandaag gewerkt aan het herstructureren van de JSON voor de bar- en pie chart.

### 14-06-2019
Vandaag helaas ziek en weinig kunnen doen. Wel naar het tutorgesprek gegaan.

### 17-06-2019
Eindelijk de JSON voor beide charts goed gekregen, en veel aan beide charts getweaked - maar zonder resultaat. Ik stelde om 13:30 een vraag en ik ben nooit aan de beurt gekomen (assistentie was van 13:00-17:00).
Wel heb ik een legenda kunnen toevoegen aan de sunburst, en 'breadcrumbs': een trail onder de visualisatie die laat zien welke groepen je geselecteerd hebt.

### 18-06-2019
Een doorbraak! Het is gelukt om de sunburst te koppelen aan de pie chart. De pie chart functioneert nu naar behoren; hij update wanneer er geklikt wordt in de buitenste ring van de sunburst en wanneer de leeftijdscategorie getoggle'd wordt via het HTML-element. Wanneer je één van beide aanpast, behoudt hij de andere waarde: als je dus leeftijdscategorie '18-25' geselecteerd hebt en in de sunburst op male>heterosexual>dominant klikt, krijg je de risicoverdeling te zien van 18-25jarigen binnen die groep. De update-functie werkt ook naar behoren.
Ook heb ik een begin gemaakt aan de update-functie voor de bar chart, maar deze werkt nog niet goed. 
