(function() {

  var prefAlerts = {
    "roundingWarning": {
      caption: "Answer Rounded",
      message: "The maximum precision for this application is 21 places, therefore the answer was rounded."
    },
    "backspaceDescription": {
      caption: "This is the backspace key",
      message: "This button will remove the far right digit from the current line (excluding completed sums)."
    }
  };

  enyo.kind({
    name: "Calc.Dialogs",
    kind: enyo.VFlexBox,
    components: [
      {name: "alertDialog", kind: "ModalDialog", components: [
        {kind: "RowGroup", name: "alertDialogGroup", caption: "Oops!", components: [
          {name: "alertContent", kind: "HtmlContent"}, 
          {name: "prefCheckboxContainer", className: "alertPrefContainer", components: [
            {kind: "CheckBox", name: "prefCheckbox"},
            {content: "Don't show this message next time", className: "alertPrefText"}
          ]},
          {kind: "HFlexBox", pack: "center", components: [            
            {kind: "Button", caption: "OK", onclick: "closeAlert", className: "enyo-button-affirmative"}
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
          {kind: "Input", hint: "", name: "inputDialogInput", spellcheck: false, onfocus: "inputFocused"},
          {kind: "HFlexBox", pack: "center", components: [
            {kind: "Button", caption: "Cancel", onclick: "inputDialogCancel", className: "enyo-button-secondary"},
            {kind: "Button", caption: "OK", onclick: "inputDialogOK", className: "enyo-button-affirmative"}
          ]}
        ]}
      ]}
    ],
    create: function() {
      this.inherited(arguments);
      Calc.dialogs = this;
    },
    alert: function(caption, content, pref) {
      this.$.alertDialog.open();

      if (arguments.length == 1) {
        content = caption;
        caption = "Oops!";
      } else {
        this.$.alertDialogGroup.setCaption(caption);
      }

      $("#" + this.getId() + "_alertContent").html(content);

      if (typeof pref === "string") {
        this.$.prefCheckboxContainer.show();
        this.alertPref = pref;
      } else {
        this.$.prefCheckboxContainer.hide();
      }
    },
    prefAlert: function(pref) {
      if (Calc.preferences.prefs[pref + "Disabled"] !== "true") {
        var _pref = prefAlerts[pref];
        this.alert(_pref.caption, _pref.message, pref);
      }
    },
    closeAlert: function() {
      if (this.alertPref) {
        if (this.$.prefCheckbox.getChecked()) {
          Calc.preferences.setPreference(this.alertPref + "Disabled", "true");
        }
      }
      this.$.alertDialog.close();
      delete this.alertPref;
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
      if (enyo.keyboard.isShowing()) enyo.keyboard.forceHide();
    },
    inputDialogCancel: function() {
      this.$.inputDialog.close();
      delete this.inputCallback;
      if (enyo.keyboard.isShowing()) enyo.keyboard.forceHide();
    },
    inputFocused: function() {
      if (!enyo.keyboard.isShowing()) enyo.keyboard.forceShow();
    }
  });

})();