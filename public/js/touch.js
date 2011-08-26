$(function() {
	$(".gallary").bind("swipeleft", function(e) {
		$(".info").text("left");
	});
	$(".gallary").bind("swiperight", function(e) {
		$(".info").text("right");
	});
});
