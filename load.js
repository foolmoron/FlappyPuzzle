Client.prototype.load = function () {
	var SPRITE_DESCRIPTIONS = [ // texture filenames
		"redblock.png",
		"blueblock.png",
		"yellowblock.png",
		"greenblock.png",
		"whiteblock.png",
		"bg.png",
		"fg.png",
		"platform.png",
	];	
	var CELLSHEET_DESCRIPTIONS = [ // [ cellsheet filename, number of columns, number of rows ]
		["rainbowblock.png", 4, 1],
	];
	
	SPRITE_DESCRIPTIONS.forEach(function(description) {
		var index = description.split(".")[0].replace(/(\/|\\)/g, ''); // collapse whole path into a no-slash string
		FP.tex[index] = new IgeTexture(FP.SPRITE_DIRECTORY + description);
	}, this);
	CELLSHEET_DESCRIPTIONS.forEach(function(description) {
		var index = description[0].split(".")[0].replace(/(\/|\\)/g, '');
		FP.tex[index] = new IgeCellSheet(FP.SPRITE_DIRECTORY + description[0], description[1], description[2]);
	}, this);
	
	FP.backgroundMusic = new Howl({
		urls: [FP.AUDIO_DIRECTORY + 'bgm.mp3'],
		autoplay: true,
		loop: true,
		volume: 0.75,
	})
};