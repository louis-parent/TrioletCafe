class SlippyMap
{
	static openStreetMapConfig = {
		url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution: "© OpenStreetMap"
	};
	
	constructor(centerLatitude, centerLongitude, defaultZoom, maxZoom, id)
	{
		this.center = {
			latitude: centerLatitude,
			longitude: centerLongitude
		};
		
		this.maxZoom = maxZoom;
		
		this.leaflet = L.map(id || "map").setView([centerLatitude, centerLongitude], defaultZoom);
		
		this.displayedRouting = null;
	}
	
	setTile(tileConfig)
	{
		let config = tileConfig || SlippyMap.openStreetMapConfig;
		
		L.tileLayer(config.url, {
			maxZoom: this.maxZoom,
			attribution: config.attribution
		}).addTo(this.leaflet);
	}
	
	addCoffeeMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: coffeeIcon }).addTo(this.leaflet);
		marker.bindPopup("Disponibilité : <i>" + data.amount + " machines</i>");
	}
	
	addSnackMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: snackIcon }).addTo(this.leaflet);
		marker.bindPopup("Disponibilité : <i>" + data.amount + " machines</i>");
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
