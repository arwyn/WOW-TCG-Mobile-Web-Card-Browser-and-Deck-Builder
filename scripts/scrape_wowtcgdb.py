#!/usr/bin/python

import sys
from urllib2 import urlopen 
import lxml.html as html
from urlparse import urlparse

"""
href_m = sys.argv[1]
phref_m = urlparse(href_m)

print href_m
sys.exit()
url_m = urlopen(href_m)

doc_m = html.document_fromstring(url_m.read());

for href_c in doc_m.xpath("//table[@id='ctl00_body_GridView1']//tr/td[2]//a/@href"):
	href_c = "{scheme}://{host}/{url}".format(scheme = phref_m.scheme, host = phref_m.netloc, url = href_c)
	url_c = urlopen(href_c)
	
	doc_c = html.document_fromstring(url_c.read())
	"""
if True:
	doc_c = html.document_fromstring(open("debug.html","r").read())
	row = {
		"type": doc_c.xpath("//span[@id='ctl00_body_FormView1_typeLabel']").pop().text,
		"faction": doc_c.xpath("//span[@id='ctl00_body_FormView1_factionLabel']").pop().text,
		"supertype": doc_c.xpath("//span[@id='ctl00_body_FormView1_supertypeLabel']").pop().text,
		"subtype": doc_c.xpath("//span[@id='ctl00_body_FormView1_subtypeLabel']").pop().text,
		"race": doc_c.xpath("//span[@id='ctl00_body_FormView1_raceLabel']").pop().text,				
		"class": doc_c.xpath("//span[@id='ctl00_body_FormView1_classLabel']").pop().text,
		"talent": doc_c.xpath("//span[@id='ctl00_body_FormView1_talentLabel']").pop().text,
		"keywords": doc_c.xpath("//span[@id='ctl00_body_FormView1_keywordsLabel']").pop().text,				
		"professions": doc_c.xpath("//span[@id='ctl00_body_FormView1_professionsLabel']").pop().text,				
		"atktype": doc_c.xpath("//span[@id='ctl00_body_FormView1_atktypeLabel']").pop().text,
		"allowedclass": doc_c.xpath("//span[@id='ctl00_body_FormView1_allowedclassLabel']").pop().text,
		"allowedrace": doc_c.xpath("//span[@id='ctl00_body_FormView1_allowedraceLabel']").pop().text,				
		"allowedprofession": doc_c.xpath("//span[@id='ctl00_body_FormView1_allowedprofessionLabel']").pop().text,
		"allowedtalent": doc_c.xpath("//span[@id='ctl00_body_FormView1_allowedtalentLabel']").pop().text,				
		"allowedrep": doc_c.xpath("//span[@id='ctl00_body_FormView1_allowedrepLabel']").pop().text,
		"rules": reduce(lambda x,y: x+html.tostring(y), doc_c.xpath("//span[@id='ctl00_body_FormView1_rulesLabel']").pop().getchildren(), ''),
		"cost": doc_c.xpath("//span[@id='ctl00_body_FormView1_costLabel']").pop().text,
		"strikecost": doc_c.xpath("//span[@id='ctl00_body_FormView1_strikecostLabel']").pop().text,				
		"atk": doc_c.xpath("//span[@id='ctl00_body_FormView1_atkLabel']").pop().text,				
		"health": doc_c.xpath("//span[@id='ctl00_body_FormView1_healthLabel']").pop().text,
		"def": doc_c.xpath("//span[@id='ctl00_body_FormView1_defLabel']").pop().text,
		"flavor": doc_c.xpath("//span[@id='ctl00_body_FormView1_flavorLabel']").pop().text,				
		"number": doc_c.xpath("//span[@id='ctl00_body_FormView1_numberLabel']").pop().text,
		"rarity": doc_c.xpath("//span[@id='ctl00_body_FormView1_rarityLabel']").pop().text,				
		"setname": doc_c.xpath("//span[@id='ctl00_body_FormView1_Label4']").pop().text,				
		"rulings": doc_c.xpath("//span[@id='ctl00_body_FormView1_Label2']").pop().text,
		"notes": doc_c.xpath("//span[@id='ctl00_body_FormView1_Label3']").pop().text
	}
	print row
	sys.exit()
	
