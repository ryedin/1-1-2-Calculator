(function() {
    
  enyo.kind({
    name: "Calc.Main",
    kind: enyo.VFlexBox,
    components: [{
      kind: "AppMenu",
      components: [{
        caption: "Preferences", 
        onclick: "showPreferences"
      }]
    }, {
      name: "pane", 
      kind: "Pane", 
      flex: 1,
      components: [{
        name: "ui",
        className: "enyo-bg",
        kind: "Calc.UI",
        onButtonClicked: "buttonClicked"
      }, {
        name: "preferences",
        className: "enyo-bg",
        kind: "Calc.Preferences",
        onReceive: "preferencesReceived",
        onSave: "preferencesSaved",
        onCancel: "preferencesCanceled"
      }]
    }, {
      name: "ulator",
      kind: "Calc.Ulator"
    }],
    buttonClicked: function(sender, btn) {
      var calc = this.$.ulator,
        ui = this.$.ui;
      calc.update(btn.label);
      if (!calc.ignoreInput && !calc.error) {
        var currentValue = calc.currentValue.join(""),
          previousValue = calc.getPreviousValue();
        if (calc.newMemory) {
          //ui.updateMemory(calc.memory);
          //file.memory = calc.memory;
        } else if (calc.removeMemory) {
          //ui.updateMemory();
          //file.memory = null;
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
        // file.calcState = {
        //   previousValuesHTML: els.previousValuesDiv.innerHTML,
        //   currentValueHTML: els.currValDiv.innerHTML,
        //   currentValue: calc.currentValue,
        //   currentOperation: calc.currentOperation.name,
        //   previousValues: calc.previousValues,
        //   pendingValue: calc.pendingValue,
        //   containsDecimal: calc.containsDecimal,
        //   decimalPlaces: calc.decimalPlaces
        // };
        // calc.data.saveFile(function(result) {
        //   file = result;
        // });
      }
      if (calc.error) {
        ui.alert(calc.error);
      }
    },
    showPreferences: function() {
        // handle the button click
    },
    preferencesReceived: function() {
        // handle the button click
    },
    preferencesSaved: function() {
        // handle the button click
    },
    preferencesCanceled: function() {
        // handle the button click
    }
  });

})();