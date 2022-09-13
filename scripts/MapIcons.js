const CoffeeIcon = L.Icon.extend({
	options: {
		iconUrl: 'assets/coffee.png',
		iconSize:     [32, 32],
		iconAnchor:   [16, 32],
		popupAnchor:  [0, -32]
	}
});

const SnackIcon = L.Icon.extend({
	options: {
		iconUrl: 'assets/snack.png',
		iconSize:     [32, 32],
		iconAnchor:   [16, 32],
		popupAnchor:  [0, -32]
	}
});

const coffeeIcon = new CoffeeIcon();
const snackIcon = new SnackIcon();
