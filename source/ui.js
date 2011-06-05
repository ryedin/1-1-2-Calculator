(function() {
    
  enyo.kind({
    name: "Calc.UI",
    kind: enyo.VFlexBox,
    events: {
      onButtonClicked: ""
    },
    published: {
      currentValue: "",
      currentOperation: ""
    },
    components: [{
      kind: "HFlexBox",
      components: [{
        name: "operations",
        kind: "VFlexBox",
        flex: 1,
        components: [{
          name: "display",
          kind: "HtmlContent",
          content: "display"
        }, {
          name: "buttons",
          kind: "Calc.UI.Buttons",
          onButtonClicked: "doButtonClicked"
        }]
      }, {
        name: "tape",
        kind: "Pane",
        flex: 1,
        components: [{
          kind: "Scroller",
          autoHorizontal: false,
          horizontal: false,
          className: "enyo-bg",
          style: "height: 500px;",
          components: [{
            kind: "HtmlContent",
            content: [
              '<div id="previousValuesDiv"></div>',
              '<div id="currentValueDiv">0</div>'
            ].join('')
          }]
        }]
      }]
    }],
    currentValueChanged: function() {
      this.$.display.setContent(this.currentValue);
      $("#currentValueDiv").html(this.currentValue);
    },
    currentOperationChanged: function() {
      $("#currentValueDiv").append("<span class='currentOperation'> " + this.currentOperation + "</span>");
    }
  });

})();