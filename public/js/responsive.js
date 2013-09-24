var $window = $(window);

function onResize() {
	var width = $window.width();
	console.log('resized to ' + width);
	$('svg.flmg').attr('width', width);
}

$window.resize(onResize);
$(onResize);