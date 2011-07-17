(function() {
    
  enyo.kind({
    name: "Calc.Dialogs",
    kind: enyo.VFlexBox,
    components: [
      {name: "alertDialog", kind: "ModalDialog", components: [
        {kind: "RowGroup", caption: "Oops", components: [
          {name: "alertContent", kind: "HtmlContent"}, 
          {kind: "HFlexBox", pack: "center", components: [
            {kind: "Button", caption: "OK", onclick: "closeAlert"}
          ]}
        ]}
      ]},    
      {name: "confirmDialog", kind: "ModalDialog", components: [
        {kind: "RowGroup", caption: "Confirm", components: [
          {name: "confirmContent", kind: "HtmlContent"}, 
          {kind: "HFlexBox", pack: "center", components: [
            {kind: "Button", caption: "Cancel", onclick: "confirmCancel", className: "enyo-button-secondary"},
            {kind: "Button", caption: "OK", onclick: "confirmOK", className: "enyo-button-affirmative"}
          ]}
        ]}
      ]},    
      {name: "inputDialog", kind: "ModalDialog", components: [
        {kind: "RowGroup", name: "inputDialogGroup", caption: "", components: [
          {kind: "Input", hint: "", name: "inputDialogInput", spellcheck: false},
          {kind: "HFlexBox", pack: "center", components: [
            {kind: "Button", caption: "Cancel", onclick: "inputDialogCancel", className: "enyo-button-secondary"},
            {kind: "Button", caption: "OK", onclick: "inputDialogOK", className: "enyo-button-affirmative"}
          ]}
        ]}
      ]}
    ],
    alert: function(content) {
      this.$.alertDialog.open();
      $("#" + this.getId() + "_alertContent").html(content);
    },
    closeAlert: function() {
      this.$.alertDialog.close();
    },
    confirm: function(content, cb) {
      this.$.confirmDialog.open();
      $("#" + this.getId() + "_confirmContent").html(content);
      this.confirmCallback = cb;
    },
    confirmOK: function() {
      this.$.confirmDialog.close();
      if (typeof this.confirmCallback === "function") {
        this.confirmCallback();
        delete this.confirmCallback;
      }
    },
    confirmCancel: function() {
      this.$.confirmDialog.close();
      delete this.confirmCallback;
    },
    getInput: function(caption, hint, cb) {
      this.$.inputDialog.open();
      this.$.inputDialogGroup.setCaption(caption);
      this.$.inputDialogInput.setValue("");
      this.$.inputDialogInput.setHint(hint);
      this.inputCallback = cb;
    },
    inputDialogOK: function() {
      var value = this.$.inputDialogInput.getValue();
      this.$.inputDialog.close();
      if (typeof this.inputCallback === "function") {
        this.inputCallback(value);
        delete this.inputCallback;
      }
    },
    inputDialogCancel: function() {
      this.$.inputDialog.close();
      delete this.inputCallback;
    }
  });

})();