
class Board
{
	constructor(width, height)
	{
		this.width = width;
		this.height = height;
		this.playing = false;
		this.game_over = false;
		this.bars = [];
		this.ball = null;
	}
	get elements ()
	{
		let elements = this.bars.map(function(bar){return bar;});
		elements.push(this.ball);
		return elements;
	}
}

class Bar
{
	constructor(x,y,width,height,board)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height =height;
		this.board = board;
		this.board.bars.push(this);
		this.kind = "rectangle";
		this.speed = 10;
	}
	down()
	{
		this.y += this.speed;
	}

	up()
	{
		this.y -= this.speed;
	}

	toString()
	{
		let text = ("(x,y): (" + this.x + ", " + this.y + ")");
		return text;
	}
}

class Ball
{
	constructor(x, y, radius, board)
	{
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed_x = 3;
		this.speed_y = 0;
		this.speed = 3;
		this.direction = 1;
		this.board = board;
		board.ball = this;
		this.kind = "circle";
		this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI/12;
	}

	move()
	{
		this.x += this.speed_x * this.direction;
		this.y += this.speed_y;
	}

	collision(bar) //reacciona a las colisiones con las barras
	{
		var relative_intersect_y = (bar.y + (bar.height/2)) - this.y;
		var normalized_intersect_y =relative_intersect_y / (bar.height/2);
		this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
		this.speed_y = this.speed * -Math.sin(this.bounce_angle);
		this.speed_x = this.speed *  Math.cos(this.bounce_angle);

		if(this.x > (this.board.width/2))
		{
			this.direction = -1;
		}
		else
		{
			this.direction = 1;
		}
	}


	get width()
	{
		return this.radius*2;
	}
	get height()
	{
		return this.radius*2;	
	}
}

class BoardView
{
	constructor(canvas, board)
	{
		this.canvas = canvas;
		this.board = board;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.context = canvas.getContext("2d");
	}

	drawBoard()
	{
		for (var i = this.board.elements.length -1; i >= 0 ; i--)
		{
			var elementToDraw = this.board.elements[i];
			this.drawElement(this.context,elementToDraw);
		}

	}

	drawElement(context, element)
	{
		switch (element.kind)
		{
			case "rectangle":
				context.fillRect(element.x, element.y, element.width, element.height)
				break;
			case "circle":
				context.beginPath()
				context.arc(element.x, element.y, element.radius, 0, 7);
				context.fill();
				context.closePath();
				break;
		}
	}
	clearScreen()
	{
		this.context.clearRect(0, 0,this.board.width, this.board.height);
	}
	
	play()
	{
		if(this.board.playing)
		{
			this.clearScreen();
			this.drawBoard();
			this.checkColisions();
			this.board.ball.move();
		}
	}

	checkColisions()
	{
		for(var i = this.board.bars.length -1; i>=0; i--)
		{
			var bar = this.board.bars[i];
			if(this.hit(bar, this.board.ball))
			{
				this.board.ball.collision(bar);
			}
		}
	}

	hit (a,b) //nos fijamos si a colisiona con b
	{
		var hit = false;


		//colision horizontal
		if (b.x +b.width >= a.x && b.x <a.x + a.width)
		{
			//colision vertical
			if (b.y +b.height >= a.y && b.y <a.y + a.height)
			{
				hit = true;
			}

		}

		//colision de a con b
		if(b.x <= a.x && b.x + b.width >= a.x + a.width)
		{
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
			{
				hit = true;
			}
		}

		//colision de b con a
		if(a.x <= b.x && a.x + a.width >= b.x + b.width)
		{
			if(a.y <= b.y && a.y + a.height >= b.y + b.height)
			{
				hit = true;
			}
		}
		return hit;
	}
}

function controller()
{
	board_view.play();
	window.requestAnimationFrame(controller);
}


const widthBoard = 800;
const heightBoard = 600;
let canvas = document.getElementById('canvas');
let board = new Board(widthBoard, heightBoard);
let board_view = new BoardView(canvas,board);
let bar1 = new Bar(20,250,40,100,board);
let bar2 = new Bar(740,250,40,100,board);
let ball = new Ball(400, 300, 10, board);

document.addEventListener("keydown",function(event)
	{
		//teclas: arriba = 38, abajo = 40, w=87, s=83

		if(event.keyCode == 87)
		{
			event.preventDefault();
			bar1.up();
		}
		else if(event.keyCode == 83 )
		{
			event.preventDefault();
			bar1.down();
		}
		else if(event.keyCode == 38)
		{
			event.preventDefault();
			bar2.up();
		}
		else if(event.keyCode == 40)
		{
			event.preventDefault();
			bar2.down();
		}
		else if(event.keyCode == 32)
		{
			event.preventDefault();
			board.playing = !board.playing;
		}

		console.log("[1." + bar1 + "], [2." + bar2 + "]");

	});
board_view.drawBoard();
controller();

