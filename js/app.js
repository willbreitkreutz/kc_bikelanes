
L.mapbox.accessToken = 'pk.eyJ1Ijoid2lsbC1icmVpdGtyZXV0eiIsImEiOiItMTJGWEF3In0.HEvuRMMVxBVR5-oDYvudxw';

var map = L.map('map')
  .setView([39.03, -94.58], 12);

//Streetmap base layer
var streetmap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map)

//Darkmatter base layer
var darkStreetmap = 
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
})

//Imagery base layer
var mapquestPhoto = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
maxZoom: 18,
subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});

var mapquestPhotoLabel = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
maxZoom: 18,
subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
maxZoom: 19,
subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);



var urlBldr = {
	start:'http://services1.arcgis.com/wVKKFkRVWo0dYfBq/arcgis/rest/services/Bikeways_existing_Dec2014/FeatureServer/0/query?where=FACILITY_T%3D%27',
	bikeLanes:'BL',
	signedBikeRoute:'SBR',
	shareTheRoadSigns:'SR',
	shareTheRoadNoSigns:'SRNS',
	pedHikeTrail:'PHT',
	sharedUsePath:'SUP',
	mountainBikeTrail:'MBT',
	equestrianTrail:'Equestrian+Trail',
	end:'%27+AND+%28STATE%3D%27KS%27+OR+STATE%3D%27MO%27%29&units=esriSRUnit_Meter&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnZ=false&returnM=false&f=pgeojson&outSR=4326',

	getUrl:function(prop){
		return this.start + this[prop] + this.end;
	}
}

var styleBldr = {
	bikeLanes:function(f){
		return {
			color: '#ec008c',
			weight: 4,
			opacity:0.8,
			//dashArray:'5, 10',
			lineJoin:'round'
		};
	},
	bikeRoutes:function(f){
		return {
			color: '#ec008c',
			weight: 4,
			opacity:0.8,
			dashArray:'5, 10',
			lineJoin:'round'
		};
	},
	bikePaths:function(f){
		return {
			color: '#12acef',
			weight: 4,
			opacity:0.8,
			//dashArray:'5, 10',
			lineJoin:'round'
		};
	}
}

var bikeLanes = L.geoJson(null,{
	style: styleBldr.bikeLanes,
	onEachFeature: function (feature, layer) {
		layer.bindPopup(feature.properties.Facility_N);
	}
}).addTo(map);

var bikeLanesLegend = L.geoJson(null,{
	style: styleBldr.bikeLanes,
});

var bikeLanesGeoJson, bikeRoutesGeoJson, bikePathsGeoJson;

var bikeRoutes = L.geoJson(null,{
	style: styleBldr.bikeRoutes,
	onEachFeature: function (feature, layer) {
		layer.bindPopup(feature.properties.Facility_N);
	}
}).addTo(map);

var bikeRoutesLegend = L.geoJson(null,{
	style: styleBldr.bikeRoutes,
});

var bikePaths = L.geoJson(null,{
	style: styleBldr.bikePaths,
	onEachFeature: function (feature, layer) {
		layer.bindPopup(feature.properties.Facility_N);
	}
}).addTo(map);

var bikePathsLegend = L.geoJson(null,{
	style: styleBldr.bikePaths,
});

Ajax({
	url:urlBldr.getUrl('bikeLanes'),
	success:function(data){
        bikeLanesLegend.addData(data);
        bikeLanesLegend.addTo(legendMaps.bikeLaneMap);
		bikeLanes.addData(data);
	}
});

Ajax({
	url:urlBldr.getUrl('signedBikeRoute'),
	success:function(data){
		bikeRoutesLegend.addData(data);
		bikeRoutesLegend.addTo(legendMaps.bikeRouteMap);
		bikeRoutes.addData(data);
	}
});

Ajax({
    url:urlBldr.getUrl('sharedUsePath'),
    success:function(data){
    	bikePathsLegend.addData(data);
    	bikePathsLegend.addTo(legendMaps.bikePathMap);
        bikePaths.addData(data);
    }
});


var basemaps = {
	"Street Map":streetmap,
  	"Darkmatter":darkStreetmap,
	"Aerial Photo":mapquestPhoto,
	"Aerial Photo with Streets":mapquestPhotoLabel
}

var overlays = {
	"Bike Lanes":bikeLanes,
	"Signed Bike Routes":bikeRoutes,
	"Shared Use Paths":bikePaths
};

L.control.layers(basemaps, overlays).addTo(map);
