var Block = IgeEntity.extend({
	classId: 'Block',
	
	init: function(type) {
		IgeEntity.prototype.init.call(this);
		
		this.type(type);
		this.hidden(false);
		
		this._rainbowCell = 0;
		this._rainbowTimer = 0;
		this.RAINBOW_INTERVAL = 50; //s
		
		this.dimensionsFromCell()
			.addBehaviour('animateRainbow', this._animateRainbow);
			;
	},
	
	_animateRainbow: function() {
		if (!this._isRainbow)
			return;
			
		this._rainbowTimer += ige._tickDelta;
		if (this._rainbowTimer >= this.RAINBOW_INTERVAL) {				
			var numCells = this.texture()._cells[1].length;
			
			if (Math.random() > 0.5) // mix things up a bit
				this._rainbowCell++;
			
			this._rainbowCell = (this._rainbowCell + 1) % numCells;
			this.cell(this._rainbowCell + 1); // cells indexed at 1
			this._rainbowTimer = 0;
		}
	},
	
	type: function(type) {
		if (type == undefined)
			return this._type;
			
		if (type === "random") {
			var colorKeys = Object.keys(Block.COLOR);
			colorKeys.splice(colorKeys.indexOf("RAINBOW"), 1);
			var randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
			type = Block.COLOR[randomKey];
		}
		
		this._type = type;
		this._isRainbow = false;
		switch (type) {
		case Block.COLOR.RED:
			this.texture(FP.tex['redblock']);
			this._
			break;
		case Block.COLOR.BLUE:
			this.texture(FP.tex['blueblock']);
			break;
		case Block.COLOR.GREEN:
			this.texture(FP.tex['greenblock']);
			break;
		case Block.COLOR.YELLOW:
			this.texture(FP.tex['yellowblock']);
			break;
		case Block.COLOR.ORANGE:
			this.texture(FP.tex['orangeblock']);
			break;
		case Block.COLOR.RAINBOW:
			this.texture(FP.tex['rainbowblock']);
			this._isRainbow = true;
			break;
		}
		return this;
	},
	
	hidden: function(toggle) {
		if (toggle === undefined)
			return this._hidden;
			
		this._hidden = toggle;
		if (toggle) {
			this.opacity(0);
		} else {
			this.opacity(1);
		}
		return this;
	},
});
Block.COLOR = { RED: 'red', BLUE: 'blue', GREEN: 'green', YELLOW: 'yellow', ORANGE: 'orange', RAINBOW: 'rainbow' };

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }