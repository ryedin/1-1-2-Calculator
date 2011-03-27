var currentSkin = {
	name: "default",
	cssName: "blackNglossy"
};
var skinnableAssistant;
var expanded = false;

function applySkin(skin) {
	if (skinnableAssistant && skin && skin.name != "" && skin.name != currentSkin.name) {
		var main = skinnableAssistant.controller.get("main");
		main.removeClassName(currentSkin.cssName + (expanded ? "Expanded" : ""));
		main.addClassName(skin.cssName + (expanded ? "Expanded" : ""));
		currentSkin = skin;
	}
}

function FirstAssistant() {
	
}

FirstAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	    (event.command == Mojo.Menu.helpCmd)) {
         event.stopPropagation(); // enable help. now we have to handle it
    }

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case "helpCmd":
				this.controller.stageController.pushAppSupportInfoScene();
				break;
			case "skinCmd":
				this.controller.stageController.pushScene("skins");
				break;
		}
	}	
};

FirstAssistant.prototype.setup = function() {
	skinnableAssistant = this;
	var me = this,
		buttonAttributes = {
			disabledProperty: 'disabled',
			type: 'default'
		},
		main = me.controller.get("main"),
		scrollingContents = me.controller.get("scrolling_contents"),
		previousValuesDiv = me.controller.get("previousValuesDiv"),
		displayArea = me.controller.get("displayArea"),
		expander = me.controller.get("expander"),
		clearAllBtn = me.controller.get("clearAllBtn"),
		memDiv = me.controller.get("memDiv"),
		memValDiv = me.controller.get("memValDiv"),
		currValDiv = me.controller.get("currentValueDiv"),
		scroller = Mojo.View.getScrollerForElement(me.controller.get("displayArea"));

	this.controller.setupWidget(Mojo.Menu.appMenu,
	    this.attributes = {
        	omitDefaultItems: true
	    },
	    this.model = {
	        visible: true,
	        items: [ 
	            //{label: "About My App ...", command: 'do-myAbout'},
	            //Mojo.Menu.editItem,
	            { label: "Skins...", command: 'skinCmd' },
	            { label: "Help...", command: 'helpCmd' }
	        ]
	    }
	 );

	memDiv.hide();
		
	//setup the display area expander to allow full screen viewing
	var isPixi = Mojo.Environment.DeviceInfo.screenHeight == 400;
	if (isPixi) {
		displayArea.style.height = "35px";
		me.controller.get("main").addClassName("pixi");
	}
	var startHeight = isPixi ? 35 : 125; //adjust for pixi
	var staticStartHeight = startHeight;
	var endHeight = isPixi ? 323 : 403; //adjust for pixi
	var staticEndHeight = endHeight;
	var expanderStart = isPixi ? 39 : 129; //adjust for pixi
	var expanderEnd = isPixi ? 327 : 407; //adjust for pixi
	var currExpanderTop = expanderStart;
	
	//button push effect:
	Event.observe(expander, "mousedown", function() {
		expander.addClassName("touched");
	});
	Event.observe(expander, "mouseout", function() {
		expander.removeClassName("touched");
	});
	Mojo.Event.listen(expander, "click", function() {
		//button push effect:			
		setTimeout(function() {
			expander.removeClassName("touched");
		}, 150);
		
		main.removeClassName(currentSkin.cssName + (expanded ? "Expanded" : ""));
		main.addClassName(currentSkin.cssName + (expanded ? "" : "Expanded"));
		if (expanded) {
			main.removeClassName("expanded");
		} else {
			main.addClassName("expanded");
		}	
		
		expanded = !expanded;
	});
	
	//setup resize handler to make sure everything is always visible
	var startScreenHeight = isPixi ? 372 : 452;
	var currHeight = parseInt(me.controller.window.innerHeight);
	var resizing = false;
	var overshoot = 0;
	function resize() {
		if (!resizing) {
			resizing = true;
			var innerHeight = parseInt(me.controller.window.innerHeight);
			var diff = currHeight - innerHeight + overshoot;
			var from = displayArea.getHeight();
			var to = from - diff;
			overshoot = 0;
			if (to < 30) {
				overshoot = 30 - to;
				diff = from - 30;
			} else if (to > staticStartHeight) {
				overshoot = to - staticStartHeight;
				diff = from - staticStartHeight;
			}
			to = from - diff;
			currHeight = innerHeight;
			startHeight -= diff;
			endHeight -= diff;
			expanderStart -= diff;
			expanderEnd -= diff;
			var fromExpander = currExpanderTop;
			var toExpander = fromExpander - diff;
			currExpanderTop = toExpander;
			animate({
				from: from,
				to: to,
				fromExpander: fromExpander,
				toExpander: toExpander,
				isResizeAnimation: true,
				onComplete: function() {
					resizing = false;
				}
			});
		}
	}
	Mojo.Event.listen(me.controller.window, "resize", function() {
		//resize();
	});
	if (currHeight != startScreenHeight) {
		currHeight = startScreenHeight;
		//resize();
	}
	
	me.calc = new r.apps.calc();
	
	//--- load calculator state from cookie
	var cookie = new Mojo.Model.Cookie("1plus1_beta");
	var memData = cookie.get();
	if (memData !== undefined) {
		
		//memory register
		if (memData.memory !== undefined && memData.memory != null) {
			me.calc.memory = memData.memory;
			me.calc.hasMemory = true;
			memDiv.show();
			memValDiv.innerHTML = me.calc.memory;
		}
		
		//output data and operations...
		if (memData.calcState !== undefined) {
			previousValuesDiv.innerHTML = memData.calcState.previousValuesHTML;
			currValDiv.innerHTML = memData.calcState.currentValueHTML;
			me.calc.currentValue = memData.calcState.currentValue || [];
			me.calc.previousValues = memData.calcState.previousValues || [];
			me.calc.currentOperation = r.apps.calc.operations[memData.calcState.currentOperation];
			me.calc.pendingValue = memData.calcState.pendingValue;
			me.calc.containsDecimal = memData.calcState.containsDecimal;
			me.calc.decimalPlaces = memData.calcState.decimalPlaces;
			setTimeout(function() {
				scroller.mojo.revealBottom();
			}, 100);
		}
	} else {
		memData = {};
	}
	
	//--- clear all button (screen, memory, and stored state)
	//button push effect:
	Event.observe(clearAllBtn, "mousedown", function() {
		clearAllBtn.addClassName("touched");
	});
	Event.observe(clearAllBtn, "mouseout", function() {
		clearAllBtn.removeClassName("touched");
	});
	Mojo.Event.listen(clearAllBtn, "click", function(){
		//button push effect:			
		setTimeout(function() {
			clearAllBtn.removeClassName("touched");
		}, 150);
		
		//first confirm action
		me.controller.showAlertDialog({
			title: "Clear All State?",
			message: "Are you sure you want to clear all information from the calculator and start over?",
			onChoose: function(val) {
				if (val == "yes") {
					previousValuesDiv.innerHTML = "";
					currValDiv.innerHTML = "";
					memValDiv.innerHTML = "";
					memDiv.hide();
					me.calc.currentValue = [];
					me.calc.previousValues = [];
					me.calc.currentOperation = r.apps.calc.operations.none;
					me.calc.pendingValue = null;
					me.calc.containsDecimal = false;
					me.calc.decimalPlaces = 0;
					me.calc.memory = 0;
					me.calc.hasMemory = false;
					setTimeout(function() {
						scroller.mojo.revealBottom();
					}, 100);
					memData = {
						memory: null,
						calcState: {
							previousValuesHTML: previousValuesDiv.innerHTML,
							currentValueHTML: currValDiv.innerHTML,
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
	Mojo.Event.listen(me.controller.get("iconBtn"), Mojo.Event.tap, function() {
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
		//me.controller.setupWidget(buttonId, buttonAttributes, buttonModel);
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
					memDiv.show();
					memValDiv.innerHTML = me.calc.memory;
					memData.memory = me.calc.memory;
					cookie.put(memData);
				} else if (me.calc.removeMemory) {
					memDiv.hide();
					memData.memory = null;
					cookie.put(memData);
				}
				if (me.calc.newline) {
					if (me.calc.currentOperation !== r.apps.calc.operations.none) {
						if (me.calc.repeatValue) {
							currValDiv.innerHTML = me.calc.getPreviousValue();
							me.calc.repeatValue = false;
						}
						currValDiv.innerHTML += "<span class='currentOperation'> " + me.calc.currentOperation.symbol + "</span>";
					}
					previousValuesDiv.innerHTML += "<div>" + currValDiv.innerHTML + "</div>";
					if (me.calc.currentOperation === r.apps.calc.operations.equals) {
						previousValuesDiv.innerHTML += "<div class='equalsDivider'></div>";
						previousValuesDiv.innerHTML += "<div class='setTotal'>" + me.calc.getPreviousValue() + "&nbsp;&nbsp;</div>";
					}
				}
				currValDiv.innerHTML = me.calc.currentValue.join("");
				scroller.mojo.revealBottom();
				
				//store calculator state in cookie
				memData.calcState = {
					previousValuesHTML: previousValuesDiv.innerHTML,
					currentValueHTML: currValDiv.innerHTML,
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
