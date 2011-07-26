(function() {
  
  var skins = [
    {name: "Black", cssName: "skin_black"},
    {name: "Grey", cssName: "skin_grey"},
    {name: "White", cssName: "skin_white"},
    {name: "White (with black buttons)", cssName: "skin_white_blk"},
    {name: "Spring", cssName: "skin_spring"},
    {name: "Summer", cssName: "skin_summer"},
    {name: "Autumn", cssName: "skin_fall"},
    {name: "Winter", cssName: "skin_winter"},
    {name: "Sky", cssName: "skin_sky"},
    {name: "Flower", cssName: "skin_flower"},
    {name: "Legal Pad", cssName: "skin_legal"}
  ];

  enyo.kind({
    name: "Calc.Skins",
    kind: enyo.VFlexBox,
    events: {
      onCancel: "",
      onSkinSelected: ""
    },
    published: {
      currentSkin: ""
    },
    components: [
      {kind: "PageHeader", content: "Skins"},
      {kind: "Scroller", autoVertical: true, autoHorizontal: false, horizontal: false, flex: 1, 
        className: "subPanel",
        components: [
        {kind: "VFlexBox", 
          components: [    
              {kind: "RowGroup", caption: "Choose a skin", components: [
                {kind: "VirtualRepeater", name: "skinList", onSetupRow: "setupSkinRow", components: [
                  {kind: "Item", components: [
                    {kind: "Input", disabled: true, name: "input", components: [
                      {kind: "Button", name: "openBtn", caption: "Open", onclick: "openSkinClick", className: "enyo-button-affirmative"}
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
    currentSkinChanged: function() {
      this.doSkinSelected(this.currentSkin);
    },
    setupSkinRow: function(sender, index) {
      var skin = skins[index];
      if (skin) {
        this.$.input.setValue(skin.name);
        return true;
      }
    },
    openSkinClick: function(sender, evt) {
      var skin = skins[evt.rowIndex];
      this.setCurrentSkin(skin);
    },
    cancelClick: function() {
      this.doCancel();
    }
  });

})();

