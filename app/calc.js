(function(){

	jojo.ns("calc");
	
	function correctFloatingPointError(number, precision){
		//default returns (10000 * number) / 10000
		//should correct very small floating point errors
		
		var correction = Math.pow(10, precision);
		return Math.round(correction * number) / correction;
	}
	
	calc.ulator = Class.create({
		initialize: function(options){ //put this here in case I later want to add constructor options
			this.currentValue = [];
			this.previousValues = [];
			this.currentOperation = calc.ulator.operations.none;
			this.containsDecimal = false;
		},
		update: function(val){
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
						}
						else {
							this.currentValue[0] = intVal;
						}
					}
					else {
						this.currentValue.push(intVal);
						if (this.containsDecimal) {
							this.decimalPlaces++;
						}
					}
				}
				else {
					this.ignoreInput = true;
				}
			}
			else {
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
		getCurrentValue: function(){
			if (this.currentValue.length > 0) {
				var retVal = eval(this.currentValue.join(""));
				retVal = correctFloatingPointError(retVal, 10);
				return retVal;
			}
			return 0;
		},
		getPreviousValue: function(){
			if (this.previousValues.length > 0) {
				return this.previousValues[this.previousValues.length - 1];
			}
			return null;
		},
		finishPendingOperation: function(){
			if ((this.pendingValue || this.pendingValue == 0 || this.pendingValue < 0) &&
			(this.currentOperation && this.currentOperation !== calc.ulator.operations.none &&
			this.currentOperation !== calc.ulator.operations.equals)) {
				var val = this.currentOperation.fn(this.pendingValue, this.getCurrentValue());
				if (!isNaN(val)) {
					val = correctFloatingPointError(val, 10);
					this.previousValues.push(val);
					this.pendingValue = val;
					this.currentValue = [];
					this.containsDecimal = false;
					this.currentOperation = calc.ulator.operations.none;
				}
				else {
					if (typeof val == "string") {
						this.error = val;
					}
					else {
						this.error = "Unknown error.";
					}
				}
			}
			else {
				var val = this.currentValue.length > 0 ? this.getCurrentValue() : this.getPreviousValue();
				this.repeatValue = this.currentValue.length == 0;
				this.previousValues.push(val);
				this.pendingValue = val;
				this.currentValue = [];
				this.containsDecimal = false;
				this.currentOperation = calc.ulator.operations.none;
			}
		},
		clear: function(){
			this.currentValue = [];
			this.containsDecimal = false;
			this.decimalPlaces = 0;
		},
		add: function(){
			this.finishPendingOperation();
			if (!this.error) {
				this.currentOperation = calc.ulator.operations.add;
				this.newline = true;
			}
		},
		subtract: function(){
			this.finishPendingOperation();
			if (!this.error) {
				this.currentOperation = calc.ulator.operations.subtract;
				this.newline = true;
			}
		},
		multiply: function(){
			this.finishPendingOperation();
			if (!this.error) {
				this.currentOperation = calc.ulator.operations.multiply;
				this.newline = true;
			}
		},
		divide: function(){
			this.finishPendingOperation();
			if (!this.error) {
				this.currentOperation = calc.ulator.operations.divide;
				this.newline = true;
			}
		},
		percent: function(){
			if (this.currentValue.length > 0 || this.previousValues.length > 0) {
				var val = this.currentValue.length > 0 ? this.getCurrentValue() : this.getPreviousValue();
				val = correctFloatingPointError((val / 100), 10);
				this.currentValue = val.toString().split("");
			}
		},
		sqrt: function(){
			if (this.currentValue.length > 0 || this.previousValues.length > 0) {
				var val = this.currentValue.length > 0 ? this.getCurrentValue() : this.getPreviousValue();
				if (val >= 0) {
					val = correctFloatingPointError(Math.sqrt(val), 10);
					this.currentValue = val.toString().split("");
				}
				else {
					this.error = "Cannot square a negative number.";
				}
			}
		},
		plusmn: function(){
			if (this.currentValue.length == 0) {
				this.currentValue.push("-");
			}
			else 
				if (this.currentValue[0] == "-") {
					this.currentValue[0] = "";
				}
				else {
					this.currentValue.unshift("-");
				}
		},
		decimal: function(){
			if (!this.containsDecimal) {
				this.containsDecimal = true;
				if (this.currentValue.length == 0) {
					this.currentValue.push("0");
				}
				this.currentValue.push(".");
				this.decimalPlaces = 0;
			}
		},
		mPlus: function(){
			var mem = this.currentValue.length > 0 ? this.getCurrentValue() : (this.previousValues.length > 0 ? this.getPreviousValue() : this.getCurrentValue());
			this.memory = this.hasMemory ? this.memory + mem : mem;
			this.memory = correctFloatingPointError(this.memory, 10);
			this.hasMemory = true;
			this.newMemory = true;
		},
		mMinus: function(){
			var mem = this.currentValue.length > 0 ? this.getCurrentValue() : (this.previousValues.length > 0 ? this.getPreviousValue() : this.getCurrentValue());
			this.memory = this.hasMemory ? this.memory - mem : (0 - mem);
			this.memory = correctFloatingPointError(this.memory, 10);
			this.hasMemory = true;
			this.newMemory = true;
		},
		mRecall: function(){
			if (this.memory != undefined) {
				this.currentValue = this.memory.toString().split("");
			}
		},
		mClear: function(){
			delete this.memory;
			this.removeMemory = true;
			this.hasMemory = false;
		},
		equals: function(){
			this.finishPendingOperation();
			if (!this.error) {
				this.currentOperation = calc.ulator.operations.equals;
				this.newline = true;
			}
		}
	});
	
	calc.ulator.operations = {
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
			fn: function(a, b){
				return eval(a + "+" + b);
			}
		},
		subtract: {
			name: "subtract",
			symbol: "-",
			fn: function(a, b){
				return eval(a + "-" + b);
			}
		},
		multiply: {
			name: "multiply",
			symbol: "x",
			fn: function(a, b){
				return eval(a + "*" + b);
			}
		},
		divide: {
			name: "divide",
			symbol: "&divide;",
			fn: function(a, b){
				if (eval(b) != 0) {
					return eval(a + "/" + b);
				}
				return "Cannot divide by zero.";
			}
		}
	};
})();