$(function() {
	var db = {},
		loadDb = function(callback) {
			var url = window.location.href.replace(/\/(?:[a-z]*?\.html)?#.*$/, '') + "/db.json";

			// for now load db file each time
			// TODO: use localStorage object to cache results
			$.getJSON(url, {}, function(data) {
				db = data;
				callback();
			});
		}
	;
	
	// init page logic
	// home page
	$("#home").bind("pageshow", function() { if(!db.card) $.mobile.changePage("#dbloader"); });
	$("#dbloader").bind("pageshow", function() {
		var addContinue = function() {
			var btn=$(document.createElement("a"));
			btn.attr("href","#home");
			btn.attr("data-role", "button");
			btn.attr("data-icon", "check");
			btn.text("Continue");
			$("#dbloader div.ui-content").append(btn);
			$("#dbloader").trigger("create");
		}
		if(!db.card) {loadDb(addContinue); }
		else { addContinue(); }
	});
	$("#search").bind("pagebeforeshow", function() {
		if(!db.index) {
			$.mobile.changePage("#dbloader");
			return
		}
		
		var ul, li, uli;
	
		if(!$("#search div[data-role='content'] ul").length) {
			ul = $(document.createElement("ul"));
			ul.attr("data-role","listview");
			ul.attr("data-inset","true");
			if(db.index.type) {
				li = $(document.createElement("li"));
				li.text(db.index.type["name"]);
				uli = $(document.createElement("ul"));
				uli.attr("data-inset","true");
				$.each(db.index.type.content, function(i,v) {
					var li = $(document.createElement("li")),
						num = $(document.createElement("span")),
						a = $(document.createElement("a"))
					;
					a.text(v["name"]);
					a.attr("href", "#list");
					a.bind("click", function() { $("#list").jqmData("cards", v.cards); return true;});
					li.append(a);
					num.addClass("ui-li-count");
					num.text(v.cards.length);
					li.append(num);
					uli.append(li);
				});
				li.append(uli);
				ul.append(li);
			}
			$("#search div[data-role='content']").append(ul).trigger("create");
		}
	});
	
	$("#list").bind("pagebeforeshow", function() {
		if(!db.index) {
			$.mobile.changePage("#dbloader");
			return
		}

		var	cards = $("#list").jqmData("cards"),
			ul = $("#list ul.card-list");
		
		if(!cards) {
			$.mobile.changePage("#home");
			return;
		}
		
		ul.empty();
		$.each(cards, function(i, v) {
			var li=$(document.createElement("li")),
				a=$(document.createElement("a"))
			;
			
			a.attr("href","#card");
			a.text(db.card[v[0]][v[1]]["name"]);
			a.bind("click", function() {
				$("#card").jqmData("cards", cards).jqmData("card", i);
				return true;
			});
			li.append(a);
			ul.append(li)
		});
		ul.listview("refresh");
	});
	
	$("#card").bind("pagebeforeshow", function() {
		if(!db.index) {
			$.mobile.changePage("#dbloader");
			return
		}

		var	cards = $("#card").jqmData("cards"),
			pos = $("#card").jqmData("card"),
			view = $("#card div.cards"),
			getCardId = function(card) {
				return "card-" + card[0] + "-" + card[1];
			},
			loadCards = function(pos) {
				var preload = 2, newpos, tag, set, num, id;
				for(newpos = pos - preload; newpos < pos + preload; newpos++) {
					if(newpos >= 0 && newpos < cards.length) { 
						set = cards[newpos][0];
						num = cards[newpos][1];
						id = getCardId(cards[newpos]);
						if($("#" + id).length) {
							continue;
						}
						tag=$(document.createElement("img"));
						tag.attr("src", "images/"+db.card[set][num].image);
						tag.attr("id", id);
						tag.addClass("card");
						if(newpos>pos) {
							view.append(tag);
						}
						else {
							view.prepend(tag);
						}
					}
				}
			},
			switchCard = function(dir) {
				var newpos = pos + dir;
				if(newpos >= 0 && newpos < cards.length) {
					loadCards(newpos);
					$("img#"+getCardId(cards[pos])).removeClass("active");
					pos=newpos;
					$("img#"+getCardId(cards[pos])).addClass("active");
				}
			}
		;
		
		if(!cards || pos == undefined) {
			$.mobile.changePage("#home");
			return;
		}
		
		$("#card").bind("swipeleft", function(e) {
			switchCard(1);
		});
		$("#card").bind("swiperight", function(e) {
			switchCard(-1);
		});

		loadCards(pos);
		switchCard(0);
	});
//	loadDb(function() {
//		$(".viewport .loading").hide();
//		switchCard(0);
//	});

//	$("body").bind("swipeleft", function(e) {
//		switchCard(1);
//	});
//	$("body").bind("swiperight", function(e) {
//		switchCard(-1);
//	});
});
