var statIdName = "vlstatId",
	xmlHttp, count_domain = "stats.ys7.com";

function setCookie(a, c, d) {
	var b = new Date;
	b.setDate(b.getDate() + d);
	document.cookie = a + "=" + escape(c) + (null == d) ? "" : ";expires=" + b.toGMTString() + ";path=/;domain=" + count_domain
}

function getCookie(a) {
	return 0 < document.cookie.length && (c_start = document.cookie.indexOf(a + "="), -1 != c_start) ? (c_start = c_start + a.length + 1, c_end = document.cookie.indexOf(";", c_start), -1 == c_end && (c_end = document.cookie.length), unescape(document.cookie.substring(c_start, c_end))) : ""
}

function getTimestamp() {
	return Date.parse(new Date)
}

function genStatId() {
	var a = getTimestamp();
	return a = "vlstat-" + a + "-" + Math.round(3E9 * Math.random())
}

function setStatId() {
	var a = genStatId();
	setCookie(statIdName, a, 365)
}

function getStatId() {
	var a = getCookie(statIdName);
	if (null != a && 0 < a.length) return a;
	setStatId();
	return "undefind"
}

function getUA() {
	var a = navigator.userAgent;
	250 < a.length && (a = a.substring(0, 250));
	return a
}

function getBrower() {
	var a = getUA();
	return -1 != a.indexOf("Maxthon") ? "Maxthon" : -1 != a.indexOf("MSIE") ? "MSIE" : -1 != a.indexOf("Firefox") ? "Firefox" : -1 != a.indexOf("Chrome") ? "Chrome" : -1 != a.indexOf("Opera") ? "Opera" : -1 != a.indexOf("Safari") ? "Safari" : window.ActiveXObject || "ActiveXObject" in window ? "msie11" : "unkonw"
}

function getBrowerLanguage() {
	var a = navigator.browserLanguage;
	return null != a && 0 < a.length ? a : ""
}

function getPlatform() {
	return navigator.platform
}

function getPageTitle() {
	return document.title
}

function createSubmitForm() {
	var a = document.createElement("form");
	document.body.appendChild(a);
	a.method = "POST";
	return a
}

function createFormElement(a, c, d) {
	var b = document.createElement("input");
	b.setAttribute("id", c);
	b.setAttribute("name", c);
	b.setAttribute("type", "hidden");
	b.setAttribute("value", d);
	a.appendChild(b);
	return b
}

function createXMLHttpRequest() {
	window.ActiveXObject ? xmlHttp = new ActiveXObject("Microsoft.XMLHTTP") : window.XMLHttpRequest && (xmlHttp = new XMLHttpRequest)
}

function AjaxPost(a, c, d) {
	var b = createHttpRequest();
	b ? (b.open("POST", a, !0), b.setRequestHeader("content-length", c.length), b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), b.send(c), b.onreadystatechange = function() {
		if (4 == b.readyState) try {
			200 == b.status && d && d(b.responseText)
		} catch (a) {
			alert("Error XMLHttpRequest!")
		}
	}) : alert("Error initializing XMLHttpRequest!")
}

function GetLocalIPAddress() {
	var a = null,
		c = "";
	try {
		a = new ActiveXObject("rcbdyctl.Setting"), c = a.GetIPAddress
	} catch (d) {
		alert("ErrInfoIS:" + d)
	}
	return c
}

function GetQueryString(a) {
	a = new RegExp("(^|&)" + a + "=([^&]*)(&|$)");
	a = window.location.search.substr(1).match(a);
	return null != a ? unescape(a[2]) : null
}

function getLoadTime() {
	return (new Date).getTime() - performance.timing.navigationStart
}

function flightHandler0(a) {
	var c = getStatId(),
		d = encodeURIComponent(getUA()),
		b = document.localName,
		f = encodeURIComponent(document.referrer),
		g = encodeURIComponent(document.URL),
		h = screen.width,
		k = screen.height,
		l = getPlatform(),
		m = getBrower(),
		e = GetQueryString("refer_url"),
		n = getBrowerLanguage(),
		p = encodeURIComponent(getPageTitle()),
		q = ("https:" == document.location.protocol ? " https://" : " http://") + count_domain,
		e = null != f ? f : encodeURIComponent(e);
	a = q + "?" + ("cookieId=" + c + "&ua=" + d + "&ip=" + b + "&refurl=" + e + "&url=" + g + "&screenX=" +
		h + "&screenY=" + k + "&os=" + l + "&brower=" + m + "&browerLang=" + n + "&title=" + p + "&loadtime=" + a);
	c = document.createElement("script");
	c.setAttribute("src", a);
	document.getElementsByTagName("head")[0].appendChild(c)
}
if(window.addEventListener){
	window.attachEvent("load", function(a) {
		a = getLoadTime();
		flightHandler0(a)
	});
}else{
	window.addEventListener("load", function(a) {
		a = getLoadTime();
		flightHandler0(a)
	});
}