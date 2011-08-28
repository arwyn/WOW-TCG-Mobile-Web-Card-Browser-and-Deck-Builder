$(function() {
	var db = {},
		c = $(".cards"),
		d = [["woe",23],["woe",24],["woe",25],["woe",26],["woe",27],["woe",28]],
		p = 0,
		loadCards = function(p) {
			var np, t, s, n;
			for(np=p-2;np<p+2;np++) {
				if(np >= 0 && np < d.length) { 
					s=d[np][0];
					n=d[np][1];
					t=$(document.createElement("img"));
					t.attr("src", "/images/"+s+"/"+db.card[s][n].image);
					t.attr("id", "card-"+s+"-"+n);
					alert("adding: "+s+"-"+n);
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
				loadCards(np);
				$("img#card-"+d[p][0]+d[p][1]).hide();
				p=np;
				$("img#card-"+d[p][0]+d[p][1]).show();
			}
		},
		loadDb = function(callback) {
			// for now load db file each time
			// TODO: use localStorage object to cache results
			$.getJSON(window.location.href + "db.json", {}, function(data) {
				db = data;
				callback();
			}
		}
	;
	
	loadDb(function() {
		$(".cards .loading").hide();
		switchCard(0);
	}

	$("body").bind("swipeleft", function(e) {
		switchCard(1);
	});
	$("body").bind("swiperight", function(e) {
		switchCard(-1);
	});
});
