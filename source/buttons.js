(function() {
  
  var rows = [{
    "percentBtn": {
      label: "%"    
    },
    "sqrtBtn": {
      label: "&radic;"    
    },
    "negativeBtn": {
      label: "&plusmn;"    
    },
    "divisionBtn": {
      label: "&divide;"    
    },
    "mPlusBtn": {
      label: "M+"
    }
  }, { 
    "num7Btn": {
      label: "7"    
    }, 
    "num8Btn": {
      label: "8"    
    }, 
    "num9Btn": {
      label: "9"    
    },
    "multiplicationBtn": {
      label: "x"    
    },
    "mMinusBtn": {
      label: "M-"    
    }
  }, { 
    "num4Btn": {
      label: "4"    
    }, 
    "num5Btn": {
      label: "5"    
    }, 
    "num6Btn": {
      label: "6"    
    },
    "subtractionBtn": {
      label: "-"    
    },
    "mrBtn": {
      label: "MR"    
    }
  }, {
    "num1Btn": {
      label: "1"    
    }, 
    "num2Btn": {
      label: "2"    
    }, 
    "num3Btn": {
      label: "3"    
    }, "additionBtn": {
      label: "+"    
    }, 
    "mcBtn": {
      label: "MC"    
    }
  }, {  
    "cBtn": {
      label: "C"    
    },
    "num0Btn": {
      label: "0"    
    }, 
    "decimalBtn": {
      label: "."    
    }, 
    "equalsBtn": {
      label: "="    
    }
  }];

  var spec = {
    name: "Calc.UI.Buttons",
    events: {    
      onButtonClicked: ""
    },
    kind: enyo.VFlexBox,
    components: []
  };

  _.each(rows, function(row, rowIndex) {
    var buttonComponents = [];
    var i = 0;
    for (var btn in row) {
      (function(btnName, btn, colIndex) {
        buttonComponents.push({
          name: btnName,
          kind: "HtmlContent",
          className: "calcbutton row" + (rowIndex+1) + " col" + (colIndex+1),
          //caption: btn.label,
          onclick: btnName + "_clicked"//,
          //allowHtml: true
        });
        spec[btnName + "_clicked"] = function() {
          this.doButtonClicked(btn);
        };
      })(btn, row[btn], i++);
    }
    spec.components.push({
      kind: enyo.HFlexBox,
      components: buttonComponents
    });
  });

  enyo.kind(spec);

})();