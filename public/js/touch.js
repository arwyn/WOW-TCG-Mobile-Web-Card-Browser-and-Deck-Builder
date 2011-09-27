$(function() {
	var db = {},
		page = {},
		refreshDb = function(callback) {
			var url = window.location.href.replace(/\/(?:[a-z]*?\.html)?#.*$/, '') + "/db.json";
				
			// download and store in localstorage
			$.getJSON(url, {}, function(data) {
				//TODO: generate index.
				
				data.timestamp = Date.now();
				db = data;
				localStorage.db = JSON.stringify(data);
				
				page.search.page.trigger("populate");
				
				callback();
			});
		},
		checkDb = function() {
			if(db.index) return true; // already loaded
			if(localStorage.db) { // load from storage
				db = JSON.parse(localStorage.db);
				page.search.page.trigger("populate");
				return true;
			}
			return false;
		},
		loadDb = function() {
			return $.mobile.changePage(checkDb() ? "#dbrefresh" : "#dbloader");
		}
	;
	
	// build page object list
	$("div[data-role='page'],div[data-role='dialog']").each(function() {
		var self = $(this),
			head = $("div[data-role='header']", self),
			body = $("div[data-role='content']", self),
			id = self.attr("id");
		
		page[id] = { page: self, head: head, body: body };
	});
	
	// init page logic
	// home page
	page.home.page.bind("pagebeforeshow", function() { if(!checkDb()) return loadDb(); });
	page.dbloader.page.bind("pagebeforeshow", function() {
		$("a", page.dbloader.body).bind("click", function() {
			$.mobile.showPageLoadingMsg();
			refreshDb(function() { $.mobile.hidePageLoadingMsg(); $.mobile.changePage("#home"); });
		});
	});
	page.dbrefresh.page.bind("pagebeforeshow", function() {
		$("dd.timestamp", page.dbrefresh.body).text(new Date(db.timestamp).toLocaleString());
		$("a", page.dbrefresh.body).bind("click", function() {
			$.mobile.showPageLoadingMsg();
			refreshDb(function() { $.mobile.hidePageLoadingMsg(); $.mobile.changePage("#home"); });
		});
		
	});
	page.search.page.bind("pagebeforeshow", function() {
		if(!checkDb()) return loadDb();
		
		$("ul.card-search", page.search.body).listview("refresh");
	});
	page.search.page.bind("populate", function() {
		var li, uli, ul = $("ul.card-search", page.search.body);
		
		ul.empty();

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
	});

	
	page.list.page.bind("pagebeforeshow", function() {
		if(!checkDb()) return loadDb();

		var	cards = page.list.page.jqmData("cards"),
			prev = page.list.page.jqmData("prev-cards")
			ul = $("#list ul.card-list");
		
		if(!cards) {
			$.mobile.changePage("#home");
			return;
		}
		
		if(prev != cards) {
			ul.trigger("populate", [cards]);
		}
		page.list.page.jqmData("prev-cards",cards);
	});
	page.list.page.bind("pagecreate", function() {
		var	ul = $("#list ul.card-list");
	
		ul.bind("populate", function(e, cards) {
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
	});
	
	page.card.page.bind("pagebeforeshow", function() {
		if(!checkDb()) return loadDb();

		var	cards = page.card.page.jqmData("cards"),
			pos = page.card.page.jqmData("card"),
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
						if(newpos > pos) {
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
					$("img.card").removeClass("active");
					pos = newpos;
					$("img#"+getCardId(cards[pos])).addClass("active");
					$(".card-number", page.card.body).val(pos + 1 + "").slider("refresh");
				}
			},
			range = $(".card-number", page.card.body),
			container = $(".card.container", page.card.body)
		;
		
		if(!cards || pos == undefined) {
			$.mobile.changePage("#home");
			return;
		}
		
		range.attr("min","1").attr("max",cards.length+1+"");
		(function(el, timeout) {
			var timer, trig=function() { el.trigger("changed"); };
			el.bind("change", function() {
				if(timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(trig, timeout);
			});
		})(range, 500);
		range.bind("changed", function() { 
			if((pos+1)+"" != range.val()) { pos=parseInt(range.val())-1; loadCards(pos); switchCard(0); }
		});
		
		$(".card.container", page.card.page).bind("swipeleft swiperight", function(e) {
			switchCard(e.type=="swipeleft" ? 1 : -1);
		});

		loadCards(pos);
		switchCard(0);
	});
});
