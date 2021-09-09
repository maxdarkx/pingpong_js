
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
		let elements = this.bars;
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
	}
	down()
	{

	}

	up()
	{

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
		if(element != null && element.hasOwnProperty("kind"))
		{
			switch (element.kind)
			{
				case "rectangle":
					context.fillRect(element.x, element.y, element.width, element.height)
					break;
				case "circle":
					context.fillRect(element.x, element.y, element.width, element.height)
					break;
			}
		}
	}
}

window.addEventListener("load", main);
function main()
{
	const widthBoard = 800;
	const heightBoard = 600;
	let canvas = document.getElementById('canvas');
	let board = new Board(widthBoard, heightBoard);
	let board_view = new BoardView(canvas,board);
	let bar1 = new Bar(20,250,40,100,board);
	let bar2 = new Bar(740,250,40,100,board);
	console.log(board);
	board_view.drawBoard();
}