(function() {
	
	jojo.ns("calc");
	
	var cookie;
	
	calc.data = {
		fetch: function() {
			if (!cookie) cookie = new Mojo.Model.Cookie("1plus1_beta");
      return cookie.get();
		},
		save: function(data) {
			cookie.put(data);
		}
	};
})();
