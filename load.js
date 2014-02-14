Client.prototype.load = function () {
	var SPRITE_DESCRIPTIONS = [ // texture filenames
		"redblock.png",
		"blueblock.png",
		"yellowblock.png",
		"greenblock.png",
		"whiteblock.png",
	];	
	SPRITE_DESCRIPTIONS.forEach(function(description) {
		var index = description.split(".")[0].replace(/(\/|\\)/g, ''); // collapse whole path into a no-slash string
		FP.tex[index] = new IgeTexture(FP.SPRITE_DIRECTORY + description);
	}, this);
	
	FP.backgroundMusic = new Howl({
		urls: [FP.AUDIO_DIRECTORY + 'bgm.mp3'],
		autoplay: true,
		loop: true,
		volume: 0.75,
	})
};