var express = require('express');
var bodyParser= require('body-parser');
var unirest = require("unirest");

var connDeets = require('./connDeets');

var req = unirest("GET", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/CUN-sky/MIA-sky/2019-09-01");

req.headers({
	"x-rapidapi-host": connDeets.host,
	"x-rapidapi-key": connDeets.api_key
});

req.query({
	"inboundpartialdate": "2019-12-01"
});

req.end(function (res) {
	if (res.error) throw new Error(res.error);

	var queryMap = new Map ();

	for (quote in res.body["Quotes"]) {
		var price = res.body["Quotes"][quote]["MinPrice"]
		console.log("Price to travel to MIA -> CUN ");
		console.log(price);
	}

	// GOAL: grab price of flight
	var price = res.body["Quotes"][0]["MinPrice"]
	// ---------------------

	// GOAL: direct flight?
	var isDirect = res.body["Quotes"][0]["Direct"]
	// ---------------------

	// GOAL: change number of id to name of flight company
	// traverse carrierIds for outbound flights
	var idToCarr;
	for (var id in res.body["Quotes"][0]["OutboundLeg"]["CarrierIds"]) {
		// traverse all known carriers
		for (var key in res.body["Carriers"]) {
			// check if the carrierIds match the carriers provided and if so change their
			if (res.body["Quotes"][0]["OutboundLeg"]["CarrierIds"][id] == res.body["Carriers"][key]["CarrierId"]) {
				res.body["Quotes"][0]["OutboundLeg"]["CarrierIds"][id] = res.body["Carriers"][key]["Name"]
				idToCarr = res.body["Quotes"][0]["OutboundLeg"]["CarrierIds"][id];
			}
		}
	}

	queryMap.set(price, idToCarr)
	for (var [key, value] of queryMap) {
  	console.log(key + ' : ' + value);
	}
});
