enyo.kind({
  name: "Calc.Preferences",
  kind: enyo.VFlexBox,
  events: {
    onPreferencesLoaded: "",
    onSave: "",
    onCancel: ""
  },
  components: [
    {kind: "PageHeader", content: "Preferences"},
    {name: "preferencesService", kind: "enyo.SystemService"},
    {kind: "VFlexBox",
      components: [
        {kind: "RowGroup", caption: "General", components: [
          //put preferences components here
        ]},
        {kind: "HFlexBox", pack: "end", style: "padding: 0 10px;",
          components: [
            {name: "saveButton", kind: "Button", content: "Save", onclick: "saveClick"},
            {width: "10px"},
            {name: "cancelButton", kind: "Button", content: "Cancel", onclick: "cancelClick"}
          ]
        }
      ]
    },
  ],
  create: function() {
    this.inherited(arguments);
    this.prefs = {key: "default"};

    this.db = new Lawnchair({name: "ext:prefs"}); 

    //for testing...
    //this.db.nuke();
    
    this.loadPreferences();  

    Calc.preferences = this;
  },
  loadPreferences: function() {
    var me = this;
    me.db.get("default", function(prefs) {
      if (prefs) {
        me.prefs = prefs;
        me.doPreferencesLoaded(prefs);
      }
    });
  },
  setPreference: function(key, value, cb) {
    this.prefs[key] = value;
    this.db.save(this.prefs, function(savedDoc) {
      cb && cb(savedDoc);
    });
  },
  saveClick: function() {
    this.doSave();
  },
  cancelClick: function() {
    this.doCancel();
  }
});