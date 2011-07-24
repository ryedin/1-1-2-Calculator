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
      total: "",
      memory: "",
      fileName: ""
    },
    components: [
      {kind: "ApplicationEvents", onWindowRotated: "windowRotated"}, 
      {name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
        {name: "left", width: "520px", kind:"SlidingView", components: [
            {name: "leftHeader", kind: "Header", className: "calcheader", content:"Current File: (none selected)"},
            {className: "operationsScroller", flex: 1, components: [
              {name: "operations", kind: "VFlexBox", flex: 1, className: "operationsArea", components: [
                {name: "display", className: "display", kind: "HtmlContent", content: "<div id='memDiv' class='hidden'>M<span id='memVal'></span></div><span id='displayVal'></span>"}, 
                {name: "buttons", className: "buttons", kind: "Calc.UI.Buttons", onButtonClicked: "doButtonClicked"}
              ]}
            ]},
            {kind: "Toolbar", components: [
              {kind: "GrabButton"}
            ]}
        ]},
        {name: "middle", width: "100%", kind:"SlidingView", peekWidth: 50, components: [
            {name: "rightHeader", kind: "Header", className: "calcheader", content:""},
            {kind: "Scroller", flex: 1, components: [
              {name: "tape", kind: "VFlexBox", flex: 1, components: [
                {name: "tapeScroller", kind: "Scroller", autoVertical: true, autoHorizontal: false,
                    horizontal: false, className: "tapeScroller", flex: 1, components: [
                  {name: "tapeShim", className: "tapeShim", content: "<div>This area is called the 'tape'. As you enter your calculations (using the buttons on the left over there) the tape will keep track of your history with clearly formatted equations and sums. You can scroll the tape up and down if it gets longer than the height of the screen. Now start doing some math!</div>"},
                  {kind: "HtmlContent", name: "tapeContent", className: "scrollingArea", content: [
                      '<div id="previousValuesDiv">',
                        '<div class="calcset current"></div>',
                      '</div>',
                      '<div id="currentValueDiv">',
                        '<span class="value"></span>',
                        '<span class="operation">&nbsp;&nbsp;</span>',
                      '</div>'
                    ].join('')
                  }]
                }]
              }
            ]},
            {kind: "Toolbar", components: [
              {kind: "GrabButton"}
            ]}
        ]}
      ]}
    ],
    rendered: function() {
      var me = this;
      this.inherited(arguments);
      this.setOrientationClass();
      setTimeout(function() {
        me.showShim();
      }, 50);
    },
    setOrientationClass: function () {
      var width = $(document.body).width();
      var vertical = width === 768;
      if (vertical) {
        $(document.body).addClass("vertical");
      } else {
        $(document.body).removeClass("vertical");
      }
    },
    windowRotated: function() {
      var me = this;
      this.setOrientationClass();
      setTimeout(function() {
        me.$.tapeScroller.scrollToBottom();
      }, 50);
    },
    hideShim: function() {
      $("#" + this.getId() + "_tapeShim").hide();
    },
    showShim: function() {
      $("#" + this.getId() + "_tapeShim").show();
      var height = $("#" + this.getId() + "_tapeScroller").height();
      $("#" + this.getId() + "_tapeShim").height(height);
      this.$.tapeScroller.scrollTo(0, 0);
    },
    loadHtml: function(html) {
      this.$.tapeContent.setContent(html);
    },
    getHtml: function() {
      return $("#" + this.getId() + "_tapeContent").html();
    },
    newLine: function() {
      var currHtml = $("#currentValueDiv").html();
      $("#previousValuesDiv .calcset.current").append("<div class='line'>" + currHtml + "</div>");
      $("#currentValueDiv .operation").html("&nbsp;&nbsp;");
    },
    updateDisplay: function(value) {
      $("#displayVal").html(value);
    },
    currentValueChanged: function() {
      if (this.currentValue !== "") {
        $("#displayVal").html(this.currentValue);
      }
      $("#currentValueDiv .value").html(this.currentValue);
      this.alignDecimals();
      if (this.currentValue !== "") {
        this.$.tapeScroller.scrollToBottom();
      }
    },
    fileNameChanged: function() {
      this.$.leftHeader.setContent("Current File: " + this.fileName);
    },
    memoryChanged: function() {
      if (this.memory !== undefined && this.memory !== null) {
        $("#memDiv").removeClass("hidden").show();
        $("#memVal").html(this.memory);
      } else {
        $("#memDiv").hide();
        $("#memVal").html("");
      }
    },
    alignDecimals: function() {
      //TODO: cache stuff and make this more efficient
      var places = 0;
      //1st loop: find max decimal places
      $("#previousValuesDiv .calcset.current .line .value").each(function(index, el) {
        var val = $(el).html();
        var parts = val.split(".");
        if (parts.length == 2) {
          places = parts[1].length > places ? parts[1].length : places;
        }
      });
      //compare with currentValue as well
      var val = $("#currentValueDiv .value").html();
      var parts = val.split(".");
      if (parts.length == 2) {
        places = parts[1].length > places ? parts[1].length : places;
      }      
      
      if (places > 0) {
        //update current value if needed as well
        var neededPlaces = places;
        if (parts.length == 2) {
          neededPlaces = places - parts[1].length;
        } else {
          val += ".";
        }
        for (var i = 0; i < neededPlaces; i++) {
          val += "0";
        }
        $("#currentValueDiv .value").html(val);

        //2nd loop: adjust lines as needed
        $("#previousValuesDiv .calcset.current .line .value").each(function(index, el) {
          var val = $(el).html();
          var parts = val.split(".");
          var neededPlaces = places;
          if (parts.length == 2) {
            neededPlaces = places - parts[1].length;
          } else {
            val += ".";
          }
          for (var i = 0; i < neededPlaces; i++) {
            val += "0";
          }
          $(el).html(val);
        });        
      }
    },
    currentOperationChanged: function() {
      if (this.currentOperation) {
        $("#currentValueDiv .operation").html(" " + this.currentOperation);
      }
    },
    totalChanged: function() {
      $("#previousValuesDiv .calcset.current")
        .append("<div class='equalsDivider'></div>")
        .append("<div class='setTotal line'><span class='value'>" + this.total + "</span>&nbsp;&nbsp;</div>");
      this.alignDecimals();
      $("#previousValuesDiv .calcset.current").removeClass("current");
      $("#previousValuesDiv").append('<div class="calcset current"></div>');
      this.setCurrentValue(this.total);
    }
  });

})();