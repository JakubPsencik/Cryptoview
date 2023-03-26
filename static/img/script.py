import requests

urls = open("urls.txt", "r")
data = urls.read().split("\n")
''''''
for url in data:
	#print(url)
	url.replace('"','')
	imgName = url.replace("https://cryptologos.cc/logos/","")
	imgName = imgName[:imgName.index(".")]
	imgName = imgName.replace('"','')
	'''
	if(".png?" in url):
		imgName += ".png"
	elif (".svg?" in url):
		imgName += ".svg"
	else:
		imgName += ".jpg"
	'''
	#print(imgName)
	with open("{name}.svg".format(name = imgName), 'wb') as handle:
		param = url[url.rindex('/')+1:]
		#print(param)
		response = requests.get("https://cryptologos.cc/logos/{param1}".format(param1 = param), stream=True)
		#print(response.url)
		if not response.ok:
			print(response)

		for block in response.iter_content(2048):
			if not block:
				break

			handle.write(block)