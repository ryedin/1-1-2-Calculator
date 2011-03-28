(function() {
	
	jojo.ns("calc");
	
  var defaultPrefs = {
    key: "prefs",
    file: "default"
  };
  
  var defaultFile = {
    key: "file:default"    
  };
  
	calc.data = Class.create(jojo.fsm.finiteStateMachine, {
    initialize: function($super, options){
      this.db = new Lawnchair({name: "ext:db"});
      $super(options);
    },
    states: {
      initial: {
        stateStartup: function(me, args) {
          me.db.get("prefs", function(result){
            me.prefs = result;
            if (!me.prefs) {
              me.db.save(defaultPrefs, function(result) {
                me.prefs = result;
                me.fire("prefsLoaded");
              });
            } else {
              me.fire("prefsLoaded");
            }
          });
        },
        prefsLoaded: function(me, args) {
          me.db.get("file:" + me.prefs.file, function(result) {
            me.file = result;
            if (!me.file) {
              me.db.save(defaultFile, function(result) {
                me.file = result;
                me.fire("fileLoaded");
              });
            } else {
              me.fire("fileLoaded");
            }
          });
        },
        fileLoaded: function(me, args) {
          return me.states.ready;
        }
      }, //end states.initial
      ready: {
        
      } //end states.ready
    }
	});
})();
