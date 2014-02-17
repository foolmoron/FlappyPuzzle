var Platform = IgeEntity.extend({
	classId: 'Platform',
	
	/* rows
	  [2, 0] [2, 1] [2, 2]
	  [1, 0] [1, 1] [1, 2]
	  [0, 0] [0, 1] [0, 2]
	*/
	/* lines
	0  1  2  3  4
	  [] [] []  5
	  [] [] []  6
	  [] [] []  7
	*/
	LINES: [
		[[2, 0], [1, 1], [0, 2]],
		[[2, 0], [1, 0], [0, 0]],
		[[2, 1], [1, 1], [0, 1]],
		[[2, 2], [1, 2], [0, 2]],
		[[2, 2], [1, 1], [0, 0]],
		[[2, 0], [2, 1], [2, 2]],
		[[1, 0], [1, 1], [1, 2]],
		[[0, 0], [0, 1], [0, 2]],
	],
	LINE_POINT_FONT: "16pt Arial bold",
	LINE_POINT_COLOR_SUCCESS: "#ffffff",
	LINE_POINT_COLOR_FAIL: "#ff0000",
	LINE_POINT_TEXT_OFFSETS: [ // line point text offsets in blockSize units
		[-2, -3],
		[-1, -3],
		[0, -3],
		[1, -3],
		[2, -3],
		[2, -2],
		[2, -1],
		[2, -0],
	],
	
	init: function (blockSize) {
		IgeEntity.prototype.init.call(this);
		
		this._blockSize = blockSize;
		this._rows = [];
		
		this.linePointTexts = [];
		for (var i = 0; i < this.LINE_POINT_TEXT_OFFSETS.length; i++) {
			var offset = this.LINE_POINT_TEXT_OFFSETS[i];
			var text = new IgeFontEntity()
				.id('text' + i)
				.nativeFont(this.LINE_POINT_FONT)
				.colorOverlay(this.LINE_POINT_COLOR_SUCCESS)
				.text("")
				.translateTo(offset[0] * this._blockSize, offset[1] * this._blockSize, 0)
				.mount(this)
				;
			this.linePointTexts.push(text);
		}
		
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
		return this;
	},
	
	clearRows: function() {
		for (var i = 0; i < this._rows.length; i++) {
			var row = this._rows[i];
			for (var j = 0; j < row.length; j++) {
				row[j].destroy();
			}
		}
		this._rows = [];
		this.setPointsText(null);
		return this;
	},
	
	rowCount: function() {
		return this._rows.length;
	},
	
	evaluateLines: function() {
		linePoints = [false, false, false, false, false, false, false, false];
		if (this._rows.length !== 3) {
			return linePoints;
		}
		
		for (var i = 0; i < this.LINES.length; i++) {
			var line = this.LINES[i];
			var block1 = this._rows[line[0][0]][line[0][1]];
			var block2 = this._rows[line[1][0]][line[1][1]];
			var block3 = this._rows[line[2][0]][line[2][1]];
			
			var failed1and2 = (block1.type() !== block2.type()) && block1.type() !== Block.COLOR.RAINBOW && block2.type() !== Block.COLOR.RAINBOW;
			var failed2and3 = (block2.type() !== block3.type()) && block2.type() !== Block.COLOR.RAINBOW && block3.type() !== Block.COLOR.RAINBOW;
			var failed1and3 = (block1.type() !== block3.type()) && block1.type() !== Block.COLOR.RAINBOW && block3.type() !== Block.COLOR.RAINBOW;
			if (!failed1and2 && !failed2and3 && !failed1and3) {
				linePoints[i] = true;
			}
		}
		return linePoints;
	},
	
	setPointsText: function(linePoints) {
		if (!linePoints) {
			for (var i = 0; i < this.linePointTexts.length; i++) {
				this.linePointTexts[i].text("");
			}
			return this;
		}
			
		var lineTexts = ["X", "X", "X", "X", "X", "X", "X", "X"];
		lineTexts = linePoints.map(function(point) { if (point) return "+1"; else return "X"; });
		for (var i = 0; i < lineTexts.length; i++) {
			var text = lineTexts[i];
			var color = (linePoints[i]) ? this.LINE_POINT_COLOR_SUCCESS : this.LINE_POINT_COLOR_FAIL;
			this.linePointTexts[i].text(text)
				.colorOverlay(color)
				;
		}
		return this;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Platform; }