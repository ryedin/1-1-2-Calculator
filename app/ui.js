(function() {
	
	jojo.ns("calc");
	
	calc.ui = Class.create(jojo.fsm.finiteStateMachine, {
	  initialize: function($super, options) {
	    var me = this;
	    
	    me.controller = options.controller;
	    me.currentSkin = options.skin || {
	      name: "default",
	      cssName: "blackNglossy"
	    };
	    
	    $super(options);
	    
	    /**
	     * listen to global events that affect UI
	     */
	    jojo.event.eventDispatcher.on("skinSelected", function(args) {
	      me.applySkin(args.skin);
	    });
	    Mojo.Event.listen(me.controller.window, "resize", function() {
	      //resize();
	    });
	  },
	  handleCommand: function(event) {
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
	  },
	  applySkin: function(skin) {
	    var els = this.elements;
	    if (skin && skin.name != "" && skin.name != this.currentSkin.name) {
	      els.main.removeClassName(this.currentSkin.cssName + (this.expanded ? "Expanded" : ""));
	      els.main.addClassName(skin.cssName + (this.expanded ? "Expanded" : ""));
	      this.currentSkin = skin;
	    }
	  },
		updateMemory: function(memory) {
			var els = this.elements;
			if (memory !== undefined && memory !== null) {
				els.memDiv.show();
        els.memValDiv.innerHTML = memory;
			} else {
				els.memValDiv.innerHTML = "";
        els.memDiv.hide();
			}
		},
	  states: {
	    initial: {
	      stateStartup: function(me, args) {
	        me.elements = {
	          main: me.controller.get("main"),
	          scrollingContents: me.controller.get("scrolling_contents"),
	          previousValuesDiv: me.controller.get("previousValuesDiv"),
	          displayArea: me.controller.get("displayArea"),
	          expander: me.controller.get("expander"),
	          clearAllBtn: me.controller.get("clearAllBtn"),
	          memDiv: me.controller.get("memDiv"),
	          memValDiv: me.controller.get("memValDiv"),
	          currValDiv: me.controller.get("currentValueDiv"),
	          iconBtn: me.controller.get("iconBtn")
	        };
	        me.scroller = Mojo.View.getScrollerForElement(me.controller.get("displayArea"));
	        
	        /**
	         * create the main menu
	         */
	        me.controller.setupWidget(Mojo.Menu.appMenu,
	          {
	            omitDefaultItems: true
	          },
	          {
	            visible: true,
	            items: [ 
	              { label: "Skins...", command: 'skinCmd' },
	              { label: "Help...", command: 'helpCmd' }
	            ]
	          }
	        );
	        
	        var els = me.elements;
	      
	        els.memDiv.hide();
	        
					/**  
					 * some environment variables
					 */
	        me.isPixi = Mojo.Environment.DeviceInfo.screenHeight == 400;
	        if (me.isPixi) {
	          els.displayArea.style.height = "35px";
	          els.main.addClassName("pixi");
	        }       
	        
	        /**
	         * expander button
	         */
	        calc.ui.handleButton(els.expander, function() {
						me.fire("expand");
					});
					
					/**
					 * clear all button (screen, memory, and stored state)
					 */
				  calc.ui.handleButton(els.clearAllBtn, function() {				    
				    //first confirm action
				    me.controller.showAlertDialog({
				      title: "Clear All State?",
				      message: "Are you sure you want to clear all information from the calculator and start over?",
				      onChoose: function(val) {
				        if (val == "yes") {
				          els.previousValuesDiv.innerHTML = "";
				          els.currValDiv.innerHTML = "";
				          me.updateMemory(); //empty == hide
				          setTimeout(function() {
				            me.scroller.mojo.revealBottom();
				          }, 100);
				          me.fire("clearState");
				        }
				      },
				      choices: [
				        {label: "OK", value: "yes", type: "affirmative"},
				        {label: "Cancel", value: "no", type: "negative"}
				      ]
				    });
				  });
					
					/**
					 * icon button ("about this app")
					 */
				  Mojo.Event.listen(els.iconBtn, Mojo.Event.tap, function() {
				    me.controller.showAlertDialog({
				      title: "1+1=2 by Ryan Gahl",
				      message: "Thank you for using this application. Make sure to keep checking the App Catalog, as I will be adding features continuously to make this a truly robust calculator app!",
				      choices: [
				        {label: "OK", type: "affirmative"}
				      ]
				    });
				  });
					
					/**
					 * actual calculator operation buttons -------------------------------------------------------------
					 */
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
				    calc.ui.handleButton(button, function() {
							me.fire("buttonClicked", {button: button, buttonModel: buttonModel});
				    });
				  }); 
	        
					/**
					 * after initial UI wiring is completed, go to unexpanded state
					 * TODO: make this a persisted item
					 */
	        return me.states.unexpanded;
	      }
	    },
	    unexpanded: {
	      stateStartup: function(me, args) {
	        var els = me.elements;
	        
	        els.main.removeClassName(me.currentSkin.cssName + "Expanded");
	        els.main.removeClassName("expanded");
	        els.main.addClassName(me.currentSkin.cssName);
	        
	        me.expanded = false;
	      },
	      expand: function(me, args) {
	        return me.states.expanded;
	      }
	    },
	    expanded: {
	      stateStartup: function(me, args) {
	        var els = me.elements;
	        
	        els.main.removeClassName(me.currentSkin.cssName);
	        els.main.addClassName("expanded");
	        els.main.addClassName(me.currentSkin.cssName + "Expanded");
	        
	        me.expanded = true;
	      },
	      expand: function(me, args) {
	        return me.states.unexpanded;
	      }
	    }
	  }
	});
	
	/**
	 * helper method to add feedback to ui buttons and handle the click event
	 * @param {Object} button
	 * @param {Object} callback
	 */
	calc.ui.handleButton = function(button, callback) {
		Event.observe(button, "mousedown", function() {
      button.addClassName("touched");
    });
    Event.observe(button, "mouseout", function() {
      button.removeClassName("touched");
    });
    Mojo.Event.listen(button, "click", function() {
      //button push effect:     
      setTimeout(function() {
        button.removeClassName("touched");
      }, 150);
      
      if (callback) {
				callback();
			}
    });
	};
})();