angular.module("maze", []);

angular.module("maze").controller("mazeController", function($scope, $interval, $timeout){
	function createArray(arrLength){
		var arrTemp = new Array(arrLength || 0);
		if(arguments.length > 1){
			var argsList = Array.prototype.slice.call(arguments, 1);
			for(var i=0; i<arrLength; i++){
				arrTemp[i] = createArray.apply(this, argsList);
			}
		}
		return arrTemp;
	}

	function getRandom(min, max){
		return Math.floor(Math.random()*(max-min+1))+min;
	}
	

	// Global Variables
	$scope.mazeSize = 35;
	$scope.playBall = "<div class='ball'>&nbsp;</div>";
	$scope.ballPos = [1, 2];
	var arrMaze = new Array($scope.mazeSize);
	var cN = [[0,0],[0,0],[0,0],[0,0]];
	var X, Y, TX, TY;
	var randomDir, intDone = 0;
	
	function createMaze(){
		for(var i=0;i<=$scope.mazeSize*$scope.mazeSize;++i){
			arrMaze[i]=new Array($scope.mazeSize);
		}
	}

	function initMaze(){
		for(X=1;X<=$scope.mazeSize;++X){
			for(Y=1;Y<=$scope.mazeSize;++Y){
				arrMaze[X][Y]=0;
			}
		}
	}

	function generateMaze(){
		console.log(Date.now())
		do{
			X=2+Math.floor(Math.random()*($scope.mazeSize-1));
			if(X%2!=0) --X;
			Y=2+Math.floor(Math.random()*($scope.mazeSize-1));
			if(Y%2!=0) --Y;
			if(intDone==0) arrMaze[X][Y]=1;
			if(arrMaze[X][Y]==1){
				randomDir=Math.floor(Math.random()*4)
				if(randomDir==0){
					cN=[[-1,0],[1,0],[0,-1],[0,1]];
				}else if(randomDir==1){
					cN=[[0,1],[0,-1],[1,0],[-1,0]];
				}else if(randomDir==2){
					cN=[[0,-1],[0,1],[-1,0],[1,0]];
				}else if(randomDir==3){
					cN=[[1,0],[-1,0],[0,1],[0,-1]];
				}
				blnBlocked=1;
				do{
					blnBlocked++;
					for(var intDir=0;intDir<=3;++intDir){
						TX=X+cN[intDir][0]*2;
						TY=Y+cN[intDir][1]*2;
						if (TX<$scope.mazeSize && TY<$scope.mazeSize && TX>1 && TY>1){
							if (arrMaze[TX][TY]!=1){
								arrMaze[TX][TY]=1;
								arrMaze[X][Y]=1
								arrMaze[X+cN[intDir][0]][Y+cN[intDir][1]]=1;
								X=TX;
								Y=TY;
								blnBlocked=0;
								intDone++;
								intDir=4
							}
						}
					}
				}while(blnBlocked==1)
			}
		}while(intDone+1<(($scope.mazeSize-1)*($scope.mazeSize-1))/4)
		arrMaze[1][2] = 1;
		arrMaze[$scope.mazeSize][$scope.mazeSize - 1] = 1;
		
		arrMaze[$scope.ballPos[0]][$scope.ballPos[1]] = 2;
		console.log(Date.now())
		
		$scope.maze = angular.copy(arrMaze);
	}
	
	$scope.getKeys = function(event){
		//event.preventDefault();
		var tempDirection;
		if(event.keyCode == 9){
			event.preventDefault();
			if($scope.gameOver || !$scope.moveStart)
				document.querySelectorAll(".difficulty")[0].focus();
		}
		if(!$scope.gameOver){
			if(event.keyCode == 27){
				if(!$scope.snakePaused && $scope.moveStart){
					$scope.moveStart = false;
					$interval.cancel($scope.autoMove);
					$interval.cancel($scope.feedTimer);
					$scope.snakePaused = true;
					if($scope.board_temp == null)
						$scope.board_temp = angular.copy($scope.board);
					$scope.setPaused();
				}
			}else if(event.keyCode >= 37 && event.keyCode <= 40){
				if(!$scope.moveStart){
					if($scope.board_temp != null)
						$scope.board = angular.copy($scope.board_temp)
					$scope.board_temp = null;
					$scope.moveStart = true;
					$scope.autoMove = $interval($scope.moveSnake, $scope.snakeSpeed);
					if($scope.feedLifeTimer == null)
						$scope.feedTimer = $interval($scope.showFeed, $scope.feedSpeed);
					else if($scope.feedLifeTimer.$$state.status != 0)
						$scope.feedTimer = $interval($scope.showFeed, $scope.feedSpeed);
					$scope.snakePaused = false;
				}

				tempDirection = event.keyCode - 37;
				if(tempDirection != $scope.lastDirection){
					// Check if the direction is the opposite of the move direction. Can't move like that
					if(Math.abs(tempDirection - $scope.lastDirection) == 2){
						return;
					}else{
						$scope.currentDirection = tempDirection;
					}
				}else{
					return;
				}
				$scope.moveDirection = $scope.directions[$scope.currentDirection];
				/*
				switch($scope.currentDirection){
					case 0:
						$scope.moveDirection = [0, -1];
						break;
					case 1:
						$scope.moveDirection = [-1, 0];
						break;
					case 2:
						$scope.moveDirection = [0, 1];
						break;
					case 3:
						$scope.moveDirection = [1, 0];
						break;
				}
				*/
				$scope.moveSnake();
			}
		}else{
			if(event.keyCode == 32){
				$scope.initBoard();
			}
		}
	}
	
	$scope.initBoard = function(){
		createMaze();
		initMaze();
		generateMaze();
		//drawMaze();
	}
	
	$scope.initBoard();
});