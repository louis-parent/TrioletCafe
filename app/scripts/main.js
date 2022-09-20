function getAPIBaseURL()
{
	const API_PORT = 3000;
	const url = new URL(document.URL);
	
	return url.protocol + "//" + url.hostname + ":" + API_PORT;
}

function showWarning(map)
{
	let confirmed = confirm("La géolocalisation a une meilleure précision sur les appareils équipés de GPS, à utiliser avec recul sinon.");
	map.enableGeolocation(confirm);
}

function initializeMap(map)
{
	fetch(getAPIBaseURL() + "/coffee").then(data => {
		return data.json();
	}).then(coffees => {
		for(const coffee of coffees)
		{
			map.addCoffeeMarker(coffee);
		}	
	});

	fetch(getAPIBaseURL() + "/snack").then(data => {
		return data.json();
	}).then(snacks => {
		for(const snack of snacks)
		{
			map.addSnackMarker(snack);
		}	
	});
}

function addEventListeners(map)
{	
	document.querySelector("#center").addEventListener("click", () => {
		map.resetView();
	});

	document.querySelector("#position").addEventListener("click", (event) => {
		const done = map.togglePositionMarker();
		
		if(done)
		{
			event.target.classList.toggle("enabled");
			
			if(!map.isShowingRouting())
			{
				document.querySelector("#route").classList.remove("enabled");
			}
		}
		else
		{
			alert("La géolocalisation est indisponible, essayez de recharger la page");
		}
	});
	
	document.querySelector("#route").addEventListener("click", (event) => {
		const position = map.getCurrentPosition();
		
		if(position !== null)
		{
			fetch(getAPIBaseURL() + "/nearby/coffee/" + position.latitude + "/" + position.longitude).then(data => {
				return data.json();
			}).then(destination => {
				const done = map.togglePedestrianRoutingFromCurrentLocationTo({
					latitude: destination.latitude,
					longitude: destination.longitude
				});
				
				if(done)
				{
					event.target.classList.toggle("enabled");
					
					if(!map.isShowingPositionMarker())
					{
						document.querySelector("#position").click();
					}
				}
				else
				{
					alert("La géolocalisation est indisponible, essayez de recharger la page");
				}
			});
		}
		else
		{
			alert("La géolocalisation est indisponible, essayez de recharger la page");
		}
	});
	
	map.on("routeup", info => {
		document.querySelector("#info").classList.remove("hide");
		document.querySelector("#time").innerText = Math.round(info.totalTime % 3600 / 60);
		document.querySelector("#distance").innerText = Math.floor(info.totalDistance);
	});
	
	map.on("routedown", info => {
		document.querySelector("#info").classList.add("hide");
		document.querySelector("#time").innerText = 0;
		document.querySelector("#distance").innerText = 0;
	});
}

window.addEventListener("load", () => {
	fetch(getAPIBaseURL() + "/triolet").then(data => {
		return data.json();
	}).then(location => {
		const map = new SlippyMap(location, {
			default: location.zoom,
			max: 19
		});
		
		// showWarning(map);
		initializeMap(map);
		addEventListeners(map);		
	});
});
