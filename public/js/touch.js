$(function() {
	var c = $(".cards"),
		d = [["woe",23],["woe",24],["woe",25],["woe",26],["woe",27],["woe",28]],
		p = 0,
		loadCards = function(p) {
			var np, t, s, n;
			for(np=p-2;np<p+2;np++) {
				if(np >= 0 && np < d.length) { 
					s=d[np][0];
					n=d[np][1];
					t=$(document.createElement("img"));
					t.attr("src", "/images/"+s+"/"+localStorage.card[s][n].image);
					t.attr("id", "card-"+s+"-"+n);
					t.addClass("card");
					if(np>p) {
						c.append(t);
					}
					else {
						c.prepend(t);
					}
				}
			}
		},
		switchCard = function(dir) {
			var np = p+dir;
			if(np >= 0 && np < d.length) {
				loadCards();
				$("img#card-"+d[p][0]+d[p][1]).hide();
				p=np;
				$("img#card-"+d[p][0]+d[p][1]).show();
			}
		}
	;
	
	// initialise db (emulate if not found)
	if(!window.localStorage) {
		window.localStorage = {};
	}
	if(!localStorage.card) {
		$.getJSON("http://y-ddraig-goch.net/m/db.json", {}, function(data) {
			$.extend(localStorage, data);
			switchCard(0);
		});
	}
	else {
		switchCard(0);
	}
	

	$("body").bind("swipeleft", function(e) {
		switchCard(1);
	});
	$("body").bind("swiperight", function(e) {
		switchCard(-1);
	});
});
