Game = function(par) {
	this.window_div = document.createElement("div");
	this.window_div.style.height = window.innerHeight;
	this.window_div.style.width = window.innerWidth;
	this.window_div.style.backgroundColor = "red";
	
	console.log(window)
	
	par.appendChild(this.window_div);
	return this;
}