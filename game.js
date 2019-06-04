Game = function(par) {
	this.bird_size = 200; //96
	this.bird_x_offset_scale = .3;
	this.bird_gravity_acl = .5;
	this.bird_terminal_vel = 7;
	this.bird_jump_vel = -7;
	
	
	this.window_div = document.createElement("div");
	this.window_div.style.height = window.innerHeight;
	this.window_div.style.width = window.innerWidth;
	this.window_div.style.backgroundColor = "red";
	this.window_div.style.position = "absolute";
	this.window_div.style.left = 0;
	this.window_div.style.top = 0;
	
	this.mobile_div = document.createElement("div");
	this.mobile_div.style.height = 50;
	this.mobile_div.style.width = 120;
	this.mobile_div.style.backgroundColor = "white";
	this.mobile;
	if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1))
		this.mobile = true;
	else this.mobile = false;
	if (this.mobile) this.mobile_div.innerHTML = "MOBILE";
	else this.mobile_div.innerHTML = "DESKTOP";
	this.window_div.appendChild(this.mobile_div);
	
	
	
	// ceiling
	this.window_min_y = 0;
	
	// floor
	this.window_max_y = window.innerHeight - this.bird_size;
	
	this.bird_div = document.createElement("div");
	this.bird_div.style.height = this.bird_size;
	this.bird_div.style.width = this.bird_size;
	this.bird_div.style.backgroundColor = "green"; //blue
	this.bird_div.style.position = "absolute";
	this.bird_div.style.left = window.innerWidth * this.bird_x_offset_scale;
	
	this.bird_x = window.innerWidth * this.bird_x_offset_scale;
	this.bird_y;
	
	// only change bird_y through this
	this.setBirdY = function(y) {
		this.bird_y = y;
		this.bird_div.style.top = y;
	}
	
	this.birdMinX = function() { return this.bird_x; }
	this.birdMaxX = function() { return this.bird_x + this.bird_size; }
	this.birdMinY = function() { return this.bird_y; }
	this.birdMaxY = function() { return this.bird_y + this.bird_size; }
	
	this.click_detected = function() {
		console.log("click");
		if (!this.mobile) this.tap();
	}
	this.touch_detected = function() {
		console.log("touch");
		if (this.mobile) this.tap();
	}
	
	this.tap = function() {
		this.bird_vel = this.bird_jump_vel;
		console.log("hit");
	}
	
	this.bird_vel = 0;	//can be a decimal
	
	this.getBirdVel = function() { return Math.round(this.bird_velocity); }
	
	this.gravity_interval = setInterval(function() {
		this.bird_vel += this.bird_gravity_acl;
		if (this.bird_vel > this.bird_terminal_vel) this.bird_vel = this.bird_terminal_vel;
		this.setBirdY(this.bird_y + this.bird_vel);
		if (this.bird_y > this.window_max_y) {
			this.setBirdY(this.window_max_y);
			this.bird_vel = 0;
		}
	}.bind(this), 5);
	
	
	
	par.appendChild(this.window_div);
	this.window_div.appendChild(this.bird_div);
	return this;
}