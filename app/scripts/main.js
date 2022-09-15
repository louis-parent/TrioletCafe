function showWarning(map)
{
	let confirmed = confirm("La géolocalisation a une meilleure précision sur les appareils équipés de GPS, à utiliser avec recul sinon.");
	map.enableGeolocation(confirm);
}

function initializeMap(map)
{
	fetch("http://localhost:3000/coffee").then(data => {
		return data.json();
	}).then(coffees => {
		for(const coffee of coffees)
		{
			map.addCoffeeMarker(coffee);
		}	
	});

	fetch("http://localhost:3000/snack").then(data => {
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
		const done = map.togglePedestrianRoutingFromCurrentLocationTo({
			latitude: 43.63304914328182,
			longitude: 3.862113786201999
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

window.addEventListener("load", () => {
	fetch("http://localhost:3000/triolet").then(data => {
		return data.json();
	}).then(location => {
		const map = new SlippyMap(location, {
			default: location.zoom,
			max: 19
		});
		
		showWarning(map);
		initializeMap(map);
		addEventListeners(map);		
	});
});
