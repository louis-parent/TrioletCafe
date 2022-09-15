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
	let wasWarningShown = false;
	
	document.querySelector("#center").addEventListener("click", () => {
		map.resetView();
	});

	document.querySelector("#position").addEventListener("click", (event) => {
			if(wasWarningShown || confirm("La géolocalisation a une meilleure précision sur les appareils équipés de GPS, à utiliser avec recul sinon."))
			{
				wasWarningShown = true;
				let done = map.togglePositionMarker();
				
				if(done)
				{
					event.target.classList.toggle("enabled");
				}
				else
				{
					alert("La géolocalisation est indisponible, essayez de recharger la page");
				}
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
