var Block = IgeEntity.extend({
	classId: 'Block',
	
	init: function(type) {
		IgeEntity.prototype.init.call(this);
		
		if (type === "random") {
			var colorKeys = Object.keys(Block.COLOR);
			var randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
			type = Block.COLOR[randomKey];
		}
		this._type = type;
		this._hidden = false;
		
		switch (type) {
		case Block.COLOR.RED:
			this.texture(FP.tex['redblock']);
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
		}
		
		this.dimensionsFromCell()
			;
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
	},
});
Block.COLOR = { RED: 'red', BLUE: 'blue', GREEN: 'green', YELLOW: 'yellow' };

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }