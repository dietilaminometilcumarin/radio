/*! SHOUTcast & Icecast Radio Player  v1.1 (2/7/17) | (c) 2017, Danial Sabagh | http://danialsabagh.com | http://mersadesign.com */
jQuery((function($) {
    "use strict";
    $(".shiPlayer").append('<div class="blur"></div><div class="mainSection"><div class="panel1"><div class="top"><div class="trackTitle">DETACH</div><div class="trackSinger">On Line Radio</div></div><div class="middle"><div class="centered-vertically"></div><div class="play"><div class="playpausebtn icon-play-r"></div><div class="frontTiming">00:00 / </div></div></div></div><div class="panel2" style="display:none"><ul></ul></div><div class="panel3" style="display:none"><div class="rLogo" title=""></div><div class="rName"><span class="icon-radio-tower"></span><span class="ct"></span></div><div class="cListeners"><span class="icon-headphones"></span><span class="ct"></span></div><div class="pListeners"><span class="icon-power"></span><span class="ct"></span></div><div class="rSite"><span class="icon-link"></span><span class="ct"></span><a target="_blank" href="" title="Stream Website" >Stream Website</a></div><div class="rTags"><span class="icon-tag"></span></div></div></div><div class="dashboard"><div class="centered-vertically"></div><div class="icon-Info"></div><div class="icon-history2"></div><div class="live" style="width: 50px"><div class="bliking"></div><div class="icon"></div></div><div class="sound shake icon-volume-high"></div><div class="share-button "><div class="social-toggle icon-share"></div><div class="social-networks"><ul><li class="social-twitter icon-twitter"><a target="_blank" href="#"></a></li><li class="social-facebook icon-facebook"><a target="_blank" href="#"></a></li><li class="social-gplus icon-google-plus"><a target="_blank" href="#"></a></li><li class="social-email icon-email"><a target="_blank" href="#"></a></li></ul></div></div></div>'), $.fn.shiPlayer = function(options) {
        var settings = $.extend({
                type: "",
                URL: "",
                lastFMkey: "665b8ff2830d494379dbce3fb3b218a9",
                mount_point: "",
                cors_proxy: "",
                stream_id: 1,
                streampath: "/stream?icy=http",
                radio_logo: "",
                default_image: "./img/default_artwork.jpg",
                blurriness: "",
                autoplay: !1
            }, options),
            thisObj, audio;
        thisObj = this;
        var ppBtn = $(".playpausebtn", thisObj),
            image = settings.default_image;

        function togglePlying(t, e) {
            $(t).toggleClass("playing", e)
        }

        function playManagement() {
            if (audio.paused) {
                setTimeout((function() {
                    audio.play()
                }), 150);
                var t = $(".playpausebtn.playing");
                0 === $(thisObj).find(t).length && t.click(), $(thisObj).addClass("bekhon"), $(".shiPlayer", thisObj).removeClass("nakhon ")
            } else audio.pause(), $(thisObj).addClass("nakhon"), $(".shiPlayer", thisObj).removeClass("bekhon")
        }

        function getReadableTime(t) {
            if ("Infinity" == t) return "live";
            var e = Math.floor(t / 60),
                i = Math.floor(t - 60 * e);
            return i < 10 && (i = "0" + i), e < 10 && (e = "0" + e), e + ":" + i + " / "
        }

        function splitter(t, e) {
            if (void 0 === t && (t = "undefined - undefined"), t.indexOf("-") > -1) {
                var [i, s] = t.split(/-(.+)?/);
                if ("artist" == e) return i.trim();
                if ("title" == e) return s.trim()
            } else {
                if (console.log("The track name is not separated by - (dash)!"), "artist" == e) return "";
                if ("title" == e) return t
            }
        }

        function updateArtist(t) {
            $(".trackSinger", thisObj).attr("data-text", t).text(textShortener(t, 30))
        }

        function updateTitle(t) {
            $(".trackTitle", thisObj).attr("data-text", t).text(textShortener(t, 25))
        }

        function updateTag(t) {
            $(thisObj).attr("data-tag", t)
        }

        function getImage(t) {
            t = prepareArtistName(t);
            var e = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + (t = encodeURI(t)) + "&api_key=" + settings.lastFMkey + "&format=json";
            $.getJSON(e, (function(e) {
                e.error ? (console.log(e.message), console.log("The above error is for " + encodeURI(t))) : e.artist.image[e.artist.image.length - 1]["#text"].length > 0 ? image = e.artist.image[e.artist.image.length - 1]["#text"] : console.log("No image is associated with '" + decodeURI(t) + "' on Last.FM!"), $(".blur", thisObj).css("background-image", "url(" + image + ")")
            })).error((function() {
                console.log("#getImage(), Error in loading artist background image for " + decodeURI(t))
            }))
        }

        function getTag() {
            return $(thisObj).attr("data-tag")
        }

        function updateSH(t, e) {
            // setInterval
            // (
            // (
            // function() 
            // {
            // $.getJSON(t,
            // (
            // function(t) 
            // {
            // if(t.songtitle!=getTag())
            // {
            // updateTag(t.songtitle);
            // var i=splitter(t.songtitle,"artist"),s=splitter(t.songtitle,"title");
            // updateArtist(i),updateTitle(s),getImage(i),updateHistory(e),getNextSong(t),updateServerInfoSH(t)
            // }
            // }
            // )
            // )
            // .error(
            // (
            // function()
            // {
            // console.log("Error, in loading ShoutCast "+t)
            // }
            // )
            // )
            // }
            // )
            // ,10000
            // )
        }

        function updateHistory(t) {
            $(".panel2 ul li", thisObj).remove(), $.getJSON(t, (
                function(t) {
                    for (var e = 0; e < t.length; e++) {
                        var i = e,
                            s = splitter(t[e].title, "artist"),
                            a = splitter(t[e].title, "title"),
                            n = i;
                        0 === i && (n = "NOW");
                        var r = textShortener(s, 20),
                            o = textShortener(a, 28);
                        $(".panel2 ul", thisObj).append("<li class='list' id='row" + i + "'><div class='leftBox'><div class='listNum'><span>" + n + "</span></div><p class='title'>" + o + "</p><p class='singer'>" + r + "  " + getTime(t[e].playedat) + "</p></div><div class='rightBox'><div class='artwork'></div></div></li>"), getImageList(s, i)
                    }
                }
            ))
        }

        function getImageList(t, e) {
            t = prepareArtistName(t);
            var i = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + (t = encodeURI(t)) + "&api_key=" + settings.lastFMkey + "&format=json";
            $.getJSON(i, (function(t) {
                t.error || t.artist.image[t.artist.image.length - 1]["#text"].length > 0 && (image = t.artist.image[t.artist.image.length - 1]["#text"]), $("li#row" + e + ".list > div.rightBox > div.artwork", thisObj).css("background-image", "url(" + image + ")")
            })).error((function() {
                console.log("#getImageList(), Error in loading history image list for " + decodeURI(t))
            }))
        }

        function getNextSong(t) {
            setTimeout((function() {
                if (void 0 !== t.nexttitle) {
                    var e = splitter(t.nexttitle, "artist"),
                        i = splitter(t.nexttitle, "title"),
                        s = textShortener(e, 20),
                        a = textShortener(i, 28);
                    $(".panel2 ul li.list#row0", thisObj).before("<li class='list' id='rowNEXT'><div class='leftBox'><div class='listNum nxttrack'><span>NEXT</span></div><p class='title'>" + a + "</p><p class='singer'>" + s + "</p></div><div class='rightBox'><div class='artwork'></div></div></li>"), getImageList(e, "NEXT")
                }
            }), 2e3)
        }

        function getTime(unixtimestamp) {
            var dt = eval(1e3 * unixtimestamp),
                myDate = new Date(dt),
                mt = myDate.toTimeString();
            return "<span class='playedAT'>" + mt.substring(0, 9) + "</span>"
        }

        function updateServerInfoSH(t) {
            $("div.rName > .ct", thisObj).text(t.servertitle), $("div.cListeners > .ct", thisObj).text("Current Listeners: " + t.currentlisteners), $("div.pListeners > .ct", thisObj).text("Peak Listeners: " + t.peaklisteners), $("div.rSite > a", thisObj).attr("href", t.serverurl), $("div.rTags > .tg", thisObj).remove()
        }

        function updateIC(t) {
            // setInterval(
                // (function() {
                    // $.getJSON(t, (function(t) {
                        // var e = findMountPointData(t);
                        // if (e.title != getTag()) {
                            // updateTag(e.title);
                            // var i = splitter(e.title, "artist"),
                                // s = splitter(e.title, "title");
                            // updateArtist(i), updateTitle(s), getImage(i), history.length >= 20 && (history = []), updateHistoryIC(i, s), updateServerInfoIC(e)
                        // }
                    // })).error((function() {
                        // console.log("Error, in loading Icecast " + t)
                    // }))
                // }), 10000)

        }

        function findMountPointData(t) {
            if (void 0 === t.icestats.source.length) return t.icestats.source;
            for (var e = 0; e < t.icestats.source.length; e++) {
                if (t.icestats.source[e].listenurl.indexOf(settings.mount_point) >= 0) return t.icestats.source[e]
            }
        }

        function updateHistoryIC(t, e) {
            addToHistoryArray(e, t, (new Date).getTime() / 1e3), history[history.length - 1].tm = 0, createHistoryRows()
        }

        function updateServerInfoIC(t) {
            $("div.rName > .ct", thisObj).text(t.server_name), $("div.cListeners > .ct", thisObj).text("Current Listeners: " + t.listeners), $("div.pListeners > .ct", thisObj).text("Peak Listeners: " + t.listener_peak), $("div.rSite > a", thisObj).attr("href", t.server_url), $("div.rTags > .tg", thisObj).remove();
            for (var e = t.genre.split(" "), i = 0; i < e.length; i++) "" !== e[i] && $("div.rTags", thisObj).append("<span class='tg'>" + e[i] + "</span>")
        }

        function prepareArtistName(t) {
            return (t = t.toLowerCase()).includes("&") ? t = t.replace("&", "and") : t.includes("feat") ? t = t.substr(0, t.indexOf("feat")) : t.includes("ft") && (t = t.substr(0, t.indexOf("ft"))), t
        }
        audio = new Audio, audio.volume = 1, thisObj.each((function() {
            if ($(".blur", thisObj).css("background-image", "url(" + image + ")"), settings.radio_logo.length > 0 && $("div.panel3 > div.rLogo", thisObj).css("background-image", "url(" + settings.radio_logo + ")"), settings.blurriness.length > 0 && $("div.blur", thisObj).css({
                    filter: "blur(" + settings.blurriness + ")",
                    "-webkit-filter": "blur(" + settings.blurriness + ")",
                    "-moz-filter": "blur(" + settings.blurriness + ")",
                    "-ms-filter": "blur(" + settings.blurriness + ")",
                    "-o-filter": "blur(" + settings.blurriness + ")"
                }), settings.autoplay && (audio.autoplay = !0), ShareImplementation(), "shoutcast" == settings.type.toLowerCase())
                audio.src = settings.URL + settings.streampath,
                updateSH(settings.URL + "/stats?sid=" + settings.stream_id + "&json=1&callback=?", settings.URL + "/played?sid=" + settings.stream_id + "&type=json&callback=?");
            else if ("icecast" == settings.type.toLowerCase()) {
                audio.src = settings.URL + "/" + settings.mount_point, updateIC(settings.cors_proxy + settings.URL + "/status-json.xsl")
            }
        })), $(audio).on("playing", (function() {
            togglePlying(ppBtn, !0), $(ppBtn).addClass("icon-stop-r"), $(ppBtn).removeClass("icon-play-r")
        })), $(audio).on("pause", (function() {
            togglePlying(ppBtn, !1), $(ppBtn).removeClass("icon-stop-r"), $(ppBtn).addClass("icon-play-r")
        })), $(audio).on("timeupdate", (function() {
            $(".frontTiming", thisObj).text(getReadableTime(this.currentTime))
        })), $(ppBtn, thisObj).on("click tap", (function() {
            playManagement()
        })), $(".sound", thisObj).on("click tap", (function() {
            $(this).hasClass("icon-volume-mute2") ? ($(audio).animate({
                volume: 1
            }, 500), $(this, thisObj).removeClass("icon-volume-mute2", 1e3, "linear")) : ($(audio).animate({
                volume: 0
            }, 500), $(this, thisObj).addClass("icon-volume-mute2", 1e3, "linear")), closeShareButton()
        }));
        var history = new Array;

        function addToHistoryArray(t, e, i) {
            history.unshift({
                ar: e,
                tt: t,
                tm: i
            })
        }

        function createHistoryRows() {
            $(".panel2 ul li", thisObj).remove();
            for (var t = 0; t < history.length; t++) {
                var e = t,
                    i = 0,
                    s = e;
                0 === e && (s = "NOW"), i = t !== history.length - 1 ? getTime(history[t].tm) : "";
                var a = history[t].ar,
                    n = history[t].tt,
                    r = textShortener(a, 20),
                    o = textShortener(n, 28);
                $(".panel2 ul", thisObj).append("<li class='list' id='row" + e + "'><div class='leftBox'><div class='listNum'><span>" + s + "</span></div><p class='title'>" + o + "</p><p class='singer'>" + r + "  " + i + "</p></div><div class='rightBox'><div class='artwork'></div></div></li>"), getImageList(history[t].ar, e)
            }
        }

        function setFBShareAttr(t) {
            var e = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(t);
            $("li.social-facebook", thisObj).find("a").attr("href", e)
        }

        function setTWShareAttr(t) {
            var e = "https://twitter.com/home?status=" + encodeURIComponent(t);
            $("li.social-twitter", thisObj).find("a").attr("href", e)
        }

        function setGPShareAttr(t) {
            var e = "https://plus.google.com/share?url=" + encodeURIComponent(t);
            $("li.social-gplus", thisObj).find("a").attr("href", e)
        }

        function setEmailAttr(t) {
            var e = $("div.panel3 > div.rName > span.ct").text(),
                i = "mailto:?subject=" + ("Listen to " + e) + "&body=" + ("Check out the radio station " + e + " on " + t);
            $(".social-email > a", thisObj).on("click tap", (function(t) {
                t.preventDefault(), window.location = i
            }))
        }

        function ShareImplementation() {
            setTimeout((function() {
                var t = window.location.href;
                setFBShareAttr(t), setTWShareAttr(t), setGPShareAttr(t), setEmailAttr(t)
            }), 3e3)
        }

        function closeShareButton() {
            $(".social-networks", thisObj).hasClass("open-menu") && $(".social-networks", thisObj).removeClass("open-menu")
        }

        function textShortener(t, e) {
            return t.length > e ? t.substring(0, e - 1) + "..." : t
        }
        $(".social-toggle", thisObj).on("click", (function() {
            $(this).next().toggleClass("open-menu")
        })), 
		$("div.icon-history2", thisObj).on("click", (function() {
            $("div.icon-Info", thisObj).removeClass("pressed"), $(this).toggleClass("pressed");
            var t = $(".mainSection > div:visible", thisObj);
            if ("none" == $("div.panel2", thisObj).css("display")) var e = $("div.panel2", thisObj);
            else e = $("div.panel1", thisObj);
            t.fadeOut(500, (function() {
                e.fadeIn(500)
            })), closeShareButton()
        })), 
		$("div.icon-Info", thisObj).on("click", (function() {
            $("div.icon-history2", thisObj).removeClass("pressed"), $(this).toggleClass("pressed");
            var t = $(".mainSection > div:visible", thisObj);
            if ("none" == $("div.panel3", thisObj).css("display")) var e = $("div.panel3", thisObj);
            else e = $("div.panel1", thisObj);
            t.fadeOut(500, (function() {
                e.fadeIn(500)
            })), closeShareButton()
        })), 
		$(window).keypress((function(t) {
            0 !== t.keyCode && 0 !== t.keyCode || (t.preventDefault(), $(thisObj).hasClass("bekhon") ? (audio.pause(), $(thisObj).removeClass("bekhon"), $(thisObj).addClass("nakhon")) : $(thisObj).hasClass("nakhon") && (audio.play(), $(thisObj).removeClass("nakhon"), $(thisObj).addClass("bekhon")))
        }))
    }
}));