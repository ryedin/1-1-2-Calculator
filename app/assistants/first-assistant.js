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
	
	//--- load calculator state from cookie
	var cookie = new Mojo.Model.Cookie("1plus1_beta");
	var memData = cookie.get();
	if (memData !== undefined) {
		
		//memory register
		if (memData.memory !== undefined && memData.memory != null) {
			me.calc.memory = memData.memory;
			me.calc.hasMemory = true;
			els.memDiv.show();
			memValDiv.innerHTML = me.calc.memory;
		}
		
		//output data and operations...
		if (memData.calcState !== undefined) {
			els.previousValuesDiv.innerHTML = memData.calcState.previousValuesHTML;
			els.currValDiv.innerHTML = memData.calcState.currentValueHTML;
			me.calc.currentValue = memData.calcState.currentValue || [];
			me.calc.previousValues = memData.calcState.previousValues || [];
			me.calc.currentOperation = calc.ulator.operations[memData.calcState.currentOperation];
			me.calc.pendingValue = memData.calcState.pendingValue;
			me.calc.containsDecimal = memData.calcState.containsDecimal;
			me.calc.decimalPlaces = memData.calcState.decimalPlaces;
			setTimeout(function() {
				me.ui.scroller.mojo.revealBottom();
			}, 100);
		}
	} else {
		memData = {};
	}
	
	//--- clear all button (screen, memory, and stored state)
	//button push effect:
	Event.observe(els.clearAllBtn, "mousedown", function() {
		els.clearAllBtn.addClassName("touched");
	});
	Event.observe(els.clearAllBtn, "mouseout", function() {
		els.clearAllBtn.removeClassName("touched");
	});
	Mojo.Event.listen(els.clearAllBtn, "click", function(){
		//button push effect:			
		setTimeout(function() {
			els.clearAllBtn.removeClassName("touched");
		}, 150);
		
		//first confirm action
		me.controller.showAlertDialog({
			title: "Clear All State?",
			message: "Are you sure you want to clear all information from the calculator and start over?",
			onChoose: function(val) {
				if (val == "yes") {
					els.previousValuesDiv.innerHTML = "";
					els.currValDiv.innerHTML = "";
					els.memValDiv.innerHTML = "";
					els.memDiv.hide();
					me.calc.currentValue = [];
					me.calc.previousValues = [];
					me.calc.currentOperation = calc.ulator.operations.none;
					me.calc.pendingValue = null;
					me.calc.containsDecimal = false;
					me.calc.decimalPlaces = 0;
					me.calc.memory = 0;
					me.calc.hasMemory = false;
					setTimeout(function() {
						me.ui.scroller.mojo.revealBottom();
					}, 100);
					memData = {
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
					cookie.put(memData);
				}
			},
			choices: [
				{label: "OK", value: "yes", type: "affirmative"},
				{label: "Cancel", value: "no", type: "negative"}
			]
		});
	});
	
	//icon button
	Mojo.Event.listen(els.iconBtn, Mojo.Event.tap, function() {
		me.controller.showAlertDialog({
			title: "1+1=2 by Ryan Gahl",
			message: "Thank you for using this application. Make sure to keep checking the App Catalog, as I will be adding features continuously to make this a truly robust calculator app!",
			choices: [
				{label: "OK", type: "affirmative"}
			]
		});
	});
	
	//setup the calculator buttons ---
	[
		"mPlusBtn","mMinusBtn","mrBtn","mcBtn","divisionBtn",
		"multiplicationBtn","subtractionBtn","additionBtn","equalsBtn","percentBtn",
		"cBtn","decimalBtn","num0Btn","num1Btn","sqrtBtn","negativeBtn",
		"num2Btn","num3Btn","num4Btn","num5Btn",
		"num6Btn","num7Btn","num8Btn","num9Btn"
	].each(function(buttonId) {
		var button = me.controller.get(buttonId);
		var buttonModel = {
			disabled: false
		};
		switch (buttonId) { //for some reason the innerHTML is getting whacked for some buttons (extra characters added) - so do some fixing here
			case "mPlusBtn":
				buttonModel.buttonLabel = "M+";
				break;
			case "mMinusBtn":
				buttonModel.buttonLabel = "M-";
				break;
			case "mrBtn":
				buttonModel.buttonLabel = "MR";
				break;
			case "mcBtn":
				buttonModel.buttonLabel = "MC";
				break;
			case "divisionBtn":
				buttonModel.buttonLabel = "&divide;";
				break;
			case "multiplicationBtn":
				buttonModel.buttonLabel = "x";
				break;
			case "subtractionBtn":
				buttonModel.buttonLabel = "-";
				break;
			case "additionBtn":
				buttonModel.buttonLabel = "+";
				break;
			case "equalsBtn":
				buttonModel.buttonLabel = "=";
				break;
			case "decimalBtn":
				buttonModel.buttonLabel = ".";
				break;
			case "percentBtn":
				buttonModel.buttonLabel = "%";
				break;
			case "sqrtBtn":
				buttonModel.buttonLabel = "&radic;";
				break;
			case "cBtn":
				buttonModel.buttonLabel = "C";
				break;
			case "num0Btn":
				buttonModel.buttonLabel = "0";
				break;
			case "num1Btn":
				buttonModel.buttonLabel = "1";
				break;
			case "num2Btn":
				buttonModel.buttonLabel = "2";
				break;
			case "num3Btn":
				buttonModel.buttonLabel = "3";
				break;
			case "num4Btn":
				buttonModel.buttonLabel = "4";
				break;
			case "num5Btn":
				buttonModel.buttonLabel = "5";
				break;
			case "num6Btn":
				buttonModel.buttonLabel = "6";
				break;
			case "num7Btn":
				buttonModel.buttonLabel = "7";
				break;
			case "num8Btn":
				buttonModel.buttonLabel = "8";
				break;
			case "num9Btn":
				buttonModel.buttonLabel = "9";
				break;
			case "negativeBtn":
				buttonModel.buttonLabel = "&plusmn;";
				break;
		}
		//button push effect:
		Event.observe(button, "mousedown", function() {
			button.addClassName("touched");
		});
		Event.observe(button, "mouseout", function() {
			button.removeClassName("touched");
		});
		Mojo.Event.listen(button, Mojo.Event.tap, function() {
			//button push effect:			
			setTimeout(function() {
				button.removeClassName("touched");
			}, 150);
			
			me.calc.update(buttonModel.buttonLabel);
			if (!me.calc.ignoreInput && !me.calc.error) {
				if (me.calc.newMemory) {
					els.memDiv.show();
					els.memValDiv.innerHTML = me.calc.memory;
					memData.memory = me.calc.memory;
					cookie.put(memData);
				} else if (me.calc.removeMemory) {
					els.memDiv.hide();
					memData.memory = null;
					cookie.put(memData);
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
				memData.calcState = {
					previousValuesHTML: els.previousValuesDiv.innerHTML,
					currentValueHTML: els.currValDiv.innerHTML,
					currentValue: me.calc.currentValue,
					currentOperation: me.calc.currentOperation.name,
					previousValues: me.calc.previousValues,
					pendingValue: me.calc.pendingValue,
					containsDecimal: me.calc.containsDecimal,
					decimalPlaces: me.calc.decimalPlaces
				};
				cookie.put(memData);
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
	});	
};
