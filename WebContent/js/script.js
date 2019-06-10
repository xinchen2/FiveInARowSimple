var chess = document.getElementById('chess');
var ctx = chess.getContext("2d");
var chessBox = [];
for(var i=0;i<15;i++){
	chessBox[i] = [];
	for(var j=0;j<15;j++){
		chessBox[i][j] = 0;
	}
}
var me = true;
var img = new Image();
img.src = "../imgs/meishubao.png";
img.onload = function(){
	ctx.drawImage(img,(450-150)/2,(450-80)/2,160,80);
	drawChessBord();
}


function drawChessBord(){
	ctx.strokeStyle = "#BFBFBF";
	for(var i=0;i<15;i++){
	ctx.moveTo(15,15+i*30);
	ctx.lineTo(435,15+i*30);
	ctx.stroke();
	ctx.moveTo(15+i*30,15);
	ctx.lineTo(15+i*30,435);
	ctx.stroke();
	}
}

function drawChess(i,j,me){
	var gradient = ctx.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30,15+j*30,0);
	if(me){
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}
	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(i*30+15,j*30+15,13,0,2*Math.PI,false);
	ctx.closePath();
	ctx.fill();
}

var wins = [];
for(var i=0;i<15;i++){
	wins[i] = [];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}
var count = 0;
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=0;j<15;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j][count] = true;
		}
		count++;
	}
}

for(var i=14;i>3;i--){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i-k][j+k][count] = true;
		}
		count++;
	}
}

for(var i=14;i>3;i--){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i-k][j-k][count] = true;
		}
		count++;
	}
}
//alert(count);
var myWin = [];
var computerWin = [];
for(var i=0;i<count;i++){
	myWin[i] = 0;
	computerWin[i] = 0;
}

var over = false;
var overnum = -1;

chess.onclick = function oneStep(e){
	if(over){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBox[i][j] == 0){
		chessBox[i][j] = 1;
		drawChess(i,j,me);
		me = !me;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
			//	alert(myWin[k]);
				if(myWin[k] == 5){
					over = true;
					overnum = k;
					for(var m=0;m<15;m++){
						for(var n=0;n<15;n++){
							for(var p=0;p<count;p++){
								if(wins[m][n][overnum]){
									ctx.fillStyle = "red";
									ctx.beginPath();
									ctx.arc(m*30+15,n*30+15,13,0,2*Math.PI,false);
									ctx.closePath();
									ctx.fill();
								}
							}
						}
					}
					alert(" 你赢了");
					return;
				}
			}
		}
		computerAI();
	}
}


function computerAI(){
	var myScores = [];
	var computerScores = [];
	for(var i=0;i<15;i++){
		myScores[i] = [];
		computerScores[i] = [];
		for(var j=0;j<15;j++){
			myScores[i][j] = 0;
			computerScores[i][j] = 0;
		}
	}
	var max = 0;
	var u = 0;
	var v = 0;
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBox[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k] == 1){
						myScores[i][j] += 200;
						}else if(myWin[k] == 2){
							myScores[i][j] += 400;
						}else if(myWin[k] == 3){
							myScores[i][j] += 2000;
						}else if(myWin[k] == 4){
							myScores[i][j] += 10000;
						}
					}
				}
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(computerWin[k] == 1){
							computerScores[i][j] += 220;
						}else if(computerWin[k] == 2){
							computerScores[i][j] += 420;
						}else if(computerWin[k] == 3){
							computerScores[i][j] += 2100;
						}else if(computerWin[k] == 4){
							computerScores[i][j] += 20000;
						}
					}
				}
				if(myScores[i][j]>max){
					max = myScores[i][j];
					u = i;
					v = j;
				}else if(myScores[i][j] == max){
					if(computerScores[u][v] < computerScores[i][j]){
			//			max = computerScores[i][j];
						u = i;
						v = j;
					}
				}
				if(computerScores[i][j]>max){
					max = computerScores[i][j];
					u = i;
					v = j;
				}else if(computerScores[i][j] == max){
					if(myScores[u][v] < myScores[i][j]){
			//			alert(myScores[u][v]+" "+myScores[i][j])
			//			max = myScores[i][j];
						u = i;
						v = j;
					}
				}
			}
		}
	}
//	alert(max);
	chessBox[u][v] = 2;
	drawChess(u,v,me);
	me = !me;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] == 5){
				over = true;
				overnum = k;
				for(var m=0;m<15;m++){
					for(var n=0;n<15;n++){
						for(var p=0;p<count;p++){
							if(wins[m][n][overnum]){
								ctx.fillStyle = "red";
								ctx.beginPath();
								ctx.arc(m*30+15,n*30+15,13,0,2*Math.PI,false);
								ctx.closePath();
								ctx.fill();
							}
						}
					}
				}
				alert("电脑赢了");
				return;
			}
		}
	}
}

