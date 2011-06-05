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
              ui.setCurrentValue(calc.getPreviousValue());
              calc.repeatValue = false;
            }
            ui.setCurrentOperation(calc.currentOperation.symbol);
          }
          ui.
          //els.previousValuesDiv.innerHTML += "<div>" + els.currValDiv.innerHTML + "</div>";
          if (calc.currentOperation === Calc.Ulator.operations.equals) {
            // els.previousValuesDiv.innerHTML += "<div class='equalsDivider'></div>";
            // els.previousValuesDiv.innerHTML += "<div class='setTotal'>" + calc.getPreviousValue() + "&nbsp;&nbsp;</div>";
          }
        }

        ui.setCurrentValue(calc.currentValue.join(""));
        // ui.scroller.mojo.revealBottom();
        
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
        // me.controller.showAlertDialog({
        //   title: "Error",
        //   message: calc.error,
        //   choices: [{
        //     label: "OK",
        //     type: "affirmative"
        //   }]
        // });
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