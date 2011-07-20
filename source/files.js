(function() {
  
  var emptyState = {
    html: [
      '<div id="previousValuesDiv">',
        '<div class="calcset current"></div>',
      '</div>',
      '<div id="currentValueDiv">',
        '<span class="value">0</span>',
        '<span class="operation">&nbsp;&nbsp;</span>',
      '</div>'
    ].join(''),
    currentValue: [],
    currentOperation: "none",
    previousValues: [],
    pendingValue: null,
    containsDecimal: false,
    decimalPlaces: 0,
    memory: null
  };
  var noFiles = [{key: "No files found...", disabled: true}];

  enyo.kind({
    name: "Calc.Files",
    kind: enyo.VFlexBox,
    events: {
      onCancel: "",
      onFileSelected: ""
    },
    published: {
      currentFile: ""
    },
    components: [
      {kind: "PageHeader", content: "Files"},
      {kind: "Scroller", autoVertical: true, autoHorizontal: false, horizontal: false, flex: 1, 
        components: [
        {kind: "VFlexBox", 
          components: [          
              {kind: "RowGroup", caption: "Create New File", components: [
                {kind: "Input", hint: "type new file name here...", name: "newFile", spellcheck: false, components: [
                  {kind: "Button", caption: "Create", onclick: "newFileClick", className: "enyo-button-affirmative"}
                ]}
              ]},
              {kind: "RowGroup", caption: "Open/Delete Existing File", components: [
                {kind: "VirtualRepeater", name: "fileList", onSetupRow: "setupFileRow", components: [
                  {kind: "Item", components: [
                    {kind: "Input", disabled: true, name: "input", components: [
                      {kind: "Button", name: "deleteBtn", caption: "Delete", onclick: "deleteFileClick", className: "enyo-button-negative"},
                      {kind: "Button", name: "openBtn", caption: "Open", onclick: "openFileClick", className: "enyo-button-affirmative"}
                    ]}
                  ]}
                ]}
              ]},
              {kind: "HFlexBox", pack: "end", style: "padding: 0 10px;",
                components: [
                  {name: "cancelButton", kind: "Button", content: "Cancel", onclick: "cancelClick", className: "enyo-tool-button-client enyo-tool-button-captioned"}
                ]
              }
            ]
          }
        ]
      },
    ],
    create: function() {
      var me = this;
      me.files = [];

      me.inherited(arguments);
      me.db = new Lawnchair({name: "ext:files"});    

      //for testing...
      //me.db.nuke();

      me.loadFiles();      
    },
    currentFileChanged: function() {
      this.doFileSelected(this.currentFile);
    },
    loadFiles: function() {
      var me = this;
      me.db.all(function(files) {
        if (files && files.length) {
          me.files = files;
        } else {
          me.files = noFiles;
        }
        me.$.fileList.render();
      });
    },
    loadFile: function(name) {
      var me = this;
      this.db.get(name, function(file) {
        me.setCurrentFile(file);
      });
    },
    saveFile: function(file, cb) {
      var me = this;
      var existingFile = _.find(this.files, function(_file) {
        return _file.key.toLowerCase() === file.key.toLowerCase();
      });
      this.db.save(file, function(savedFile) {
        if (!existingFile) {
          //remove disabled item if this is the first real file
          if (me.files.length == 1 && me.files[0].disabled) me.files = [];
          me.files.push(savedFile);
          me.$.fileList.render();
        }
        cb && cb(savedFile);
      });
    },
    setupFileRow: function(sender, index) {
      var file = this.files ? this.files[index] : null;
      if (file) {
        this.$.input.setValue(file.key);
        if (file.disabled) {
          this.$.input.setDisabled(true); 
          this.$.openBtn.hide();
          this.$.deleteBtn.hide();
        }
        return true;
      }
    },
    newFileClick: function() {
      var me = this;
      var fileName = this.$.newFile.getValue();
      this.newFile(fileName, function(file) {
        me.setCurrentFile(file);
      });
    },
    newFile: function(fileName, cb) {
      var me = this;
      var file = _.find(this.files, function(_file) {
        return _file.key.toLowerCase() === fileName.toLowerCase();
      });
      if (file) {
        Calc.dialogs.alert("A file already exists with that name.");
      } else {
        file = {key: fileName};
        file.state = this.getEmptyState();
        this.saveFile(file, cb);
      }
    },
    getEmptyState: function() {
      var state = _.clone(emptyState);
      state.currentValue = [];
      state.previousValues = [];
      return state;
    },
    deleteFileClick: function(sender, evt) {
      var me = this;
      var file = this.files[evt.rowIndex];
      Calc.dialogs.confirm("Are you sure you want to delete file '" + file.key + "'?", function() {
        me.db.remove(file.key, function() {
          me.loadFiles();
        });
      });
    },
    openFileClick: function(sender, evt) {
      var file = this.files[evt.rowIndex];
      this.setCurrentFile(file);
    },
    cancelClick: function() {
      this.doCancel();
    }
  });

})();

