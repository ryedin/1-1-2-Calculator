function FilesAssistant() {
  /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
}

FilesAssistant.prototype.setup = function() {
  var me = this;
  
  //calc.data.getFiles(function(files) {
    me.controller.setupWidget("fileList",
      {
        itemTemplate: 'fileListItem'
      },
      {
        listTitle: $L('Choose a file'),
        items : calc.data.files
      }
    );
    me.controller.listen("fileList", Mojo.Event.listTap, me.handleListTap.bindAsEventListener(me));
  //});
};

FilesAssistant.prototype.handleListTap = function(e) {
  jojo.event.eventDispatcher.fire("fileSelected", {file: e.item});
  this.controller.stageController.popScene();
};
