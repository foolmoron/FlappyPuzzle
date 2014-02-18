// Global object to hold all our globals... bad practice? whatever
FP = window.FP || {};

FP.SPRITE_DIRECTORY = "./sprites/";
FP.AUDIO_DIRECTORY = "./audio/";

FP.BLOCK_SIZE = 32;
FP.PLATFORM_CENTER = -128;

FP.tex = {}; // holds all textures

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
					
					// Create the basic scene, viewport etc
					self.setupScene();
		
					// Setup the initial entities
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
		this.stream = new BlockStream(-320, FP.PLATFORM_CENTER, 352, FP.BLOCK_SIZE, -0.50)
			.translateTo(0, -73, 0)
			.mount(this.gameScene)
			;
			
		var canvas = document.getElementById('igeFrontBuffer');
		var click = function(evt) {
			if (evt.target !== canvas)
				return;
		
			self.successMessage.opacity(0);
			self.failMessage.opacity(0);
			if (self.platform.rowCount() >= 3) {
				self.platform.clearRows();
			} else {
				var clearedBlocks = self.stream.clearCenterBlocks();
				if (clearedBlocks) {
					self.platform.addRow(clearedBlocks[0]._type, clearedBlocks[1]._type, clearedBlocks[2]._type);
					if (self.platform.rowCount() === 3) {
						var linePoints = self.platform.evaluateLines();
						var totalPoints = linePoints.reduce(function(acc, val) { return acc + val; }, 0);
						
						self.platform.setPointsText(linePoints);
						if (totalPoints > 0) {
							self.successMessage.opacity(1);
						} else {
							self.failMessage.opacity(1);
						}
					} else {
						self.platform.setPointsText(null);
					}
				}
			}
			ige.input.stopPropagation();
		}
		window.addEventListener('mousedown', click);
		window.addEventListener('touchstart', click);
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
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }