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
  me.calc = new calc.ulator({controller: me.controller});
  
  //--- load prefs and data and then start responding to ui
  calc.data.fsm.onceState("ready", function(args) {
    var els = me.ui.elements, prefs = calc.data.prefs, file = calc.data.file;
    
    me.ui.setFile(file);
    me.calc.setFile(file);
    
    //listen on newFile event...
    jojo.event.eventDispatcher.on("newFile", function(args) {
      file = {
        key: args.fileName,
        memory: null,
        calcState: {
          previousValuesHTML: "",
          currentValueHTML: "",
          currentValue: [],
          currentOperation:  calc.ulator.operations.none,
          previousValues: [],
          pendingValue: null,
          containsDecimal: false,
          decimalPlaces: 0,
          memory: null
        }
      };
      calc.data.prefs.file = args.fileName;
      calc.data.savePrefs(function() {
        calc.data.file = file;
        me.ui.setFile(file);
        me.calc.setFile(file);
        calc.data.saveFile(function(result) {
          file = result;
        });        
      });
    });
    
    //listen on file change event also...
    jojo.event.eventDispatcher.on("fileSelected", function(args) {
      calc.data.prefs.file = args.file.key;
      calc.data.savePrefs(function() { 
        file = args.file;
        calc.data.file = args.file;
        me.ui.setFile(args.file);
        me.calc.setFile(args.file);
      });
    });
    
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
      calc.data.saveFile(function(result) {
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
        } else if (me.calc.removeMemory) {
          me.ui.updateMemory();
          file.memory = null;
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
        calc.data.saveFile(function(result) {
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
  });
};
