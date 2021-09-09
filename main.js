
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
		this.speed_x = 0;
		this.speed_y = 3;
		this.board = board;
		board.ball = this;
		this.kind = "circle";
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
		this.clearScreen();
		this.drawBoard();
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
			bar1.up();
		}
		else if(event.keyCode == 83 )
		{
			bar1.down();
		}
		else if(event.keyCode == 38)
		{
			bar2.up();
		}
		else if(event.keyCode == 40)
		{
			bar2.down();
		}

		console.log("[1." + bar1 + "], [2." + bar2 + "]");

	});

controller();

