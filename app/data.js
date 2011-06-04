(function() {
	
	jojo.ns("calc");
	
  var defaultPrefs = {
    key: "default",
    file: "default"
  };
  
  var defaultFile = {
    key: "default"
  };
  
  calc.data = new jojo.event.eventPublisher();
  
  calc.data.db = {
    prefs: new Lawnchair({name: "ext:prefs"}),
    files: new Lawnchair({name: "ext:files"})
  };
  
  var prefsDb = calc.data.db.prefs;
  var filesDb = calc.data.db.files;
  
  calc.data.loadFile = function(fileName, cb) {
    filesDb.get(fileName, function(file) {
      calc.data.file = file;       
      cb(file);
    });
  };
  
  calc.data.savePrefs = function(cb) {
    prefsDb.save(calc.data.prefs, function(result) {
      calc.data.prefs = result;
      cb(result);
    });
  };
  
  calc.data.loadFiles = function(cb) {
    filesDb.all(function(files) {
      files = files.reject(function(file) {
        return file.key == "default";
      });
      calc.data.files = files;
      cb(files);
    });
  };
  
  calc.data.saveFile = function(cb) {
    filesDb.save(calc.data.file, function(result) {
      calc.data.file = result;
      cb(result);
    });
  };

  calc.data.fsm = new jojo.fsm.finiteStateMachine({
    states: {
      initial: {
        stateStartup: function(me, args) {
          prefsDb.get("default", function(result){
            calc.data.prefs = result;
            if (!calc.data.prefs) {
              prefsDb.save(defaultPrefs, function(result) {
                calc.data.prefs = result;
                me.fire("prefsLoaded");
              });
            } else {
              me.fire("prefsLoaded");
            }
          });
        },
        prefsLoaded: function(me, args) {
          filesDb.get(calc.data.prefs.file, function(result){
            calc.data.file = result;
            if (!calc.data.file) {
              filesDb.save(defaultFile, function(result) {
                calc.data.file = result;
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
      ready: jojo.fsm.emptyState
    }
  });
})();
