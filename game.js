PipePair = function(par, width, gap, y_position) {
	this.pipe_width = width; //192
	this.pipe_gap = gap; //480
	this.pipe_y_offset = y_position; //45
	this.pipe_x_offset = window.innerWidth;
	this.pipe_exact_x = window.innerWidth; //can be a decimal
	
	this.min_y_offset = 0
	this.max_y_offset = window.innerHeight - this.pipe_gap;
	this.given_point = false;
	
	this.top_div = document.createElement("div");	//div
	this.bottom_div = document.createElement("div");//div
	this.container = document.createElement("div");	//div
	
	this.top_div.style.backgroundColor = "rgb(100, 200, 100)";
	this.top_div.style.position = "absolute";
	this.top_div.style.height = this.pipe_y_offset;
	this.top_div.style.width = this.pipe_width;
	this.top_div.style.top = 0;
	this.top_div.style.left = 0;
	this.top_div.addEventListener("click", event => {});
	
	this.bottom_div.style.backgroundColor = "rgb(100, 200, 100)";
	this.bottom_div.style.position = "absolute";
	this.bottom_div.style.height = window.innerHeight - (this.pipe_y_offset + this.pipe_gap);
	this.bottom_div.style.width = this.pipe_width;
	this.bottom_div.style.top = this.pipe_y_offset + this.pipe_gap;
	this.bottom_div.style.left = 0;
	this.bottom_div.addEventListener("click", event => {});
	
	//this.container.style.backgroundColor = "rgb(255, 200, 200)";
	this.container.style.position = "absolute";
	this.container.style.top = 0;
	this.container.style.left = this.pipe_x_offset; // spawn just offscreen
	this.container.style.height = window.innerHeight;
	this.container.style.width = this.pipe_width;
	this.container.addEventListener("click", event => {});
	
	this.pipeMinX = function() { return this.pipe_x_offset; }
	this.pipeMaxX = function() { return this.pipe_x_offset + this.pipe_width; }
	this.topPipeMaxY = function() { return this.pipe_y_offset; }
	this.bottomPipeMinY = function() { return this.pipe_y_offset + this.pipe_gap; }
	
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
	
	this.midX = function() { return (this.pipe_width / 2) + this.pipe_x_offset; }
	
	this.container.appendChild(this.top_div);
	this.container.appendChild(this.bottom_div);
	//par.appendChild(this.container);
	par.insertBefore(this.container, par.childNodes[0]);
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
	
	/*// mobile div initialization
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
	this.mobile_div.innerHTML += "<br>v6<br>i hate ios safari";
	this.window_div.appendChild(this.mobile_div);*/
	
	// pipe initalization
	//this.pipes = new Array();
	this.pipes = new Array();
	
	this.spawnPipe = function(gap, y_position) {
		var pipe = new PipePair(this.window_div, this.pipe_width, gap, y_position);
		this.pipes.push(pipe);
	}
	
	// ceiling
	this.window_min_y = 0;
	// floor
	this.window_max_y = window.innerHeight - this.bird_size;
	
	this.game_ready = false; // not true until setup is complete
	this.reset_ready = false; // not true until postgame display is complete
	if (getCookie("highscore") == "") setCookie("highscore", "0"); // for first timers
	
	// bird div initialization
	this.bird_div = document.createElement("div");
	this.bird_div.style.height = this.bird_size;
	this.bird_div.style.width = this.bird_size;
	this.bird_div.style.backgroundColor = "green"; //blue
	this.bird_div.style.position = "absolute";
	this.bird_div.style.left = window.innerWidth * this.bird_x_offset_scale;
	this.bird_div.style.top = 0;
	
	//this.bird_x = window.innerWidth * this.bird_x_offset_scale;
	this.bird_x;
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
	
	// score div initialization
	this.score_div = document.createElement("div");
	this.score_div_size = 64;
	this.score_div.style.height = this.score_div_size;
	this.score_div.style.width = this.score_div_size;
	this.score_div.style.left = (window.innerWidth / 2) - (this.score_div_size / 2);
	this.score_div.style.top = 40;
	this.score_div.style.position = "absolute";
	this.score_div.style.textAlign = "center";
	this.score_div.style.fontSize = 40;
	this.score_div.addEventListener("click", event => {});
	//this.score_div.style.backgroundColor = "blue";
	
	this.score;
	//this.score_div.innerHTML = this.score;
	
	this.incScore = function() {
		this.score++;
		this.score_div.innerHTML = this.score;
	}
	
	// cover div initialization
	this.cover_div = document.createElement("div");
	this.cover_div.style.height = window.innerHeight;
	this.cover_div.style.width = window.innerWidth;
	this.cover_div.style.backgroundColor = "black";
	this.cover_div.style.position = "absolute";
	this.cover_div.style.left = 0;
	this.cover_div.style.top = 0;
	this.cover_div.style.opacity = 1;
	this.cover_div.style.textAlign = "center";
	this.cover_div.style.fontSize = 40;
	this.cover_div.style.color = "white";
	this.cover_div.addEventListener("click", event => {});
	
	// post game display initialization
	this.postgame_div = document.createElement("div");
	this.postgame_div.style.height = window.innerHeight;
	this.postgame_div.style.width = window.innerWidth;
	//this.postgame_div.style.backgroundColor = "black";
	this.postgame_div.style.position = "absolute";
	this.postgame_div.style.left = 0;
	this.postgame_div.style.top = 0;
	this.postgame_div.style.visibility = "hidden";
	this.postgame_div.style.textAlign = "center";
	this.postgame_div.style.fontSize = 40;
	this.postgame_div.style.color = "white";
	
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
		if (this.game_ready) this.start();
		else if (this.reset_ready) this.setUp();
	}
	
	this.gameOver = function() {
		clearInterval(this.interval);
		console.log("game over.");
		
		this.cover_div.innerHTML = "";
		var opacity = 0;
		var cover_fade_in = setInterval(function() {
			opacity += .01;
			this.cover_div.style.opacity = opacity;
			if (opacity >= .65) callback.call(this);
		}.bind(this), 5);
		
		function callback() {
			console.log("fade in complete");
			clearInterval(cover_fade_in);
			var prev_best = parseInt(getCookie("highscore"));
			var best_score_s;
			if (this.score > prev_best) {
				best_score_s = '<span style="color:rgb(0,0,255)">' + this.score + '</span>';
				setCookie("highscore", this.score.toString());
			}
			else best_score_s = getCookie("highscore");
			var pgs = "<br><br><br>Final Score<br>" + this.score + 
				"<br><br>Best Score<br>" + best_score_s + "<br><br>Tap to reset";
			this.postgame_div.innerHTML = pgs;
			
			
			this.postgame_div.style.visibility = "visible";
			this.reset_ready = true;
		}
	}
	
	//this.bird_vel = 0;	//can be a decimal
	this.getBirdVel = function() { return Math.round(this.bird_vel); }
	
	// some initial values here too, but change
	//this.pipe_vel = this.pipe_initial_vel;
	//this.pipe_gap = this.pipe_initial_gap;
	//this.pipe_spawn_counter = 0; // count up to this.pipe_spawn_delay
	this.pipe_vel;
	this.pipe_gap;
	this.pipe_spawn_counter; // count up to this.pipe_spawn_delay
	
	//this.getPipeVel = function() { return Math.round(this.pipe_vel); }
	
	
	//this.interval = setInterval(function() {
	this.interval;
	this.advFrame = function() {
		// gravity
		this.bird_vel += this.bird_gravity_acl;
		if (this.bird_vel > this.bird_terminal_vel) this.bird_vel = this.bird_terminal_vel;
		this.setBirdY(this.bird_y + this.bird_vel);
		/*if (this.bird_y > this.window_max_y) {
			this.setBirdY(this.window_max_y);
			this.bird_vel = 0;
		}*/
		
		// floor/ceiling collision check
		if (this.bird_y > this.window_max_y || this.bird_y < this.window_min_y) {
			console.log("collision with bounds");
			this.gameOver();
		}
		
		// pipe spawning
		this.pipe_spawn_counter++;
		if (this.pipe_spawn_counter > this.pipe_spawn_delay) {
			var rand_offset = Math.random() * (window.innerHeight - this.pipe_gap)
			this.spawnPipe(this.pipe_gap, rand_offset);
			this.pipe_spawn_counter = 0;
			console.log(this.pipes.length);
		}
		
		// pipe movement, point check, and despawning
		for (let i = 0; i < this.pipes.length; i++) {
			//this.pipes[i].setPipeX(this.pipes[i].pipe_x_offset + this.pipe_vel);
			// move
			this.pipes[i].moveX(this.pipe_vel);
			// pipe collision check
			if ( (this.birdMinX() > this.pipes[i].pipeMinX() && this.birdMinX() < this.pipes[i].pipeMaxX()) ||
				 (this.birdMaxX() > this.pipes[i].pipeMinX() && this.birdMaxX() < this.pipes[i].pipeMaxX()) ) {
				if (this.birdMaxY() > this.pipes[i].bottomPipeMinY() || this.birdMinY() < this.pipes[i].topPipeMaxY()) {
					console.log("collision with pipe");
					this.gameOver();
				}
			}
			// point check
			if (!this.pipes[i].given_point) {
				if (this.bird_x >= this.pipes[i].midX()) {
					console.log("point!");
					this.pipes[i].given_point = true;
					this.incScore();
				}
			}
			// despawn check
			if (this.pipes[i].pipe_x_offset < -1 * this.pipe_width) {
				this.window_div.removeChild(this.pipes[i].container);
				this.pipes.splice(i, 1);	//delete from array
				i--;						//prevent element skipping
				console.log("deleted pipe");
				console.log(this.pipes.length);
			}
			
			//console.log(this.pipes.length);
		}
		
		
	}
	//}.bind(this), 5);
	
	this.start = function() {
		this.game_ready = false;
		this.cover_div.style.opacity = 0;
		this.interval = setInterval(this.advFrame.bind(this), 5);
	}
	
	this.setUp = function() {
		this.reset_ready = false;
		this.setBirdY(window.innerHeight / 2);
		this.bird_x = window.innerWidth * this.bird_x_offset_scale;
		this.bird_vel = 0;
		this.pipe_vel = this.pipe_initial_vel;
		this.pipe_gap = this.pipe_initial_gap;
		this.pipe_spawn_counter = 0;
		this.score = 0;
		this.score_div.innerHTML = this.score;
		//this.pipes = new Array();
		for (let i = 0; i < this.pipes.length; i++) this.window_div.removeChild(this.pipes[i].container);
		this.pipes.length = 0;
		this.postgame_div.style.visibility = "hidden";
		this.cover_div.innerHTML = "<br><br><br>Tap to Begin";
		this.cover_div.style.opacity = .35;
		this.game_ready = true;
	}
	
	this.setUp();
	
	//this.start();
	
	par.appendChild(this.window_div);
	this.window_div.appendChild(this.score_div);
	this.window_div.appendChild(this.bird_div);
	this.window_div.appendChild(this.cover_div);
	this.window_div.appendChild(this.postgame_div);
	return this;
}

