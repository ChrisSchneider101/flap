PipePair = function(par, width, gap, y_position) {
	this.pipe_width = width; //192
	this.pipe_gap = gap; //480
	this.pipe_y_offset = y_position; //45
	this.pipe_x_offset = window.innerWidth;
	this.pipe_exact_x = window.innerWidth; //can be a decimal
	
	this.min_y_offset = 0
	this.max_y_offset = window.innerHeight - this.pipe_gap;
	
	this.top_div = document.createElement("div");	//div
	this.bottom_div = document.createElement("div");//div
	this.container = document.createElement("div");	//div
	
	this.top_div.style.backgroundColor = "rgb(100, 200, 100)";
	this.top_div.style.position = "absolute";
	this.top_div.style.height = this.pipe_y_offset;
	this.top_div.style.width = this.pipe_width;
	this.top_div.style.top = 0;
	this.top_div.style.left = 0;
	this.top_div.style.touchAction = "none";
	
	this.bottom_div.style.backgroundColor = "rgb(100, 200, 100)";
	this.bottom_div.style.position = "absolute";
	this.bottom_div.style.height = window.innerHeight - (this.pipe_y_offset + this.pipe_gap);
	this.bottom_div.style.width = this.pipe_width;
	this.bottom_div.style.top = this.pipe_y_offset + this.pipe_gap;
	this.bottom_div.style.left = 0;
	this.bottom_div.style.touchAction = "none";
	
	this.container.style.backgroundColor = "rgb(255, 200, 200)";
	this.container.style.position = "absolute";
	this.container.style.top = 0;
	this.container.style.left = this.pipe_x_offset; // spawn just offscreen
	this.container.style.height = window.innerHeight;
	this.container.style.width = this.pipe_width;
	this.container.style.touchAction = "none";
	
	// takes integers
	this.setPipeX = function(x) {
		this.pipe_x_offset = x;
		this.container.style.left = x;
	}
	
	// takes decimals
	this.moveX = function(x) {
		this.pipe_exact_x += x;
		this.setPipeX(Math.round(this.pipe_exact_x))
	}
	
	this.container.appendChild(this.top_div);
	this.container.appendChild(this.bottom_div);
	par.appendChild(this.container);
	return this;
}
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
Game = function(par) {
	this.bird_size = 96; //96
	this.bird_x_offset_scale = .25; // .3
	this.bird_gravity_acl = .15; // .2
	this.bird_terminal_vel = 10;
	this.bird_jump_vel = -9;
	
	this.pipe_width = this.bird_size * 2;
	this.pipe_spawn_delay = 750; // 750 // 200
	this.pipe_initial_gap = this.bird_size * 5; //this.bird_size * 5 // 45
	this.pipe_initial_vel = -2; //can be a decimal; -2
	
	// window div initialization
	this.window_div = document.createElement("div");
	this.window_div.style.height = window.innerHeight;
	this.window_div.style.width = window.innerWidth;
	this.window_div.style.backgroundColor = "red";
	this.window_div.style.position = "absolute";
	this.window_div.style.left = 0;
	this.window_div.style.top = 0;
	this.window_div.style.overflow = "hidden";
	
	// mobile div initialization
	this.mobile_div = document.createElement("div");
	//this.mobile_div.style.height = 50;
	this.mobile_div.style.width = 120;
	this.mobile_div.style.backgroundColor = "white";
	this.mobile_div.style.position = "absolute";
	this.mobile;
	if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1))
		this.mobile = true;
	else this.mobile = false;
	if (this.mobile) this.mobile_div.innerHTML = "MOBILE";
	else this.mobile_div.innerHTML = "DESKTOP";
	this.mobile_div.innerHTML += "<br>v5<br>oh my god what have i dont to the scale<br>trying div prop";
	this.window_div.appendChild(this.mobile_div);
	
	// pipe initalization
	this.pipes = new Array();
	
	this.spawnPipe = function(gap, y_position) {
		var pipe = new PipePair(this.window_div, this.pipe_width, gap, y_position);
		this.pipes.push(pipe);
	}
	
	// ceiling
	this.window_min_y = 0;
	// floor
	this.window_max_y = window.innerHeight - this.bird_size;
	
	// bird div initialization
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
	this.getBirdVel = function() { return Math.round(this.bird_vel); }
	
	// some initial values here too, but change
	this.pipe_vel = this.pipe_initial_vel;
	this.pipe_gap = this.pipe_initial_gap
	this.pipe_spawn_counter = 0; // count up to this.pipe_spawn_delay
	
	//this.getPipeVel = function() { return Math.round(this.pipe_vel); }
	
	
	this.interval = setInterval(function() {
		// gravity
		this.bird_vel += this.bird_gravity_acl;
		if (this.bird_vel > this.bird_terminal_vel) this.bird_vel = this.bird_terminal_vel;
		this.setBirdY(this.bird_y + this.bird_vel);
		if (this.bird_y > this.window_max_y) {
			this.setBirdY(this.window_max_y);
			this.bird_vel = 0;
		}
		
		// pipe spawning
		this.pipe_spawn_counter++;
		if (this.pipe_spawn_counter > this.pipe_spawn_delay) {
			var rand_offset = Math.random() * (window.innerHeight - this.pipe_gap)
			this.spawnPipe(this.pipe_gap, rand_offset);
			this.pipe_spawn_counter = 0;
		}
		
		// pipe movement and despawning
		for (let i = 0; i < this.pipes.length; i++) {
			//this.pipes[i].setPipeX(this.pipes[i].pipe_x_offset + this.pipe_vel);
			this.pipes[i].moveX(this.pipe_vel);
			if (this.pipes[i].pipe_x_offset < -1 * this.pipe_width) {
				this.pipes.splice(i, 1);	//delete from array
				i--;						//prevent element skipping
				console.log("deleted pipe");
			}
		}
		
		
		
	}.bind(this), 5);
	
	par.appendChild(this.window_div);
	this.window_div.appendChild(this.bird_div);
	return this;
}

