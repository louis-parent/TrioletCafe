function initializeMap(map)
{
	fetch("http://localhost:3000/coffee").then(data => {
		return data.json();
	}).then(coffees => {
		for(let coffee of coffees)
		{
			map.addCoffeeMarker(coffee);
		}	
	});

	fetch("http://localhost:3000/snack").then(data => {
		return data.json();
	}).then(snacks => {
		for(let snack of snacks)
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
		if(map.isGeolocationAvailable)
		{
			event.target.classList.toggle("enabled");
			map.togglePositionMarker();
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
		
		initializeMap(map);
		addEventListeners(map);		
	});
});
