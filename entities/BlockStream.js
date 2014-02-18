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
		this._blocksSinceRainbow = numBlocks;
		
		this.bounds2d(rightEdge - leftEdge, blockSize * 2)
			.addBehaviour("update", this._update)
			//.texture(FP.tex['whiteblock'])
			;
		this.left = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(leftEdge, 0, 0)
			//.mount(this)
			;
		this.center = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(center, 0, 0)
			.scaleTo(3, 3, 1)
			//.mount(this)
			;
		this.right = new IgeEntity()
			.texture(FP.tex['whiteblock'])
			.dimensionsFromCell()
			.translateTo(rightEdge, 0, 0)
			//.mount(this)
			;
			
		this._blocks = [];
		for (var i = 0; i < numBlocks; i++) {			
			this._blocks[i] = new Block("random")
				.translateTo(rightEdge + (i * blockSize), 0, 0)
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
				
				var nextBlockType = "random";
				if (this._nextBlockRainbow && (this._blocksSinceRainbow >= this._numBlocks)) { // spawn rainbow once every numBlocks at MOST
					nextBlockType = Block.COLOR.RAINBOW;
					this._blocksSinceRainbow = 0;
					this._nextBlockRainbow = false;
				}
				
				block = this._blocks[i] = new Block(nextBlockType)
					.translateTo(this._rightEdge - (this._leftEdge - block._translate.x), 0, 0)
					.mount(this)
					.depth(10)
					;
				this._blocksSinceRainbow++;
			}
			block.translateBy(this._velocityX * dt, 0, 0);
			if (block._translate.x <= this._rightEdge)
				block.mount(this);
		}
	},
	
	clearCenterBlocks: function(evt) {
		var targetPosition = this._center - (this._blockSize * 1.5);
		var targetRadius = this._blockSize / 2 + 1;
		
		var clearedBlocks = [];
		for (var i = 0; i < this._blocks.length; i++) {
			var block = this._blocks[i];
			if (!block.hidden() && block._translate.x >= (targetPosition - targetRadius) && block._translate.x <= (targetPosition + targetRadius)) {
				//found valid block at end of center area, check if next 2 blocks are valid
				var block2 = this._blocks[(i + 1) % this._blocks.length];
				var block3 = this._blocks[(i + 2) % this._blocks.length];
				if ((block2 && !block2.hidden()) && (block3 && !block3.hidden())) {
					//3 blocks at end of center area are valid, pick them
					clearedBlocks.push(block);
					clearedBlocks.push(block2);
					clearedBlocks.push(block3);
					break;
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
	
	velocityX: function(value) {
		if (value === undefined)
			return this._velocityX;
			
		this._velocityX = value;
		return this;
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockStream; }