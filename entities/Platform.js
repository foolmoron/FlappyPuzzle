var Platform = IgeEntity.extend({
	classId: 'Platform',
	
	init: function (blockSize) {
		IgeEntity.prototype.init.call(this);
		
		this._blockSize = blockSize;
		this._rows = [];
		
		this.bg = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(0, blockSize, 0)
			.scaleTo(3, 1, 1)
			.mount(this)
			;			
	},
	
	addRow: function(blockType1, blockType2, blockType3) {
		var currentRow = this._rows.length;
		if (currentRow >= 3) {
			this.clearRows();
			return;
		}
		
		var block1 = new Block(blockType1);
		var block2 = new Block(blockType2);
		var block3 = new Block(blockType3);		
		this._rows[currentRow] = [block1, block2, block3];
		
		block1.translateTo(-this._blockSize, -currentRow * this._blockSize, 0)
			.mount(this);
		block2.translateTo(0, -currentRow * this._blockSize, 0)
			.mount(this);
		block3.translateTo(this._blockSize, -currentRow * this._blockSize, 0)
			.mount(this);
	},
	
	clearRows: function() {
		for (var i = 0; i < this._rows.length; i++) {
			var row = this._rows[i];
			for (var j = 0; j < row.length; j++) {
				row[j].destroy();
			}
		}
		this._rows = [];
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Platform; }