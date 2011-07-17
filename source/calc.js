(function() {

  enyo.kind({
    name: "Calc.Main",
    kind: enyo.VFlexBox,
    components: [{
      kind: "AppMenu",
      components: [{
        caption: "Help",
        onclick: "showHelp"
      }, /*{
        caption: "Preferences", 
        onclick: "showPreferences"
      },*/ {
        caption: "Save As...", 
        onclick: "saveAs"
      }, {
        caption: "Files", 
        onclick: "showFiles"
      }]
    }, {
      name: "pane", 
      kind: "Pane", 
      flex: 1,
      components: [{
        name: "ui",
        className: "enyo-bg",
        kind: "Calc.UI",
        onButtonClicked: "calcButtonClicked"
      }, {
        name: "preferences",
        className: "enyo-bg",
        kind: "Calc.Preferences",
        onPreferencesLoaded: "preferencesLoaded",
        onSave: "preferencesSaved",
        onCancel: "childPaneCanceled"
      }, {
        name: "files",
        className: "enyo-bg",
        kind: "Calc.Files",
        onCancel: "childPaneCanceled",
        onFileSelected: "fileOpened"
      }]
    }, {
      name: "ulator",
      kind: "Calc.Ulator"
    }],
    calcButtonClicked: function(sender, btn) {
      var calc = this.$.ulator,
        ui = this.$.ui;

      calc.update(btn.label);
      if (!calc.ignoreInput && !calc.error) {
        var currentValue = calc.currentValue.join(""),
          previousValue = calc.getPreviousValue();
        if (calc.newMemory) {
          ui.setMemory(calc.memory);
          if (this.file) {
            this.file.state.memory = calc.memory;
          }
        } else if (calc.removeMemory) {
          ui.setMemory();
          if (this.file) {
            this.file.state.memory = null;
          }
        }
        if (calc.newline) {
          if (calc.currentOperation !== Calc.Ulator.operations.none) {
            if (calc.repeatValue) {
              ui.setCurrentValue(previousValue);
              calc.repeatValue = false;
            }
            ui.setCurrentOperation(calc.currentOperation.symbol);
          }
          ui.newLine();
          if (calc.currentOperation === Calc.Ulator.operations.equals) {
            ui.setTotal(previousValue);
          }
        }

        ui.setCurrentValue(currentValue);
        //store calculator state
        if (this.file) {
          this.file.state = _.extend(this.file.state, {
            html: this.$.ui.getHtml(),
            currentValue: calc.currentValue,
            currentOperation: calc.newLine ? "none" : calc.currentOperation.name,
            previousValues: calc.previousValues,
            pendingValue: calc.pendingValue,
            containsDecimal: calc.containsDecimal,
            decimalPlaces: calc.decimalPlaces
          });
          this.$.files.saveFile(this.file);
        }
      }
      if (calc.error) {
        ui.alert(calc.error);
      }
    },
    fileOpened: function(sender, file) {
      this.$.pane.selectViewByName("ui");
      if (enyo.keyboard.isShowing()) enyo.keyboard.forceHide();
      if (file) {
        this.file = file;
        var state = file.state;
        this.$.ui.loadHtml(state.html);
        this.$.ui.setCurrentValue(state.currentValue.join(''));
        if (!state.currentValue.length && typeof state.pendingValue !== "undefined") {
          this.$.ui.updateDisplay(state.pendingValue);        
        }
        this.$.ui.setMemory(state.memory);
        this.$.ulator.setState(state);
        this.$.ui.setFileName(file.key);
        this.$.preferences.setPreference("fileName", file.key);
      }
    },
    saveAs: function() {
      this.$.ui.getInput("Save As...", "Type file name here...", function(fileName) {
        debugger;
      });
    },
    showHelp: function() {
      window.open("http://www.1plus1app.com");
    },
    showPreferences: function() {
      this.$.pane.selectViewByName("preferences");
    },
    showFiles: function() {
      this.$.pane.selectViewByName("files");
    },
    preferencesLoaded: function(sender, preferences) {
      this.$.files.loadFile(preferences.fileName);
    },
    preferencesSaved: function() {
        // handle the button click
    },
    childPaneCanceled: function() {
      this.$.pane.selectViewByName("ui");
    }
  });

})();