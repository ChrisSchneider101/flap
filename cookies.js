function getCookie(coo) {
	var match = coo + "=";											//match this in cookie string
	var decoded_cookies = decodeURIComponent(document.cookie);		//apparently helps special characters
	var cookies_array = decoded_cookies.split(";");					//cookies now in an array format
	for (let i = 0; i < cookies_array.length; i++) {
		var cookie = cookies_array[i];
		while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);//get rid of whitespace in front of cookie
		if (cookie.indexOf(match) == 0)								//if the cookie is the one searched for
			return cookie.substring(match.length, cookie.length);	//get value part of the pair
	}
	return "";														//return empty string if not found
}

function setCookie(coo, val) { document.cookie = coo + "=" + val + ";  expires=Thu, 31 Dec 2099 12:00:00 UTC; path=/"; }

function clearCookie(coo) { document.cookie = coo + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; }

function clearAllCookies() {
	var decoded_cookies = decodeURIComponent(document.cookie);
	var cookies_array = decoded_cookies.split(";");
	for (let i = 0; i < cookies_array.length; i++) {
		var cookie = cookies_array[i];
		while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);
		var pairsplit = cookie.indexOf("=");
		clearCookie(cookie.substring(0, pairsplit));
		//document.cookie = cookie.substring(0, pairsplit+1) + ";";
	}
}

function printCookies() { console.log(document.cookie); }