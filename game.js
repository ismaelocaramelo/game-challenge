const patterns_1      = [[(/ OO....../),0],[(/O..O.. ../),6], [(/......OO /),8],[(/.. ..O..O/),2], [(/ ..O..O../),0],[(/...... OO/),6], [(/..O..O.. /),8],[(/OO ....../),2], [(/ ...O...O/),0],[(/..O.O. ../),6], [(/O...O... /),8],[(/.. .O.O../),2], [(/O O....../),1],[(/O.. ..O../),3], [(/......O O/),7],[(/..O.. ..O/),5], [(/. ..O..O./),1],[(/... OO.../),3], [(/.O..O.. ./),7],[(/...OO .../),5]]
const patterns_2      = [[(/  X . X  /),1],[(/ XX....../),0],[(/X..X.. ../),6], [(/......XX /),8],[(/.. ..X..X/),2],[(/ ..X..X../),0], [(/...... XX/),6],[(/..X..X.. /),8],[(/XX ....../),2], [(/ ...X...X/),0],[(/..X.X. ../),6],[(/X...X... /),8], [(/.. .X.X../),2],[(/X X....../),1],[(/X.. ..X../),3], [(/......X X/),7],[(/..X.. ..X/),5],[(/. ..X..X./),1], [(/... XX.../),3],[(/.X..X.. ./),7],[(/...XX .../),5], [(/ X X.. ../),0],[(/ ..X.. X /),6],[(/.. ..X X /),8], [(/ X ..X.. /),2],[(/  XX.. ../),0],[(/X.. .. X /),6], [(/.. .XX   /),8],[(/X  ..X.. /),2],[(/ X  ..X../),0], [(/ ..X..  X/),6],[(/..X..  X /),8],[(/X  ..X.. /),2]]
const patterns_3      = [[(/OOO....../),'O'], [(/...OOO.../),'O'], [(/......OOO/),'O'], [(/O..O..O../),'O'], [(/.O..O..O./),'O'], [(/..O..O..O/),'O'], [(/O...O...O/),'O'], [(/..O.O.O../),'O'], [(/XXX....../),'X'], [(/...XXX.../),'X'], [(/......XXX/),'X'], [(/X..X..X../),'X'], [(/.X..X..X./),'X'], [(/..X..X..X/),'X'], [(/X...X...X/),'X'], [(/..X.X.X../),'X']]
const board           = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let X                 = 'X';
let O                 = 'O';
let curr_turn         =  X;

const levelDifficulty = ["Easy", "Medium", "Hard"];
const typeOfGame      = ['Computer vs Computer', 'Human vs Human', 'Computer vs Human'];
const colors          = ["\x1b[32m", "\x1b[33m", "\x1b[31m", "\x1b[0m"]; //
const levels          = [3,2,1];

let gameLevel         = '';
let userChose         = '';
let board_string      = board.join('');

const setPatternLevel = levels[gameLevel - 1];

chooseLetter= function(){
  console.log("Select the first letter to play: ");

	process.openStdin().once('data', function(res) {
    clearScreen();
		if (res.toString().trim().length !== 1) {
			clearScreen();
			console.log(`The character introduced is not valid`);
			return chooseLetter();
		} else{
		    X = res.toString().trim();
        console.log("Select the second letter to play: ");
        process.openStdin().once('data', function(res) {
          clearScreen();
      		if (res.toString().trim().length !== 1) {
      			clearScreen();
      			console.log(`The character introduced is not valid`);
      			return chooseLetter();
      		} else{
            O = res.toString().trim();
            chooseFirstPlayer();
      	   }
        });
	   }
  });
}

chooseFirstPlayer= function(){
  console.log("Please choose the first player: ");
	console.log(colors[0]+ "\t1 - ", X);
	console.log(colors[1] +"\t2 - ", O);

	process.openStdin().once('data', function(res) {
    clearScreen();
		if (!isValidNumber(res, 1, 2)) {
			clearScreen();
			console.log(`The character introduced is not valid`);
			return chooseFirstPlayer();
		} else{
	    curr_turn = (parseInt(res.toString()) === 1)? X : O;
      play();
	   }
  });
}



gameChosen = function(){
	console.log("What kind of game do you want to play: ");
	console.log(colors[0]+ "\t1 - ", typeOfGame[0]);
	console.log(colors[1] +"\t2 - ", typeOfGame[1]);
	console.log(colors[2] +"\t3 - ", typeOfGame[2]+ colors[3]);
  process.openStdin().once('data', function(res) {
    clearScreen();

		if (!isValidNumber(res, 1, 3)){
			clearScreen();
			console.log(`The character introduced is not valid`);
			return gameChosen();
		}else {
      userChose = parseInt(res.toString());
      console.log("You has choosen " + typeOfGame[userChose - 1]);
      if(userChose === 1){
        playBots();
      }else if(userChose === 3){
        levelChosen();
      }else{
        chooseLetter();
      }
    }
  });
}

