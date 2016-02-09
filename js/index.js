'use strict';

Array.prototype.clear = function()
{
	while(this.length > 0) this.pop();
}

function Random(from, to)
{
	if(from === undefined) from = 0;
	if(to === undefined) to = 1;
	if(from > to) return 0;
	return ~~((Math.random() * (to - from)) + from);
}

var Settings = {
	Count : 100,
	MaxSize : 100,
	MinSize : 20,
	MaxVelocity : 5,
	MinVelocity : -5,
	BackgroundColor : "#000"
};

var Vector2D = function(x,y)
{
	this.X = x;
	this.Y = y;
}

Vector2D.prototype.Sum = function(vector2d)
{
	this.X += vector2d.X;
	this.Y += vector2d.Y;
}

var Randomizer = {
	X: function(){ return Random(0,window.innerWidth); },
	Y: function() { return Random(0,window.innerHeight); },
	Size : function() { return Random(Settings.MinSize,Settings.MaxSize); },
	Velocity : function() {
		return new Vector2D(Random(Settings.MinVelocity, Settings.MaxVelocity),Random(Settings.MinVelocity,Settings.MaxVelocity)); 
	},
	Color: function(){ return '#'+Math.random().toString(16).substr(-6); },
	Circle: function(){ return new Circle(Randomizer.X(),Randomizer.Y(),Randomizer.Size(),Randomizer.Velocity(),Randomizer.Color()); }
};

var Circles = [];
var Circle = function(x,y,size,velocity,color){
	this.X = x;
	this.Y = y;
	this.Size = size;
	this.Velocity = velocity;
	this.Color = color;
	this.Move = function(){
		var width = window.innerWidth, height = window.innerHeight;
		this.Velocity.Sum(Randomizer.Velocity(this.X,this.Y));
		this.X += this.Velocity.X;
		this.Y += this.Velocity.Y;
		if(this.Velocity.X < Settings.MinVelocity) this.Velocity.X = Settings.MinVelocity;
		if(this.Velocity.X > Settings.MaxVelocity) this.Velocity.X = Settings.MaxVelocity;
		if(this.Velocity.Y < Settings.MinVelocity) this.Velocity.Y = Settings.MinVelocity;
		if(this.Velocity.Y > Settings.MaxVelocity) this.Velocity.Y = Settings.MaxVelocity;
		if(this.X < this.Size || this.Y < this.Size || this.X > (width - this.Size) || this.Y > (height - this.Size))
		{
			if(this.X < 0 || this.X > (width - this.Size))
				this.Velocity.X = -this.Velocity.X; 
			if(this.Y < 0 || this.Y > (height - this.Size))
				this.Velocity.Y = -this.Velocity.Y;
		}
	};
}

var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
function PopulateCircles()
{
	Circles.clear();
	for(var i = 0;i < Settings.Count; i++)
		Circles.push(Randomizer.Circle());
}

function MoveCircles()
{
	Circles.forEach(function(element) {
		element.Move();
	}, this);
}

function DrawCircles()
{
	ctx.fillStyle = Settings.BackgroundColor;
	ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	Circles.forEach(function(element) {
		ctx.fillStyle = element.Color;
		ctx.beginPath();
		ctx.arc(element.X + element.Size,element.Y + element.Size, element.Size,0, 2 * Math.PI, false);
		ctx.fill();
	}, this);
}

function Draw()
{
	setTimeout(Draw,50);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	MoveCircles();
	DrawCircles();
}

PopulateCircles();
Draw();