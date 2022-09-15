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
		
		this.zoom = {
			max: zoom.max,
			default: zoom.default
		};		
		
		this.isGeolocationAvailable = true;
		this.isFollowingPosition = false;
		this.displayedRouting = null;
		
		this.setupTile();
		this.setupLayerGroups();
		this.setupLeaflet(id);
		
		this.setupGeolocation();
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
		this.positionMarker = L.marker([0, 0], { icon: positionIcon });
		this.positionGroup = L.layerGroup([this.positionMarker]);
		
		this.coffeeGroup = L.layerGroup([]);
		this.snackGroup = L.layerGroup([]);
		
		this.layerControl = L.control.layers({}, {
			"Café": this.coffeeGroup,
			"Snack": this.snackGroup
		});
	}
	
	setupLeaflet(id)
	{
		this.leaflet = L.map(id || "map");
		this.resetView();
		
		this.leaflet.addLayer(this.coffeeGroup);
		this.leaflet.addLayer(this.snackGroup);
		
		this.tile.addTo(this.leaflet);
		this.layerControl.addTo(this.leaflet);
	}
	
	resetView()
	{
		this.leaflet.setView([this.center.latitude, this.center.longitude], this.zoom.default);
	}
	
	setupGeolocation()
	{
		if(navigator.geolocation)
		{
			navigator.geolocation.watchPosition((position) => {
				this.updatePositionMarker(position.coords);
			}, (error) => {
				if(error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE || error.code === error.UNKNOWN_ERROR
				)
				{
					this.isGeolocationAvailable = false;
				}
			});
		}
		else
		{
			this.isGeolocationAvailable = false;
		}
	}
	
	addCoffeeMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: coffeeIcon });
		marker.bindPopup(data.description);
		this.coffeeGroup.addLayer(marker);
	}
	
	addSnackMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: snackIcon }).addTo(this.leaflet);
		marker.bindPopup(data.description);
		this.snackGroup.addLayer(marker);
	}
	
	togglePositionMarker()
	{
		if(this.isFollowingPosition)
		{
			this.leaflet.removeLayer(this.positionGroup);
		}
		else
		{
			this.leaflet.addLayer(this.positionGroup);
		}
		
		this.isFollowingPosition = !this.isFollowingPosition;
	}
	
	updatePositionMarker(position)
	{
		if(this.isFollowingPosition)
		{
			this.positionMarker.setLatLng([position.latitude, position.longitude]);
		}
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
