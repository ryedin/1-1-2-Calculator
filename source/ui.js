(function() {
    
  enyo.kind({
    name: "Calc.UI",
    kind: enyo.VFlexBox,
    events: {
      onButtonClicked: ""
    },
    published: {
      currentValue: "",
      currentOperation: "",
      total: ""
    },
    components: [{
      name: "alertDialog",
      kind: "ModalDialog",
      components: [{
        content: "Oops!"
      }, {
        name: "alertContent",
        kind: "HtmlContent"
      }, {
        kind: "HFlexBox",
        pack: "center",
        components: [{
          kind: "Button",
          caption: "OK",
          onclick: "closeAlert"
        }]
      }]
    }, {
      kind: "HFlexBox",
      components: [{
        name: "operations",
        kind: "VFlexBox",
        flex: 1,
        components: [{
          name: "display",
          kind: "HtmlContent",
          content: "0"
        }, {
          name: "buttons",
          kind: "Calc.UI.Buttons",
          onButtonClicked: "doButtonClicked"
        }]
      }, {
        name: "tape",
        kind: "VFlexBox",
        flex: 1,
        components: [{
          name: "tapeScroller",
          kind: "Scroller",
          autoVertical: true,
          autoHorizontal: false,
          horizontal: false,
          className: "enyo-bg",
          flex: 1,
          components: [{
            kind: "HtmlContent",
            className: "scrollingArea",
            content: [
              '<div id="previousValuesDiv"></div>',
              '<div id="currentValueDiv">0</div>'
            ].join('')
          }]
        }]
      }]
    }],
    alert: function(content) {
      this.$.alertDialog.open();
      $("#" + this.getId() + "_alertContent").html(content);
    },
    closeAlert: function() {
      this.$.alertDialog.close();
    },
    newLine: function() {
      $("#previousValuesDiv").append("<div>" + $("#currentValueDiv").html() + "</div>");
    },
    currentValueChanged: function() {
      if (this.currentValue !== "") this.$.display.setContent(this.currentValue);
      $("#currentValueDiv").html(this.currentValue);
      this.$.tapeScroller.scrollToBottom();
    },
    currentOperationChanged: function() {
      $("#currentValueDiv").append("<span class='currentOperation'> " + this.currentOperation + "</span>");
    },
    totalChanged: function() {
      $("#previousValuesDiv").append("<div class='equalsDivider'></div>");
      $("#previousValuesDiv").append("<div class='setTotal'>" + this.total + "&nbsp;&nbsp;</div>");
      this.setCurrentValue(this.total);
    }
  });

})();