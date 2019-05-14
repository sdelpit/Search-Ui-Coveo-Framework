import sys
import json
import urllib.parse
from bs4 import BeautifulSoup
import requests


pokemonRequest = requests.get('https://pokemondb.net/pokedex/national')
#print(pokemonRequest)

pokemonPage = pokemonRequest.content

soup = BeautifulSoup(pokemonPage, 'html.parser')

pokemonArray = []

for mainContent in soup.find_all(class_="main-content"):
    divTags = mainContent.find_all(class_='infocard')
    for divTag in divTags:
        image = divTag.find('span', attrs={'class':'img-fixed'})["data-src"]
        number = divTag.find('span', attrs={'class':'infocard-lg-data text-muted'}).find('small').get_text()
        name = divTag.find('a', attrs={'class':'ent-name'}).get_text()

        pokemonTypeList = divTag.find_all('a', attrs={'class':'itype'})
        #print(pokemonTypeList)

        pokemonType = []
        for pokemon in pokemonTypeList:
            #print(pokemon)
            pokemonType.append(pokemon.get_text())

        partialUrl = "https://pokemondb.net/pokedex/"
        url = urllib.parse.urljoin(partialUrl,name)

        pokemonObject = {
            'image': image,
            'number': number,
            'name': name,
            'type': pokemonType,
            "documentId": url,
            "data": "pokemon",
            "compressionType": "UNCOMPRESSED",
            "fileExtension": ".json"
        }
        pokemonArray.append(pokemonObject)

#print(pokemonArray)

with open('pokemonData.json', 'w') as outfile:
    json.dump(pokemonArray, outfile)

with open('pokemonData.json') as json_data:
    jsonData = json.load(json_data)
