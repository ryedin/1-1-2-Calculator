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
      {name: "alertDialog", kind: "ModalDialog", components: [
        {content: "Oops!"}, 
        {name: "alertContent", kind: "HtmlContent"}, 
        {kind: "HFlexBox", pack: "center", components: [
          {kind: "Button", caption: "OK", onclick: "closeAlert", className: "enyo-button-affirmative"}
        ]}
        ]},    
      {name: "confirmDialog", kind: "ModalDialog", components: [
        {content: ""}, 
        {name: "confirmContent", kind: "HtmlContent"}, 
        {kind: "HFlexBox", pack: "center", components: [
          {kind: "Button", caption: "Cancel", onclick: "confirmCancel", className: "enyo-button-secondary"},
          {kind: "Button", caption: "OK", onclick: "confirmOK", className: "enyo-button-affirmative"}
        ]}
      ]},
      {kind: "PageHeader", content: "Files"},
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
      this.db.save(file, function(savedFile) {
        cb && cb(savedFile);
      });
    },
    alert: function(content) {
      this.$.alertDialog.open();
      $("#" + this.getId() + "_alertContent").html(content);
    },
    closeAlert: function() {
      this.$.alertDialog.close();
    },
    confirm: function(content, cb) {
      this.$.confirmDialog.open();
      $("#" + this.getId() + "_confirmContent").html(content);
      this.confirmCallback = cb;
    },
    confirmOK: function() {
      this.$.confirmDialog.close();
      if (typeof this.confirmCallback === "function") {
        this.confirmCallback();
        delete this.confirmCallback;
      }
    },
    confirmCancel: function() {
      this.$.confirmDialog.close();
      delete this.confirmCallback;
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
      var file = _.find(this.files, function(_file) {
        return _file.key.toLowerCase() === fileName.toLowerCase();
      });
      if (file) {
        this.alert("A file already exists with that name.");
      } else {
        file = {key: fileName};
        file.state = _.clone(emptyState);
        this.db.save(file, function(savedFile) {
          //remove disabled item if this is the first real file
          if (me.files.length == 1 && me.files[0].disabled) me.files = [];
          me.files.push(savedFile);
          me.$.fileList.render();
          me.setCurrentFile(savedFile);
        });
      }
    },
    deleteFileClick: function(sender, evt) {
      var me = this;
      var file = this.files[evt.rowIndex];
      me.confirm("Are you sure you want to delete file '" + file.key + "'?", function() {
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

