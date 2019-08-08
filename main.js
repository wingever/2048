var board = new Array();//每个格子里的数字
var score = 0;//分数初始为零
var has_conflicted = new Array();//解决连续消除的标记
//移动端触摸屏幕时的起始坐标
var startx = 0;
var starty = 0;
//移动端触摸屏幕时的终点坐标
var endx = 0;
var endy = 0;

var success_string = 'Success';
var gameover_string = 'Faliure';

//HTML文档加载完成后，初始化棋盘
$(document).ready(function() {

	//自适应处理
	prepare_for_mobile();
	new_game();
});

function new_game() {
	//初始化棋盘
	init();
	//在随机两个格子生成数字
	generate_one_number();
	generate_one_number();
}
//初始化
function init() {
	//确定位置
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var grid_cell = $('#grid_cell_' + i + '_' + j);
			grid_cell.css('top', get_pos_top(i, j));
			grid_cell.css('left', get_pos_left(i, j));
		}
	}
	//确定数值
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		has_conflicted[i] = new Array();
		for (var j =0; j < 4; j++) {
			board[i][j] = 0;
			has_conflicted[i][j] = false;
		}
	}
	update_board_view();
	score = 0;
	update_score(score);
}

//更新棋局
function update_board_view() {
	$('.number_cell').remove();//移除被选元素
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid_container').append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
			var number_cell = $('#number_cell_' + i + '_' + j);
			if (board[i][j] == 0) {
				number_cell.css('width', '0px');
				number_cell.css('height', '0px');
				number_cell.css('top', get_pos_top(i, j) + cell_side_length / 2);
				number_cell.css('left', get_pos_left(i, j) + cell_side_length / 2);
			} else {
				number_cell.css('width', cell_side_length);
				number_cell.css('height', cell_side_length);
				number_cell.css('top', get_pos_top(i, j));
				number_cell.css('left', get_pos_left(i, j));
				number_cell.css('background-color', get_number_background_color(board[i][j]));
				number_cell.css('color', get_number_color(board[i][j]));
				number_cell.text(board[i][j]);
			}
			has_conflicted[i][j] = false;
		}
	}
	$('.number_cell').css('line-height', cell_side_length + 'px');
	$('.number_cell').css('font-size', 0.6 * cell_side_length + 'px');
}


//随机在一个格子里生成数字
function generate_one_number() {
	//如果已经格子已经填满，直接返回false
	if (nospace(board)) {
		return false;
	}
	//随机生成一个位置坐标
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	var time = 0;
	//
	while (time < 50) {
		if (board[randx][randy] == 0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
		time++;
	}
	if (time == 50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j] == 0) {
					randx = i;
					randy = j;
				}
			}
		}
	}
	//随机一个数字
	var rand_number = Math.random() < 0.5 ? 2 : 4;
	//在随机位置显示随机数字
	board[randx][randy] = rand_number;
	show_number_with_animation(randx, randy, rand_number);//出现这个随机生成数的动画
	return true;
}

$(document).keydown(function(event) {
	if ($('#score').text() == success_string) {
		new_game();
		return;
	}
	switch (event.keyCode) {
		case 37: //left
			event.preventDefault();//阻止默认行为，网页上下移动等
			if (move_left()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
			break;
		case 38: //up
			event.preventDefault();
			if (move_up()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
			break;
		case 39: //right
			event.preventDefault();
			if (move_right()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
			break;
		case 40: //down
			event.preventDefault();
			if (move_down()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
			break;
		default:
			break;
	}
});

//平台兼容
document.addEventListener('touchstart', function(event) {
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event) {
	event.preventDefault();
});

document.addEventListener('touchend', function(event) {
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;
	if (Math.abs(deltax) < 0.3 * document_width && Math.abs(deltay) < 0.3 * document_width) {
		return;
	}
	if ($('#score').text() == success_string) {
		new_game();
		return;
	}
	//x
	if (Math.abs(deltax) >= Math.abs(deltay)) {
		if (deltax > 0) {
			//move right
			if (move_right()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
		} else {
			//move left
			if (move_left()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
		}
	} else {	//y
		if (deltay > 0) {
			//move down
			if (move_down()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
		} else {
			//move up
			if (move_up()) {
				setTimeout('generate_one_number()', 210);
				setTimeout('is_gameover()', 300);
			}
		}
	}
});


//向左移动
function move_left() {
	if (!can_move_left(board)) {
		return false;
	}
	//可以移动时向左移动
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && no_block_horizontal(i, k, j, board)) {
						show_move_animation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					} else if (board[i][k] == board[i][j] && no_block_horizontal(i, k, j, board) && !has_conflicted[i][k]) {
						show_move_animation(i, j, i, k);
						board[i][k] += board[i][j]
						board[i][j] = 0;
						//add score
						score += board[i][k];
						update_score(score);
						has_conflicted[i][k] = true;
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()', 200);
	return true;
}

function move_right() {
	if (!can_move_right(board)) {
		return false;
	}
	//move right
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] == 0 && no_block_horizontal(i, j, k, board)) {
						show_move_animation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					} else if (board[i][k] == board[i][j] && no_block_horizontal(i, j, k, board) && !has_conflicted[i][k]) {
						show_move_animation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						update_score(score);
						has_conflicted[i][k] = true;
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()', 200);
	return true;
}

function move_up() {
	if (!can_move_up(board)) {
		return false;
	}
	//move up
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] == 0 && no_block_vertical(j, k, i, board)) {
						show_move_animation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						break;
					} else if (board[k][j] == board[i][j] && no_block_vertical(j, k, i, board) && !has_conflicted[k][j]) {
						show_move_animation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						update_score(score);
						has_conflicted[k][j] = true;
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()', 200);
	return true;
}

function move_down() {
	if (!can_move_down(board)) {
		return false;
	}
	//move down
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && no_block_vertical(j, i, k, board)) {
						show_move_animation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						break;
					} else if (board[k][j] == board[i][j] && no_block_vertical(j, i, k, board) && !has_conflicted[k][j]) {
						show_move_animation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						update_score(score);
						has_conflicted[k][j] = true;
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()', 200);
	return true;	
}

//游戏是否结束，棋盘上的数字全是2048则成功，否则直至数字填满格子且不能移动，游戏结束
function is_gameover() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] == 8192) {
				update_score(success_string);
				return;
			}
		}
	}
	if (nospace(board) && nomove(board)) {
		gameover();
	}
}

//游戏失败结束
function gameover() {
	update_score(gameover_string);
}

function prepare_for_mobile() {
	if (document_width > 500) {
		grid_container_width = 500;
		cell_side_length = 100;
		cell_space = 20;
	}
	$('#grid_container').css('width', grid_container_width - 2 * cell_space);
	$('#grid_container').css('height', grid_container_width - 2 * cell_space);
	$('#grid_container').css('padding', cell_space);
	$('#grid_container').css('border-radius', 0.02 * grid_container_width);
	$('.grid_cell').css('width', cell_side_length);
	$('.grid_cell').css('height', cell_side_length);
	$('.grid_cell').css('border-radius', 0.02 * grid_container_width);
}