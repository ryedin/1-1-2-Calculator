function SkinsAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SkinsAssistant.prototype.setup = function() {
	this.controller.setupWidget("skinList",
      	{
      		itemTemplate: 'skinListItem',
	      	/*listTemplate: 'listscene/static-list-container',
	      	addItemLabel: $L('Add ...'),
	      	swipeToDelete: true,
	      	reorderable: true,
	      	emptyTemplate:'list/emptylist'*/
      	},
      	{
          	listTitle: $L('Choose a skin'),
          	items : [
         		{name: "default", displayName: "Default", cssName: "blackNglossy", thumbnailPath: "images/skins/black-carbon/black_carbon_thumb.png"},
				{name: "paratroopers", displayName: "Paratroopers", cssName: "paratroopers", thumbnailPath: "images/skins/black-carbon/paratroopers/paratroopers_thumb.png"},
				{name: "pre101", displayName: "Pre101.com", cssName: "pre101", thumbnailPath: "images/skins/black-carbon/pre101/pre101_thumb.png"},
				{name: "radio_hibiki", displayName: "Radio Hibiki", cssName: "radiohibiki", thumbnailPath: "images/skins/black-carbon/radio_hibiki/radio_hibiki_thumb.png"},
				{name: "spaz", displayName: "Spaz", cssName: "spaz", thumbnailPath: "images/skins/black-carbon/spaz/spaz_thumb.png"},
				{name: "tiltgt", displayName: "Tilt GT", cssName: "tiltgt", thumbnailPath: "images/skins/black-carbon/tiltgt/tiltgt_thumb.png"},
				{name: "totallypalmed", displayName: "Totally Palmed", cssName: "totallypalmed", thumbnailPath: "images/skins/black-carbon/totallypalmed/totallypalmed_thumb.png"},
				{name: "webosinternals", displayName: "WebOS-Internals", cssName: "webosinternals", thumbnailPath: "images/skins/black-carbon/webosinternals/webos-internals_thumb.png"},
				{name: "webosroundup", displayName: "webOSRoundup.com", cssName: "webosroundup", thumbnailPath: "images/skins/black-carbon/webosroundup/webosroundup_thumb.png"},
				{name: "zombie_invasion", displayName: "Zombie Invasion!!!", cssName: "zombieinvasion", thumbnailPath: "images/skins/black-carbon/zombie_invasion/zombie_thumb.png"}
          	]
		}
	);
	this.controller.listen("skinList", Mojo.Event.listTap, this.handleListTap.bindAsEventListener(this));
};

SkinsAssistant.prototype.handleListTap = function(e) {
	applySkin(e.item);
	this.controller.stageController.popScene();
};
