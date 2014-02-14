// Global object to hold all our globals... bad practice? whatever
FP = window.FP || {};

FP.SPRITE_DIRECTORY = "./sprites/";
FP.AUDIO_DIRECTORY = "./audio/";

FP.BLOCK_SIZE = 64;
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
					
					// Create the UI entities
					self.setupUi();
		
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
		this.gameScene = new IgeScene2d()
			.id('gameScene')
			.layer(1)
			.translateTo(0, 0, 0)
			.mount(this.mainScene)
			;
		this.uiScene = new IgeScene2d()
			.id('uiScene')
			.layer(4)
			.ignoreCamera(true)
			.mount(this.gameScene)
			;
	},
	
	setupUi: function() {
		
	},
	
	setupEntities: function() {
		var self = this;
		
		this.platform = new Platform(FP.BLOCK_SIZE)
			.translateTo(FP.PLATFORM_CENTER, 350, 0)
			.mount(this.gameScene)
			;
		this.stream = new BlockStream(-640, FP.PLATFORM_CENTER, 640, 20, FP.BLOCK_SIZE, 100)
			.mouseDown(function() {
				var clearedBlocks = self.stream.clearCenterBlocks();
				if (clearedBlocks) {
					self.platform.addRow(clearedBlocks[0]._type, clearedBlocks[1]._type, clearedBlocks[2]._type);
				}
				ige.input.stopPropagation();
			})
			.mount(this.gameScene)
			;
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }