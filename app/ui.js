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
	          
	        //setup the display area expander to allow full screen viewing
	        var isPixi = Mojo.Environment.DeviceInfo.screenHeight == 400;
	        if (isPixi) {
	          els.displayArea.style.height = "35px";
	          els.main.addClassName("pixi");
	        }       
	        
	        //button push effect:
	        Event.observe(els.expander, "mousedown", function() {
	          els.expander.addClassName("touched");
	        });
	        Event.observe(els.expander, "mouseout", function() {
	          els.expander.removeClassName("touched");
	        });
	        Mojo.Event.listen(els.expander, "click", function() {
	          //button push effect:     
	          setTimeout(function() {
	            els.expander.removeClassName("touched");
	          }, 150);
	          
	          me.fire("expand");
	        });
	        
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
})();