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

const PositionIcon = L.Icon.extend({
	options: {
		iconUrl: 'assets/person.png',
		iconSize:     [48, 48],
		iconAnchor:   [24, 48],
		popupAnchor:  [0, -48]
	}
});

const coffeeIcon = new CoffeeIcon();
const snackIcon = new SnackIcon();
const positionIcon = new PositionIcon();
