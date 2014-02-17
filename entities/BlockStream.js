var BlockStream = IgeEntity.extend({
	classId: 'BlockStream',
	
	init: function(leftEdge, center, rightEdge, blockSize, velocityX) {
		IgeEntity.prototype.init.call(this);
		
		this._leftEdge = leftEdge;
		this._center = center;
		this._rightEdge = rightEdge;
		this._blockSize = blockSize;
		this._velocityX = velocityX;
		
		var numBlocks = Math.floor((rightEdge - leftEdge) / blockSize);
		this._numBlocks = numBlocks;
		
		this.texture(FP.tex['whiteblock'])
			.bounds2d(rightEdge - leftEdge, blockSize * 2)
			.addBehaviour("update", this._update)
			;
		this.left = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(leftEdge, 0, 0)
			.mount(this)
			;
		this.left = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(center, 0, 0)
			.scaleTo(3, 3, 1)
			.mount(this)
			;
		this.right = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(rightEdge, 0, 0)
			.mount(this)
			;
			
		this._blocks = [];
		for (var i = 0; i < numBlocks; i++) {			
			this._blocks[i] = new Block("random")
				.translateTo(rightEdge + (i * blockSize), 0, 0)
				.mount(this)
				.depth(10)
				;
		}
	},
	
	_update: function() {
		var dt = ige._tickDelta;
		for (var i = 0; i < this._blocks.length; i++) {
			var block = this._blocks[i];
			if (block._translate.x <= this._leftEdge) {
				block.destroy();
				var nextBlockType = (this._nextBlockRainbow)? Block.COLOR.RAINBOW : "random";
				block = this._blocks[i] = new Block(nextBlockType)
					.translateTo(this._rightEdge - (this._leftEdge - block._translate.x), 0, 0)
					.mount(this)
					.depth(10)
					; 
				this._nextBlockRainbow = false;
			}
			block.translateBy(this._velocityX * dt, 0, 0);
		}
	},
	
	clearCenterBlocks: function(evt) {
		var clearedBlocks = [];
		for (var i = 0; i < this._blocks.length; i++) {
			for (var i = 0; i < this._blocks.length; i++) {
				var block = this._blocks[i];
				if (!block.hidden() && block._translate.x <= (this._center + (this._blockSize * 1.5)) && block._translate.x >= (this._center - (this._blockSize * 1.5))) {
					clearedBlocks.push(block);
				}
			}
		}
		
		if (clearedBlocks.length === 3) {
			for (var i = 0; i < clearedBlocks.length; i++) {
				clearedBlocks[i].hidden(true);
			}
			this._nextBlockRainbow = true;
			
			return clearedBlocks;
		}
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockStream; }