$(function() {
	var p=1, imgs = $(".gallary img"),
		moveimg = function(i) {
			if(p+i >= 0 && p+i <imgs.length) {
				imgs.eq(p).hide();
				p = p+i;
				imgs.eq(p).show();
			}
		}
	;
	imgs.hide();
	moveimg(0);

	$(".gallary").bind("swipeleft", function(e) {
		moveimg(1);
	});
	$(".gallary").bind("swiperight", function(e) {
		moveimg(-1);
	});
});
