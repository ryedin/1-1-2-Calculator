function FirstAssistant() {
	
}

FirstAssistant.prototype.handleCommand = function (event) {
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
	
	var els = me.ui.elements;
	
	//--- load calculator state
	var data = calc.data.fetch(); //TODO: add config (filename, etc.)	
	if (data) {
		
		//memory register
		if (data.memory !== undefined && data.memory !== null) {
			me.calc.memory = data.memory;
			me.calc.hasMemory = true;
			me.ui.updateMemory(me.calc.memory);
		}
		
		//output data and operations...
		if (data.calcState !== undefined) {
			els.previousValuesDiv.innerHTML = data.calcState.previousValuesHTML;
			els.currValDiv.innerHTML = data.calcState.currentValueHTML;
			me.calc.currentValue = data.calcState.currentValue || [];
			me.calc.previousValues = data.calcState.previousValues || [];
			me.calc.currentOperation = calc.ulator.operations[data.calcState.currentOperation];
			me.calc.pendingValue = data.calcState.pendingValue;
			me.calc.containsDecimal = data.calcState.containsDecimal;
			me.calc.decimalPlaces = data.calcState.decimalPlaces;
			setTimeout(function() {
				me.ui.scroller.mojo.revealBottom();
			}, 100);
		}
	} else {
		data = {};
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
    data = {
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
    };
    calc.data.save(data);
	});
	
	me.ui.on("buttonClicked", function(args) {
		var buttonModel = args.buttonModel;
		
		me.calc.update(buttonModel.buttonLabel);
    if (!me.calc.ignoreInput && !me.calc.error) {
      if (me.calc.newMemory) {
        els.memDiv.show();
        els.memValDiv.innerHTML = me.calc.memory;
        data.memory = me.calc.memory;
        calc.data.save(data);
      } else if (me.calc.removeMemory) {
        els.memDiv.hide();
        data.memory = null;
        calc.data.save(data);
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
      
      //store calculator state in cookie
      data.calcState = {
        previousValuesHTML: els.previousValuesDiv.innerHTML,
        currentValueHTML: els.currValDiv.innerHTML,
        currentValue: me.calc.currentValue,
        currentOperation: me.calc.currentOperation.name,
        previousValues: me.calc.previousValues,
        pendingValue: me.calc.pendingValue,
        containsDecimal: me.calc.containsDecimal,
        decimalPlaces: me.calc.decimalPlaces
      };
      calc.data.save(data);
    }
    if (me.calc.error) {
      me.controller.showAlertDialog({
        title: "Error",
        message: me.calc.error,
        choices: [
          {label: "OK", type: "affirmative"}
        ]
      });
    }
	});
};
