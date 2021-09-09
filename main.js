
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
		this.initx = x;
		this.inity = y;
		this.width = width;
		this.height =height;
		this.board = board;
		this.board.bars.push(this);
		this.kind = "rectangle";
		this.speed = 10;
	}
	down()
	{
		if(this.y < 500)

		this.y += this.speed;
	}

	up()
	{
		if(this.y > 0)
		{
			this.y -= this.speed;
		}
	}

	toString()
	{
		let text = ("(x,y): (" + this.x + ", " + this.y + ")");
		return text;
	}

	reset()
	{
		this.x = this.initx;
		this.y = this.inity;
	}
	
}

class Ball
{
	constructor(x, y, radius, board)
	{
		this.x = x;
		this.y = y;
		this.initx = x;
		this.inity = y;
		this.radius = radius;
		this.speed_x = 5;
		this.speed_y = 0;
		this.speed = 5;

		this.direction_x = 1;
		this.direction_y = 1;
		this.board = board;
		board.ball = this;
		this.kind = "circle";
		this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI/12;
	}

	move() //si la pelota toca la parte superior o inferior, rebota mediante el else
	{
		if((this.y) > 10 && (this.y) < (this.board.height-10) )
		{
			this.x += this.speed_x * this.direction_x;
			this.y += this.speed_y * this.direction_y;
		}	
		else
		{
			this.direction_y = -this.direction_y;
			this.x += this.speed_x * this.direction_x;
			this.y += this.speed_y * this.direction_y;
		}
	}

	score() 							//si la pelota toca alguno de los extremos izquierdo o derecho,
	{ 									//se verifica quien anoto el punto
	
		var who = 0;
		
		if(this.x < 10)
		{
			this.x = 400;
			this.y = 300;
			who = 1;
		}
		else if (this.x > this.board.width-10)
		{	
			this.x = 400;
			this.y = 300;
			who = 2;
		}
		return who;
	}

	collision(bar) 					//reacciona a las colisiones con las barras
	{
		let relative_intersect_y = (bar.y + (bar.height/2)) - this.y;
		let normalized_intersect_y =relative_intersect_y / (bar.height/2);
		this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
		this.speed_y = this.speed * -Math.sin(this.bounce_angle);
		this.speed_x = this.speed *  Math.cos(this.bounce_angle);

		if(this.x > (this.board.width/2))
		{
			this.direction_x = -1;
		}
		else
		{
			this.direction_x = 1;
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
	
	toString()
	{
		var text = "x= "+this.x+" y="+this.y+" speed_x="+this.speed_x+
			" speed_y="+this.speed_y+" bounce_angle="+this.bounce_angle;
		return text;
	}

	reset() 			//resetea el juego despues de que algun jugador anota un punto.
	{					//La direccion a la que se dirigira la pelota se calcula al azar
	
		var choosedir = [-1,1];
		var shuffled = choosedir.sort(() => Math.random() - 0.5);
		this.initx = this.x;
		this.inity = this.y;
		this.direction_x = shuffled[0];
		this.direction_y = 1;
		this.bounce_angle = 0;
		this.speed_x=5;
		this.speed_y=0;
		
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
		this.score_1 = 0;
		this.score_2 = 0;
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
				context.fillStyle = "#FF0000";
				context.fillRect(element.x, element.y, element.width, element.height)
				break;
			case "circle":
				context.fillStyle = "#0000FF";
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
	
	play()						//se juega hasta que algun jugador anota (player_score > 0), se calcula quien				
	{							//anoto el punto, se modifica el marcador y se reanuda la partida
		let player_score = 0;
		if(this.board.playing)
		{
			this.clearScreen();
			this.drawBoard();
			this.checkColisions();
			player_score = this.board.ball.score();

			if(player_score == 0)
			{
				this.board.ball.move();
			}
			else if(player_score == 1)
			{
				this.score_1++;
				this.printScore();
				this.reset();
			}
			else if(player_score == 2)
			{
				this.score_2++;
				this.printScore();
				this.reset();
			}
			this.checkWin();

		}
	}

	printScore() 				//mensaje que muestra el marcador en el HTML
	{
		document.getElementById("score").innerHTML="<p'>Player 1: "+this.score_1
										+ "</p><p>Player 2: "+this.score_2+"</p>";
	}

	checkWin()					//Se verifica si algun jugador ha ganado la partida
	{							//de ser asi, se muestra un mensaje y se recarga la pagina
		if(this.score_1>=8)
		{
			this.board.playing = !this.board.playing;		
			document.getElementById("score").innerHTML="<p'>Player 1 WINS!</p>";
			setTimeout(function(){document.location.reload();},5000);
		
		}
		else if(this.score_2>=8)
		{
			this.board.playing = !this.board.playing;		
			document.getElementById("score").innerHTML="<p'>Player 2 WINS!</p>";
			setTimeout(function(){document.location.reload();},5000);
		}
	}

	reset()
	{
		this.board.playing = !this.board.playing;
		this.board.bars[0].reset();
		this.board.bars[1].reset();
		this.board.ball.reset();
		this.clearScreen();
		this.drawBoard();
		//console.log(ball.toString());
	}



	checkColisions()		//fisicas de verificacion de colisiones
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

	hit (a,b) 		//nos fijamos si a colisiona con b
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
document.getElementById("score").innerHTML="<p'>Player 1: "+board_view.score_1
										+ "</p><p>Player 2: "+board_view.score_2+"</p>";
				
document.addEventListener("keydown",function(event)		//controlador de ingreso de datos por teclado
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

		//console.log("[1." + bar1 + "], [2." + bar2 + "]");

	});
board_view.drawBoard();
controller();

