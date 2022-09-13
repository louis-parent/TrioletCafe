class SlippyMap
{
	static openStreetMapConfig = {
		url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution: "© OpenStreetMap"
	};
	
	constructor(center, zoom, id)
	{
		this.center = {
			latitude: center.latitude,
			longitude: center.longitude
		};
		
		this.maxZoom = zoom.max;		
		
		this.displayedRouting = null;
		
		this.setupTile();
		this.setupLayerGroups();
		this.setupLeaflet(zoom.default, id);
	}
	
	setupTile()
	{
		this.tile = L.tileLayer(SlippyMap.openStreetMapConfig.url, {
			maxZoom: this.maxZoom,
			attribution: SlippyMap.openStreetMapConfig.attribution
		});
	}
	
	setupLayerGroups()
	{
		this.coffeeGroup = L.layerGroup([]);
		this.snackGroup = L.layerGroup([]);
		
		this.layerControl = L.control.layers({}, {
			"Café": this.coffeeGroup,
			"Snack": this.snackGroup
		});
	}
	
	setupLeaflet(defaultZoom, id)
	{
		this.leaflet = L.map(id || "map").setView([this.center.latitude, this.center.longitude], defaultZoom);
		this.leaflet.addLayer(this.coffeeGroup);
		this.leaflet.addLayer(this.snackGroup);
		
		this.tile.addTo(this.leaflet);
		this.layerControl.addTo(this.leaflet);
	}
	
	addCoffeeMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: coffeeIcon });
		marker.bindPopup("Disponibilité : <i>" + data.amount + " machines</i>");
		this.coffeeGroup.addLayer(marker);
	}
	
	addSnackMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: snackIcon }).addTo(this.leaflet);
		marker.bindPopup("Disponibilité : <i>" + data.amount + " machines</i>");
		this.snackGroup.addLayer(marker);
	}
	
	createPedestrianRouting(start, end)
	{
		if(this.displayedRouting !== null)
		{
			this.displayedRouting.remove();
		}
		
		this.displayedRouting = L.Routing.control({
			waypoints: [
				L.latLng(start.latitude, start.longitude),
				L.latLng(end.latitude, end.longitude)
			],
			router: L.Routing.graphHopper("2416c596-20ba-4079-923b-471cdb741795", {
				urlParameters: {
					vehicle: "foot"
				}
			}),
			routeWhileDragging: true,
			createMarker: function() { return null; }
		}).addTo(this.leaflet);
	}
};