levelChosen = function() {
	console.log("Please introduce a level of difficulty: ");
	console.log(colors[0]+ "\t1 - ", levelDifficulty[0]);
	console.log(colors[1] +"\t2 - ", levelDifficulty[1]);
	console.log(colors[2] +"\t3 - ", levelDifficulty[2]+ colors[3]);

	process.openStdin().once('data', function(res) {
    clearScreen();

		if (!isValidNumber(res, 1, 3)) {
			clearScreen();
			console.log(`The character introduced is not valid`);
			return levelChosen();
		} else{
		    gameLevel = parseInt(res.toString());
        console.log("You has choosen " + levelDifficulty[gameLevel - 1] + " level")
        play();
	   }
  });
}

clearScreen= function(){
  process.stdout.write('\033c');
}

isValidNumber = function(numberEntered, minValidNumber, maxValidNumber) {
	let strEntered = numberEntered.toString().replace('\n', '');
	let validNumber = parseInt(strEntered);

	if (isNaN(validNumber)) {
		return false;
	} else if (validNumber < minValidNumber || validNumber > maxValidNumber) {
		return false;
	}

	return true;
}


comp = function() {
  x = get_pattern_1_move()
  if (x == -1) {
  	x = get_pattern_2_move()
  	if (x == -1) {
  		x = get_move()
  	}
  }
  move(x, curr_turn)
}

move = function(pos, x) {
	if (x != curr_turn) {
		return false
	}
	if (+pos >= 0 && +pos <= 8 && !isNaN(+pos) && board[+pos] == ' ') {
		board.splice(+pos, 1, x)
		curr_turn = (x == X) ? O : X
		return true
	}
	return false
}

show = function() {
  let tmpGame = gameLevel || 1;
  let board_display = colors[tmpGame -1]+'\t\t\t\t0  ' + colors[3]+board[0] + colors[tmpGame -1]+ '   |1  ' + colors[3]+board[1]+colors[tmpGame -1] + '   |2  ' + colors[3]+board[2]+ colors[tmpGame -1] + '\n\t\t\t\t=======+=======+=======\n\t\t\t\t3  ' + colors[3]+board[3]+colors[tmpGame -1] + '   |4  ' + colors[3]+board[4]+colors[tmpGame -1] + '   |5  ' + colors[3]+board[5]+colors[tmpGame -1] + '\n\t\t\t\t=======+=======+=======\n\t\t\t\t6  ' + colors[3]+board[6]+colors[tmpGame -1] + '   |7  ' + colors[3]+board[7]+colors[tmpGame -1] + '   |8  ' + colors[3]+board[8];
	console.log(board_display)
}

board_filled = function() {
	x = get_move()
	if (x == -1) {
		show()
		console.log('There is no availables cells. Game over');
		return true
	}
	return false
}

winner = function() {
  the_winner= null;
  for(i=0;i<patterns_3.length;i++){
    array= board_string.match(patterns_3[i][0])
    if(array){the_winner= patterns_3[i][1]}
  }
  if(the_winner){
    show();
    (curr_turn === 'X')? console.log("O wins") : console.log("X wins");
    return true;
  }
  return false;
}

get_pattern_1_move = function() {
	for (i = 0; i < patterns_1.length; i++) {
		array = board_string.match(patterns_1[i][0])
		if (array) {
			return patterns_1[i][1];
		}
	}
	return -1;
}

get_pattern_2_move = function() {
	for (i = 0; i < parseInt(patterns_2.length / setPatternLevel); i++) {
		array = board_string.match(patterns_2[i][0])
		if (array) {
			return patterns_2[i][1];
		}
	}
	return -1;
}

get_move = function() {
	if (board[4] == ' ') {
		return 4;
	}
	return board.indexOf(' ');
}

getRandomMove= function(){
  let x = 0;
  do{
    x = Math.floor(Math.random()*(9));
  }while(!move(x, curr_turn));
}

exit = function() {
  process.exit();
}

playBots= function(){
  do{
    getRandomMove();
  }while(!winner() && !board_filled());
  exit();
}

play = function() {

	show();
	console.log(curr_turn, "turn, enter a number [0,8]");
  process.openStdin().on('data', function(res) {

	  if (!isValidNumber(res, 0, 8)) {
	     clearScreen();
       console.log(`The character introduced is not valid`);;
       return play();
	  }

    clearScreen();

		if (move(res, curr_turn)) {
			if (winner() || board_filled()) {
				exit();
			} else {
        if(typeOfGame[2] === typeOfGame[userChose - 1]){
          comp();
  				if (winner() || board_filled()) {
  					exit();
  				} else {
  					show();
            console.log(curr_turn, "turn, enter a number [0,8]");
  				}
        }else{
          clearScreen();
          show();
          console.log(curr_turn, "turn, enter a number [0,8]");
        }
			}
		}else{
      show();
      console.log("The cell is unavailable, please do enter another cell number [0-8]: ");
    }
	});
}


gameChosen();
