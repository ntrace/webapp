global.flamegraph = {
	showFunctionInfo: function(info) {
		$('#function-info-all').text(JSON.stringify(info));
	},

	hideFunctionInfo: function() {
		$('#function-info-all').text('');
	}
};