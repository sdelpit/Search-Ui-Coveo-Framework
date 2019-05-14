import requests


# Get the organisationID
def getTheOrgnisationId():
	url = "https://platform.cloud.coveo.com/rest/organizations"

	payload = ""
	headers = {
		'Accept': "application/json",
		'Authorization': "Bearer x7e8ab32f-9b97-4ff8-b8b9-83499daf91c2",
		'cache-control': "no-cache",
		'Postman-Token': "32184442-0c4c-480f-b59d-e1e0afd22e72"
		}

	response = requests.request("GET", url, data=payload, headers=headers)

	print(response.text)

# Create the source
def createTheSource():
	URL = "https://platform.cloud.coveo.com/rest/organizations/codeboxxseverineozk4pc34/sources"

	payload = {
		'sourceType': 'PUSH',
		'name': 'Pokemon_Test',
		'sourceVisibility': 'SHARED',
		'pushEnabled': True
		}

	headers = {
		'Content-Type': "application/json",
		'Accept': "application/json",
		'Authorization': "Bearer x7e8ab32f-9b97-4ff8-b8b9-83499daf91c2",
		'cache-control': "no-cache",
		'Postman-Token': "fb37c457-c985-4e98-b09c-1b65772b381a"
		}

	response = requests.post(url=URL, data=payload, headers=headers)

	print(response.text)

#Retrieve the source ID
def getTheSourceId():
	URL = "https://platform.cloud.coveo.com/rest/organizations/codeboxxseverineozk4pc34/sources"

	payload = ""
	headers = {
		'Accept': "application/json",
		'Authorization': "Bearer x7e8ab32f-9b97-4ff8-b8b9-83499daf91c2",
		'cache-control': "no-cache",
		'Postman-Token': "49e23844-9567-4a6e-b7e3-6ec535e28360"
		}

	response = requests.get(url=URL, data=payload, headers=headers)

	print(response.text)

#Create a file container
def createFileContainer():
	URL = "https://push.cloud.coveo.com/v1/organizations/codeboxxseverineozk4pc34/files"

	payload = ""
	headers = {
		'Content-Type': "application/json",
		'Accept': "application/json",
		'Authorization': "Bearer x7e8ab32f-9b97-4ff8-b8b9-83499daf91c2",
		'cache-control': "no-cache",
		'Postman-Token': "0da43597-fd0d-462a-85d9-d9d81bb09f68"
		}

	response = requests.post(url=URL, data=payload, headers=headers)

	print(response.text)

# mapping of the source
def mappingTheSource():

	URL = "https://platform.cloud.coveo.com/rest/organizations/codeboxxseverineozk4pc34/sources/codeboxxseverineozk4pc34-qym7oenpveuslykl3m5gd5sbim/mappings"

	querystring = {"rebuild":True}

	payload = "{\r\n  \"common\": {\r\n  \t\"rules\":[\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[image]\"],\r\n  \t\t\t\"field\":\"image\"\r\n  \t\t},\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[number]\"],\r\n  \t\t\t\"field\":\"number\"\r\n  \t\t},\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[name]\"],\r\n  \t\t\t\"field\":\"name\"\r\n  \t\t},\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[pokemonType]\"],\r\n  \t\t\t\"field\":\"type\"\r\n  \t\t}\r\n  \t]\r\n  },\r\n  \"types\": [\r\n  \t{\r\n  \t \"rules\":[\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[image]\"],\r\n  \t\t\t\"field\":\"image\"\r\n  \t\t}\r\n\t ],\r\n\t \"type\":\"Image\"\r\n\t},\r\n\t{\r\n\t \"rules\":[\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[number]\"],\r\n  \t\t\t\"field\":\"number\"\r\n  \t\t},\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[name]\"],\r\n  \t\t\t\"field\":\"name\"\r\n  \t\t},\r\n  \t\t{\r\n  \t\t\t\"content\":[\"%[pokemonType]\"],\r\n  \t\t\t\"field\":\"type\"\r\n  \t\t}\r\n\t ],\r\n\t \"type\":\"Text\"\r\n\t }\r\n  ]\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"

	headers = {
		'Content-Type': "application/json",
		'Accept': "application/json",
		'Authorization': "Bearer x46ddd7fb-68fc-4a0c-8065-bfeff565cbe4",
		'User-Agent': "PostmanRuntime/7.11.0",
		'Cache-Control': "no-cache",
		'Postman-Token': "69c6bf91-4575-4b80-a294-04affa26de36,2c3186fa-3863-4a00-b60e-dda7ccd93b16",
		'Host': "platform.cloud.coveo.com",
		'accept-encoding': "gzip, deflate",
		'content-length': "724",
		'Connection': "keep-alive",
		'cache-control': "no-cache"
		}

response = requests.get(url=URL, data=payload, headers=headers, params=querystring)

print(response.text)

#put the container into the source
def putTheContainerContentIntoTheSource():
	URL = "https://push.cloud.coveo.com/v1/organizations/codeboxxseverineozk4pc34/sources/codeboxxseverineozk4pc34-qym7oenpveuslykl3m5gd5sbim/documents/batch"

	querystring = {"fileId":"06f067eb-4860-4350-b89d-69633f233bb0"}

	payload = ""
	headers = {
		'Content-Type': "application/json",
		'Authorization': "Bearer x46ddd7fb-68fc-4a0c-8065-bfeff565cbe4",
		'User-Agent': "PostmanRuntime/7.11.0",
		'Accept': "*/*",
		'Cache-Control': "no-cache",
		'Postman-Token': "7a8e0aea-1c10-4688-9f9b-9439a9b7411b,f304947d-1f9f-4a42-96ba-7d0ea0d1c0f0",
		'Host': "push.cloud.coveo.com",
		'accept-encoding': "gzip, deflate",
		'content-length': "",
		'Connection': "keep-alive",
		'cache-control': "no-cache"
		}

	response = requests.put(url=URL, data=payload, headers=headers, params=querystring)

	print(response.text)

#getTheOrgnisationId()
#createTheSource()
#getTheSourceId()
#mappingTheSource()
#createFileContainer()
#putTheContainerContentIntoTheSource()