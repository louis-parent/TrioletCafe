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
		
		this.isShowingPosition = false;
		
		this.displayedRouting = null;
		this.routingDestination = null;
		
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
			this.setupCurrentPosition();
			this.setupPositionWatcher();
		}
		else
		{
			this.isGeolocationAvailable = false;
		}
	}
	
	setupCurrentPosition()
	{
		navigator.geolocation.getCurrentPosition((position) => {
			this.updatePositionMarker(position.coords);
		}, (error) => {
			if(error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE || error.code === error.UNKNOWN_ERROR
			)
			{
				this.isGeolocationAvailable = false;
			}
		});
	}
	
	setupPositionWatcher()
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
	
	addCoffeeMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: coffeeIcon });
		marker.bindPopup(data.description);
		this.coffeeGroup.addLayer(marker);
		
		return true;
	}
	
	addSnackMarker(data)
	{
		const marker = L.marker([data.latitude, data.longitude], { icon: snackIcon }).addTo(this.leaflet);
		marker.bindPopup(data.description);
		this.snackGroup.addLayer(marker);
		
		return true;
	}
	
	togglePositionMarker()
	{
		if(this.isGeolocationAvailable)
		{
			if(this.isShowingPosition)
			{
				this.leaflet.removeLayer(this.positionGroup);
				
				if(this.isShowingRouting())
				{
					this.removeDisplayedRouting();
				}
			}
			else
			{
				this.leaflet.addLayer(this.positionGroup);
			}
			
			this.isShowingPosition = !this.isShowingPosition;
			
			return true;
		}
		else
		{
			return false;
		}
	}
	
	removeDisplayedRouting()
	{
		this.displayedRouting.remove();
		
		this.displayedRouting = null;
		this.routingDestination = null;
	}
	
	updatePositionMarker(position)
	{
		if(this.isGeolocationAvailable)
		{
			const waypoint = [position.latitude, position.longitude];
			
			this.positionMarker.setLatLng(waypoint);
			
			if(this.displayedRouting !== null)
			{
				this.displayedRouting.setWaypoints([
					waypoint,
					this.routingDestination
				]);
			}			
			
			return true;
		}
		else
		{
			return false;
		}
	}
	
	togglePedestrianRoutingFromCurrentLocationTo(end)
	{
		if(this.isShowingRouting())
		{
			this.removeDisplayedRouting();
			return true;
		}
		else
		{
			return this.createPedestrianRoutingFromCurrentLocationTo(end);
		}
	}
	
	createPedestrianRoutingFromCurrentLocationTo(end)
	{
		if(this.isGeolocationAvailable)
		{			
			this.routingDestination = L.latLng(end.latitude, end.longitude);
			
			this.displayedRouting = L.Routing.control({
				waypoints: [
					this.positionMarker.getLatLng(),
					this.routingDestination
				],
				router: L.Routing.graphHopper("2416c596-20ba-4079-923b-471cdb741795", {
					urlParameters: {
						vehicle: "foot"
					}
				}),
				routeWhileDragging: true,
				createMarker: function() { return null; }
			}).addTo(this.leaflet);
			
			return true;
		}
		else
		{
			return false;
		}
	}
	
	isShowingPositionMarker()
	{
		return this.isShowingPosition;
	}
	
	isShowingRouting()
	{
		return this.displayedRouting !== null;
	}
	
	enableGeolocation(enabled)
	{
		this.isGeolocationAvailable = enabled;
	}
};
