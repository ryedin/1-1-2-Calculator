function FirstAssistant() {

}

FirstAssistant.prototype.handleCommand = function(event) {
  this.ui.handleCommand(event);
};

FirstAssistant.prototype.setup = function() {
  var me = this;
  
  //TODO: get persisted options from db (skin, etc)
  
  me.ui = new calc.ui({
    controller: me.controller,
    skin: {
      name: "default",
      cssName: "blackNglossy"
    }
  });
  me.calc = new calc.ulator();
  
  //--- load prefs and data and then start responding to ui
  me.data = new calc.data({
    onceState: {
      ready: function(args) {
        var els = me.ui.elements, prefs = me.data.prefs, file = me.data.file;
        
        /**
         * initial UI if existing data found in file
         */
        if (file.memory !== undefined && file.memory !== null) {
          me.calc.memory = file.memory;
          me.calc.hasMemory = true;
          me.ui.updateMemory(me.calc.memory);
        }
        
        //output data and operations...
        if (file.calcState !== undefined) {
          els.previousValuesDiv.innerHTML = file.calcState.previousValuesHTML;
          els.currValDiv.innerHTML = file.calcState.currentValueHTML;
          me.calc.currentValue = file.calcState.currentValue || [];
          me.calc.previousValues = file.calcState.previousValues || [];
          me.calc.currentOperation = calc.ulator.operations[file.calcState.currentOperation];
          me.calc.pendingValue = file.calcState.pendingValue;
          me.calc.containsDecimal = file.calcState.containsDecimal;
          me.calc.decimalPlaces = file.calcState.decimalPlaces;
          setTimeout(function() {
            me.ui.scroller.mojo.revealBottom();
          }, 100);
        }
        
        me.ui.on("clearState", function() {
          me.calc.currentValue = [];
          me.calc.previousValues = [];
          me.calc.currentOperation = calc.ulator.operations.none;
          me.calc.pendingValue = null;
          me.calc.containsDecimal = false;
          me.calc.decimalPlaces = 0;
          me.calc.memory = 0;
          me.calc.hasMemory = false;
          Object.extend(file, {
            memory: null,
            calcState: {
              previousValuesHTML: els.previousValuesDiv.innerHTML,
              currentValueHTML: els.currValDiv.innerHTML,
              currentValue: me.calc.currentValue,
              currentOperation: me.calc.currentOperation.name,
              previousValues: me.calc.previousValues,
              pendingValue: me.calc.pendingValue,
              containsDecimal: me.calc.containsDecimal,
              decimalPlaces: me.calc.decimalPlaces
            }
          });
          //TODO: abstract this a bit better
          me.data.db.save(file, function(result) {
            me.data.file = result;
            file = result;
          });
        }); //end me.ui.on("clearState"...
        
        me.ui.on("buttonClicked", function(args) {
          var buttonModel = args.buttonModel;
          
          me.calc.update(buttonModel.buttonLabel);
          if (!me.calc.ignoreInput && !me.calc.error) {
            if (me.calc.newMemory) {
              me.ui.updateMemory(me.calc.memory);
              file.memory = me.calc.memory;
              //TODO: abstract this a bit better
              me.data.db.save(file, function(result) {
                me.data.file = result;
                file = result;
              });
            } else if (me.calc.removeMemory) {
              me.ui.updateMemory();
              file.memory = null;
              //TODO: abstract this a bit better
              me.data.db.save(file, function(result) {
                me.data.file = result;
                file = result;
              });
            }
            if (me.calc.newline) {
              if (me.calc.currentOperation !== calc.ulator.operations.none) {
                if (me.calc.repeatValue) {
                  els.currValDiv.innerHTML = me.calc.getPreviousValue();
                  me.calc.repeatValue = false;
                }
                els.currValDiv.innerHTML += "<span class='currentOperation'> " + me.calc.currentOperation.symbol + "</span>";
              }
              els.previousValuesDiv.innerHTML += "<div>" + els.currValDiv.innerHTML + "</div>";
              if (me.calc.currentOperation === calc.ulator.operations.equals) {
                els.previousValuesDiv.innerHTML += "<div class='equalsDivider'></div>";
                els.previousValuesDiv.innerHTML += "<div class='setTotal'>" + me.calc.getPreviousValue() + "&nbsp;&nbsp;</div>";
              }
            }
            els.currValDiv.innerHTML = me.calc.currentValue.join("");
            me.ui.scroller.mojo.revealBottom();
            
            //store calculator state
            file.calcState = {
              previousValuesHTML: els.previousValuesDiv.innerHTML,
              currentValueHTML: els.currValDiv.innerHTML,
              currentValue: me.calc.currentValue,
              currentOperation: me.calc.currentOperation.name,
              previousValues: me.calc.previousValues,
              pendingValue: me.calc.pendingValue,
              containsDecimal: me.calc.containsDecimal,
              decimalPlaces: me.calc.decimalPlaces
            };
            //TODO: abstract this a bit better
            me.data.db.save(file, function(result) {
              me.data.file = result;
              file = result;
            });
          }
          if (me.calc.error) {
            me.controller.showAlertDialog({
              title: "Error",
              message: me.calc.error,
              choices: [{
                label: "OK",
                type: "affirmative"
              }]
            });
          }
        }); //end me.ui.on("buttonClicked", ...
      }
    } //end onceState.ready
  });
};
