#!/usr/bin/python

import sys
import json
from csv import reader as csvr

# load cmnd line args
lang = sys.argv[1]
files = sys.argv[2:]

# db templates
db = {"card": {}, "set": {}, "index": {"type":{}}}
index = {'type':{}}

# hardcoded constants
ignore = ['artisturl','relatedlink1','relatedlink2','relatedlink3','allowedprofession']
multi = ['allowedclass', 'keywords']
index_names = {
	"en": {
		"type": "Card Type",
		"type-ally": "Ally",
		"type-ability": "Ability",
		"type-hero": "Hero",
		"type-master_hero": "Master Hero",
		"type-weapon": "Weapon",
		"type-armor": "Armour",
		"type-item": "Item",
		"type-ability_ally": "Ability Ally",
		"type-master-hero": "Master Hero",
		"type-quest": "Quest",
		"type-location": "Location",
		"type-equipment": "Equipment"
	}
}

for fn in files:
	if fn.endswith("-card-data.csv"):
		data_type = "card"
	elif fn.endswith('-set-data.csv'):
		data_type = "set" 
	else:
		continue
		
	rows = csvr(open(fn, 'rb'), delimiter="\t", quotechar='"')
	head = rows.next();

	#card data input
	if data_type == "card":
		for row in rows:
			entry = {}
			#clean ignored entries
			for k in range(len(row)):
				entry[head[k]]=row[k]
			for k in ignore:
				entry.pop(k,'')
		
			#multiple value entries should be arrays
			for k in multi:
				if len(entry[k]):
					entry[k] = entry[k].split(',')
				else:
					entry[k] = []
			
			#add entries
			setname = entry['setname'].lower()
			entry['setname'] = setname
			entry['image'] = "{setname}/{name}.jpg".format(
				name = entry['name'].lower().replace(' ','_').replace('\'','').replace('"',''),
				setname = setname
			)
			entry['searchkey'] = entry['name'].replace('\'','').replace('"','');
			for k in ['allowedclass','keywords']:
				for v in entry[k]:
					entry['searchkey'] = entry['searchkey'] + " " + v
			for k in ['class','faction','type']:
				if len(entry[k]):
					entry['searchkey'] = entry['searchkey'] + " " + entry[k]
			entry['searchkey'] = entry['searchkey'].lower()
			
			
			#record entry
			if not db["card"].has_key(setname):
				db["card"][setname] = {} 
			db["card"][setname][entry["number"]] = entry
	#set data input
	elif data_type == 'set':
		for row in rows:
			entry = {}
			for k in range(len(row)):
				entry[head[k]]=row[k]
			
			setname = entry.pop('setname').lower()
			db['set'][setname] = entry
		

#Build Card Index
for setname, cards in db["card"].items():
	for num, card in cards.items():
		t = card["type"]
		k = t.lower().replace(' ', '_');
		if not index["type"].has_key(k):
			index["type"][k] = []
		index["type"][k].append([setname,num])

db["index"] = {
	"type": {
		"name": index_names[lang]["type"],
		"content": []
	}
}

types = ["hero","master_hero","ally","ability","ability_ally","armor","weapon","item","equipment","quest","location"]
for t in types:
	if index['type'].has_key(t):
		db["index"]["type"]["content"].append({
			"name": index_names[lang]["type-"+t],
			"cards": index["type"][t]
		})

of = open("db.dev.json",'w')
of.write(json.dumps(db, indent=4))
of.close()
of = open("db.json",'w')
of.write(json.dumps(db, separators=(',',':')))
of.close();

print "done"
