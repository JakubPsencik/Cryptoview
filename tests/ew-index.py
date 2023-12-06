from bs4 import BeautifulSoup
import requests

def getDivsWithClassAndChildren():
	response = requests.get('https://www.binance.com/en/ew-index/')  # Replace with the actual URL
	html = response.content

	soup = BeautifulSoup(html, 'html.parser')
	divsWithClass = soup.find_all('div', class_='css-yyvsvt')

	for div in divsWithClass:
		children = div.find_all()
		for child in children:
			print(child)

getDivsWithClassAndChildren()
