var NewFileAssistant = Class.create({
  initialize: function(sceneAssistant) {
    this.sceneAssistant = sceneAssistant;
    this.controller = sceneAssistant.controller;
  },
  setup: function(widget) {
    var me = this;
    this.widget = widget;
    this.controller.setupWidget("fileNameField", {
      focus: true,
      modelProperty: "value"
    }, {
      value: "",
      disabled: false
    });
    this.controller.get("okBtn").addEventListener(Mojo.Event.tap, function() {
      jojo.event.eventDispatcher.fire("newFile", {
        fileName: me.controller.get("fileNameField").mojo.getValue()
      });
      widget.mojo.close();
    });
    this.controller.get("cancelBtn").addEventListener(Mojo.Event.tap, function() {
      widget.mojo.close();
    });
  }
});
