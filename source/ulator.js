(function() {
  
  function correctFloatingPointError(number, precision) {
    //default returns (10000 * number) / 10000
    //should correct very small floating point errors
    
    var correction = Math.pow(10, precision);
    return Math.round(correction * number) / correction;
  }

  //default (no rounding)
  var mathContext = new MathContext(
    21,
    MathContext.prototype.DEFAULT_FORM,
    false,
    MathContext.prototype.ROUND_UNNECESSARY
  );

  //rounding enabled
  var mathContextRounding = new MathContext(
    21,
    MathContext.prototype.DEFAULT_FORM,
    false,
    MathContext.prototype.DEFAULT_ROUNDINGMODE
  );
  
  enyo.kind({
    name: "Calc.Ulator",
    kind: "Component",
    published: {
      state: ""
    },
    constructor: function(options) { //put this here in case I later want to add constructor options
      this.currentValue = [];
      this.previousValues = [];
      this.currentOperation = Calc.Ulator.operations.none;
      this.containsDecimal = false;
      this.inherited(arguments);

      Calc.ulator = this;
    },
    stateChanged: function() {
      var me = this;
      //output data and operations...
      if (me.state !== undefined) {
        if (me.state.memory !== undefined && me.state.memory !== null) {
          me.memory = me.state.memory;
          me.hasMemory = true;
        }
        me.currentValue = me.state.currentValue || [];
        me.previousValues = me.state.previousValues || [];
        me.currentOperation = Calc.Ulator.operations[me.state.currentOperation];
        me.pendingValue = me.state.pendingValue;
        me.containsDecimal = me.state.containsDecimal;
        me.decimalPlaces = me.state.decimalPlaces;
      }
    },
    update: function(val) {
      this.newline = false;
      this.newMemory = false;
      this.removeMemory = false;
      this.ignoreInput = false;
      this.error = null;
      var intVal = parseInt(val);
      if (!isNaN(intVal)) {
        if (this.currentValue.length < 17 || (this.containsDecimal && this.currentValue.length < 18)) {
          //one more layer of checks here to deal with leading zeros
          if (this.currentValue.length == 1 && this.currentValue[0] == 0) {
            if (intVal == 0) {
              this.ignoreInput = true;
            } else {
              this.currentValue[0] = intVal;
            }
          } else {
            this.currentValue.push(intVal);
            if (this.containsDecimal) {
              this.decimalPlaces++;
            }
          }
        } else {
          this.ignoreInput = true;
        }
      } else {
        switch (val) {
          case "+":
            this.add();
            break;
          case "-":
            this.subtract();
            break;
          case "&divide;":
            this.divide();
            break;
          case "x":
            this.multiply();
            break;
          case "M+":
            this.mPlus();
            break;
          case "M-":
            this.mMinus();
            break;
          case "MR":
            this.mRecall();
            break;
          case "MC":
            this.mClear();
            break;
          case "=":
            this.equals();
            break;
          case ".":
            if (!this.containsDecimal) {
              this.decimal();
            }
            break;
          case "C":
            this.clear();
            break;
          case "%":
            this.percent();
            break;
          case "&radic;":
            this.sqrt();
            break;
          case "&plusmn;":
            this.plusmn();
            break;
        }
      }
      if (this.newline) {
        this.containsDecimal = false;
      }
    },
    getCurrentValue: function() {
      if (this.currentValue.length > 0) {
        // var retVal = eval(this.currentValue.join(""));
        // retVal = correctFloatingPointError(retVal, 10);
        var retVal = this.currentValue.join("");
        return retVal;
      }
      return 0;
    },
    getPreviousValue: function() {
      if (this.previousValues.length > 0) { return this.previousValues[this.previousValues.length - 1]; }
      return null;
    },
    finishPendingOperation: function() {
      if (!this.currentValue.length && this.currentOperation !== Calc.Ulator.operations.equals) return false;
      if ((this.pendingValue || this.pendingValue == 0 || this.pendingValue < 0) &&
          (this.currentOperation && this.currentOperation !== Calc.Ulator.operations.none &&
          this.currentOperation !== Calc.Ulator.operations.equals)) {
        var val = this.currentOperation.fn(this.pendingValue, this.getCurrentValue());
        val = val.toString();
        if (!isNaN(val)) {
          //val = correctFloatingPointError(val, 10);
          this.previousValues[0] = val;
          this.pendingValue = val;
          this.currentValue = [];
          this.containsDecimal = false;
          this.currentOperation = Calc.Ulator.operations.none;
        } else {
          if (typeof val === "string") {
            this.error = val;
          } else {
            this.error = "Unknown error.";
          }
        }
      } else {
        var val = this.currentValue.length > 0 ? this.getCurrentValue() : this.getPreviousValue();
        this.repeatValue = this.currentValue.length == 0;
        this.previousValues[0] = val;
        this.pendingValue = val;
        this.currentValue = [];
        this.containsDecimal = false;
        this.currentOperation = Calc.Ulator.operations.none;
      }
      return true;
    },
    clear: function() {
      this.currentValue = ["0"];
      this.containsDecimal = false;
      this.decimalPlaces = 0;
    },
    add: function() {
      if (this.finishPendingOperation()) {
        if (!this.error) {
          this.currentOperation = Calc.Ulator.operations.add;
          this.newline = true;
        }
      } else {
        this.ignoreInput = true;
      }
    },
    subtract: function() {
      if (this.finishPendingOperation()) {
        this.finishPendingOperation();
        if (!this.error) {
          this.currentOperation = Calc.Ulator.operations.subtract;
          this.newline = true;
        }
      } else {
        this.ignoreInput = true;
      }
    },
    multiply: function() {
      if (this.finishPendingOperation()) {
        this.finishPendingOperation();
        if (!this.error) {
          this.currentOperation = Calc.Ulator.operations.multiply;
          this.newline = true;
        }
      } else {
        this.ignoreInput = true;
      }
    },
    divide: function() {
      if (this.finishPendingOperation()) {
        if (!this.error) {
          this.currentOperation = Calc.Ulator.operations.divide;
          this.newline = true;
        }
      } else {
        this.ignoreInput = true;
      }
    },
    percent: function() {
      if (this.currentValue.length > 0 || this.previousValues.length > 0) {
        var val = this.currentValue.length > 0 ? this.getCurrentValue() : this.getPreviousValue();
        var times = 1;
        if (this.currentOperation !== Calc.Ulator.operations.equals
            && this.previousValues.length > 0) {
          times = this.getPreviousValue();
        }
        // val = correctFloatingPointError((val / 100) * times, 10);
        val = new BigDecimal(val)
          .divide(new BigDecimal("100"), mathContext)
          .multiply(new BigDecimal(times), mathContext);
        this.currentValue = val.toString().split("");
      }
    },
    sqrt: function() {
      if (this.currentValue.length > 0 || this.previousValues.length > 0) {
        var val = this.currentValue.length > 0 ? this.getCurrentValue() : this.getPreviousValue();
        if (val >= 0) {
          val = correctFloatingPointError(Math.sqrt(val), 10);
          this.currentValue = val.toString().split("");
        } else {
          this.error = "Cannot square a negative number.";
        }
      }
    },
    plusmn: function() {
      if (this.currentValue.length == 0) {
        if (this.previousValues.length > 0) {
          this.currentValue = Calc.Ulator.operations.multiply.fn(this.getPreviousValue(), "-1")
            .toString()
            .split("");
        } else {
          this.currentValue.push("-");
        }
      } else {
        if (this.currentValue.length == 1 && this.currentValue[0] === "0") {
          this.currentValue[0] = "-";
        } else if (this.currentValue[0] == "-") {
          this.currentValue[0] = "";
        } else {
          this.currentValue.unshift("-");
        }
      }
    },
    decimal: function() {
      if (!this.containsDecimal) {
        this.containsDecimal = true;
        if (this.currentValue.length == 0) {
          this.currentValue.push("0");
        }
        this.currentValue.push(".");
        this.decimalPlaces = 0;
      }
    },
    mPlus: function() {
      var mem = this.currentValue.length > 0 ? this.getCurrentValue() : (this.previousValues.length > 0 ? this.getPreviousValue() : this.getCurrentValue());
      this.memory = Calc.Ulator.operations.add.fn(this.hasMemory ? this.memory : "0", mem).toString();
      this.hasMemory = true;
      this.newMemory = true;
    },
    mMinus: function() {
      var mem = this.currentValue.length > 0 ? this.getCurrentValue() : (this.previousValues.length > 0 ? this.getPreviousValue() : this.getCurrentValue());
      this.memory = Calc.Ulator.operations.subtract.fn(this.hasMemory ? this.memory : "0", mem).toString();
      this.hasMemory = true;
      this.newMemory = true;
    },
    mRecall: function() {
      if (this.memory != undefined) {
        this.currentValue = this.memory.toString().split("");
      }
    },
    mClear: function() {
      delete this.memory;
      this.removeMemory = true;
      this.hasMemory = false;
    },
    equals: function() {
      if (this.finishPendingOperation()) {
        if (!this.error) {
          this.currentOperation = Calc.Ulator.operations.equals;
          this.newline = true;
        }
      } else {
        this.ignoreInput = true;
      }
    }
  });
  
  Calc.Ulator.operations = {
    none: {
      name: "none"
    },
    equals: {
      name: "equals",
      symbol: "="
    },
    add: {
      name: "add",
      symbol: "+",
      fn: function(a, b) {
        a = new BigDecimal(a);
        b = new BigDecimal(b);
        try {
          var ret = a.add(b, mathContext);
        } catch (ex) {
          ret = a.add(b, mathContextRounding);
          Calc.dialogs.prefAlert("roundingWarning");
        }
        return ret;
      }
    },
    subtract: {
      name: "subtract",
      symbol: "-",
      fn: function(a, b) {
        a = new BigDecimal(a);
        b = new BigDecimal(b);
        try {
          var ret = a.subtract(b, mathContext);
        } catch (ex) {
          ret = a.subtract(b, mathContextRounding);
          Calc.dialogs.prefAlert("roundingWarning");
        }
        return ret;
      }
    },
    multiply: {
      name: "multiply",
      symbol: "x",
      fn: function(a, b) {
        a = new BigDecimal(a);
        b = new BigDecimal(b);
        try {
          var ret = a.multiply(b, mathContext);
        } catch (ex) {
          ret = a.multiply(b, mathContextRounding);
          Calc.dialogs.prefAlert("roundingWarning");
        }
        return ret;
      }
    },
    divide: {
      name: "divide",
      symbol: "&divide;",
      fn: function(a, b) {
        if (eval(b) != 0) { 
          a = new BigDecimal(a);
          b = new BigDecimal(b);
          try {
            var ret = a.divide(b, mathContext);
          } catch (ex) {
            ret = a.divide(b, mathContextRounding);
            Calc.dialogs.prefAlert("roundingWarning");
          }
          return ret;
        }
        return "Cannot divide by zero.";
      }
    }
  };

})();
