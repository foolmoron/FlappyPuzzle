// Global object to hold all our globals... bad practice? whatever
FP = window.FP || {};

FP.SPRITE_DIRECTORY = "./sprites/";
FP.FONTSHEET_DIRECTORY = "./font/";
FP.AUDIO_DIRECTORY = "./audio/";

FP.SPEED = -0.75;
FP.BLOCK_SIZE = 32;
FP.PLATFORM_CENTER = -128;
FP.HIGHSCORE_COLOR = '#cace50';
FP.MAX_BLOCK_STREAK = 3; // most same-color blocks that can show up in a row

FP.tex = {}; // holds all textures
FP.font = {}; // hold all fontsheets

var Client = IgeClass.extend({
	classId: 'Client',
	
	init: function () {
		// Engine setup
		ige.globalSmoothing(true);
		//ige.addComponent(IgeEditorComponent);
		
		// Setup this
		var self = this;
		
		// Wait for our textures to load before continuing
		ige.on('texturesLoaded', function () {
			// Create the HTML canvas
			ige.createFrontBuffer(true);

			ige.start(function (success) {
				if (success) {
					ige.viewportDepth(true);
					
					self.setupScene();
					self.setupEntities();
				}
			});
		});
		
		this.load();
	},
	
	setupScene: function() {
		var self = this;
		this.mainScene = new IgeScene2d()
			.id('mainScene');

		// Create the main viewport
		this.vpMain = new IgeViewport()
			.id('vpMain')
			.autoSize(true)
			.scene(this.mainScene)
			.drawBounds(false)
			.drawBoundsData(false)
			//.drawCompositeBounds(true)
			.mount(ige)
			;
		this.bgScene = new IgeScene2d()
			.id('bgScene')
			.layer(1)
			.translateTo(0, 0, 0)
			.mount(this.mainScene)
			;
		this.gameScene = new IgeScene2d()
			.id('gameScene')
			.layer(2)
			.translateTo(0, 0, 0)
			.mount(this.mainScene)
			;
		this.fgScene = new IgeScene2d()
			.id('fgScene')
			.layer(3)
			.translateTo(0, 0, 0)
			.mount(this.mainScene)
			;
			
		this.vpMain._oldResizeEvent = this.vpMain._resizeEvent;
		this.vpMain._resizeEvent = function(event) { // transplant additional code into existing resize handler
			self.vpMain._oldResizeEvent.call(self.vpMain, event);
			self._resizeEvent.call(self);
		}
		this.vpMain._resizeEvent();
	},
	
	setupEntities: function() {
		var self = this;
		
		this.bg = new IgeEntity()
			.texture(FP.tex['bg'])
			.dimensionsFromCell()
			.mount(this.bgScene)
			;
		this.fg = new IgeEntity()
			.texture(FP.tex['fg'])
			.dimensionsFromCell()
			.mount(this.fgScene)
			;
			
		this.successMessage = new IgeEntity()
			.texture(FP.tex['puzzlesuccess'])
			.dimensionsFromCell()
			.opacity(0)
			.translateTo(-88, -15, 0)
			.mount(this.gameScene)
			;
		this.failMessage = new IgeEntity()
			.texture(FP.tex['puzzlefail'])
			.dimensionsFromCell()
			.opacity(0)
			.translateTo(-88, -15, 0)
			.mount(this.gameScene)
			;
		this.platform = new Platform(FP.BLOCK_SIZE, this.successMessage, this.failMessage)
			.translateTo(FP.PLATFORM_CENTER, 125, 0)
			.mount(this.gameScene)
			;
		this.stream = new BlockStream(-320, FP.PLATFORM_CENTER, 352, FP.BLOCK_SIZE, FP.SPEED)
			.translateTo(0, -73, 0)
			.mount(this.gameScene)
			;
		
		this.currentLevel = 0;
		this.currentScore = 0;
		this.levelHigh = localStorage.getItem('levelHigh') || 0;
		this.scoreHigh = localStorage.getItem('scoreHigh') || 0;
		this.levelText = new IgeFontEntity()
			.texture(FP.font['whitenumbers'])
			.textAlignX(1)
			.width(200)
			.translateTo(258, 15, 0)
			.text("00000")
			.depth(10)
			.mount(this.fgScene)
			;
		this.levelHighText = new IgeFontEntity()
			.texture(FP.font['goldnumbers'])
			.textAlignX(1)
			.width(200)
			.translateTo(258, 66, 0)
			.text(this.padScoreText(this.levelHigh))
			.depth(10)
			.mount(this.fgScene)
			;
		this.scoreText = new IgeFontEntity()
			.texture(FP.font['whitenumbers'])
			.textAlignX(1)
			.width(200)
			.translateTo(258, 153, 0)
			.text("00000")
			.depth(10)
			.mount(this.fgScene)
			;
		this.scoreHighText = new IgeFontEntity()
			.texture(FP.font['goldnumbers'])
			.textAlignX(1)
			.width(200)
			.translateTo(258, 204, 0)
			.text(this.padScoreText(this.scoreHigh))
			.depth(10)
			.mount(this.fgScene)
			;
		
		this.volumeToggle = new IgeEntity()
			.texture(FP.tex['soundon'])
			.dimensionsFromCell()
			.mouseDown(function() {
				var muted = Howler._muted;
				if (muted) {
					Howler.unmute();
					this.texture(FP.tex['soundon']);
				} else {
					Howler.mute();
					this.texture(FP.tex['soundoff']);
				}
				ige.input.stopPropagation();
			})
			.translateTo(300, -210, 0)
			.depth(10)
			.mount(this.fgScene)
			;
			
		var canvas = document.getElementById('igeFrontBuffer');
		var click = function(evt) {
			if (evt.target !== canvas)
				return;
		
			self.successMessage.opacity(0);
			self.failMessage.opacity(0);
			if (self.platform.rowCount() >= 3) {
				self.platform.clearRows();
				
				if (self.failed) {					
					//reset current scores
					self.currentLevel = 0;
					self.currentScore = 0;
					self.levelText
						.text(self.padScoreText(self.currentLevel))
						.texture(FP.font['whitenumbers'])
						;
					self.scoreText
						.text(self.padScoreText(self.currentScore))
						.texture(FP.font['whitenumbers'])
						;
				}
			} else {
				var clearedBlocks = self.stream.clearCenterBlocks();
				if (clearedBlocks) {
					FP.sfx.play('flap');
					
					self.platform.addRow(clearedBlocks[0]._type, clearedBlocks[1]._type, clearedBlocks[2]._type);
					if (self.platform.rowCount() === 3) {
						var linePoints = self.platform.evaluateLines();
						var totalPoints = linePoints.reduce(function(acc, val) { return acc + val; }, 0);
						
						self.platform.setPointsText(linePoints);
						if (totalPoints > 0) {
							FP.sfx.play('good');	
							
							self.successMessage.opacity(1);
							self.failed = false;
							
							//add to scores
							self.currentLevel += 1;
							self.currentScore += totalPoints;	
							self.levelText.text(self.padScoreText(self.currentLevel));
							if (self.currentLevel >= self.levelHigh)
								self.levelText.texture(FP.font['goldnumbers']);
							self.scoreText.text(self.padScoreText(self.currentScore));
							if (self.currentScore >= self.scoreHigh)
								self.scoreText.texture(FP.font['goldnumbers']);
						} else {
							FP.sfx.play('fail');	
							
							self.failMessage.opacity(1);
							self.failed = true;		
							
							//save highscores
							if (self.currentLevel > self.levelHigh) {
								self.levelHigh = self.currentLevel;
								localStorage.setItem('levelHigh', self.levelHigh);
								self.levelHighText.text(self.padScoreText(self.levelHigh));
							}
							if (self.currentScore > self.scoreHigh) {
								self.scoreHigh = self.currentScore;
								localStorage.setItem('scoreHigh', self.scoreHigh);
								self.scoreHighText.text(self.padScoreText(self.scoreHigh));
							}
						}
					} else {
						self.platform.setPointsText(null);
					}
				}
			}
			ige.input.stopPropagation();
		}
		this.gameScene.mouseDown(click);
	},
	
	_resizeEvent: function() {
		if (this.vpMain.resizing)
			return;
		
		var windowWidth = window.innerWidth || document.documentElement.clientWidth || d.getElementsByTagName('body')[0].clientWidth;
		if (windowWidth <= 740) {
			this.vpMain.resizing = true;
			this.vpMain.minimumVisibleArea(740, 700);
			this.vpMain.resizing = false;
		} else {
			delete this.vpMain._lockDimension;
			this.vpMain.scaleTo(1, 1, 1);
		}
	},
	
	padScoreText: function(val) {
		var length = 5;
		var padChar = '0';
		
		var string = String(val);
		if (string.length >= length)
			return string;
		
		var pad = Array(length - string.length + 1).join(padChar); // http://stackoverflow.com/a/1877479/2089233
		string = pad + string;
		return string;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }