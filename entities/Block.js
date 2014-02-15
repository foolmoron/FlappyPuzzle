var Block = IgeEntity.extend({
	classId: 'Block',
	
	init: function(type) {
		IgeEntity.prototype.init.call(this);
		
		if (type === "random") {
			var colorKeys = Object.keys(Block.COLOR);
			var randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
			type = Block.COLOR[randomKey];
		}
		this.type(type);
		this.hidden(false);
		
		this.dimensionsFromCell()
			;
	},
	
	type: function(type) {
		if (type == undefined)
			return this._type;
		
		this._type = type;
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
Block.COLOR = { RED: 'red', BLUE: 'blue', GREEN: 'green', YELLOW: 'yellow' };

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }