var rightAnswer = 0;
var paused = false;
var right = "";
var category = false;
var difficulty = false;
var alreadyDone = [];
var pickedQ = false;
var amount = 50;
var rightWrong = [0, 0];
var seconds = 59;
var hundred = 99;

$(document).ready(function() {
	$(".answer1").val(1);
	$(".answer2").val(2);
	$(".answer3").val(3);
	$(".answer4").val(4);

	// On Click Events
	$(".buttonDif").on("click", function() {
		difficulty = this.value;
		
		$(".buttonDif").attr("style", "color: white;");
		$(this).attr("style", "color: lightblue;");
	});

	$(".buttonCat").on("click", function() {
		category = this.value;
		$(".buttonCat").attr("style", "color: white;");
		$(this).attr("style", "color: lightblue;");
	});	

	$(".ready").on("click", function() {
		if(category && difficulty) {
			setTimeout(function() {
				$(".wrapper").attr("style", "height: 100%;");
				$(".wrapper2").attr("style", "height: 0px;");
				seconds = 59;
				hundred = 9;
				paused = false;
				apiCall();
				time = setInterval(function(){
					if(!paused) {
						hundred --;
						if(hundred < 0) {
							hundred = 99;
							seconds -= 1;
						}
						if(seconds <= 0 && hundred <= 0) {
							paused = true;
							pause2();
						}
						if(hundred <= 9) {
							$(".timer").html(seconds + " : 0" + hundred);
						} else {
							$(".timer").html(seconds + " : " + hundred);
						}
					}
				}, 10);
			}, 500);
		}
	});

	$(".answer").on("click", function() {
		if(!paused) {
			if(parseInt($(this).val()) === rightAnswer) {
	    		$(this).html("<h1><span class='gotRight'>You got it Right!</span></h1>");
	    		$(".gotRight").attr("style", "color: lightblue;");
	    		rightWrong[0] += 1;
	    		document.getElementById("clap").play();
		    } else {
		    	$(this).html("<h1>Wrong!</h1>");
		    	rightWrong[1] += 1;
		    	document.getElementById("chirp").play();
		  		if(rightAnswer === 1) {
		  			$(".answer1").attr("style", "color: red;");
		  		}
		  		if(rightAnswer === 2) {
		  			$(".answer2").attr("style", "color: red;");
		  		}
		  		if(rightAnswer === 3) {
		  			$(".answer3").attr("style", "color: red;");
		  		}
		  		if(rightAnswer === 4) {
		  			$(".answer4").attr("style", "color: red;");
		  		}
		    }
		    paused = true;
		    pause1();
		}
	});
	$(".restart").on("click", function() {
		setTimeout(function() {
			$(".wrapper2").attr("style", "height: 100%;");
			$(".wrapper3").attr("style", "height: 0px;");
		}, 500);
	});

	// Functions
	function apiCall() {
		if(category === "any"){
			category = "";
		}
        var queryURL = "https://opentdb.com/api.php?amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=multiple";

        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
        	if(response.results.length !== 0) {
        		var answers = [1, 2, 3, 4];
				var temp = 0;
				var current = 3;

				do {
					var rand = Math.floor(Math.random() * 4);
				    temp = answers[current];
				    answers[current] = answers[rand];
				    answers[rand] = temp;
				    current --;
				} while (current !== 0);

				if(alreadyDone.length === 0 || alreadyDone.length >= response.results.length) {
					if(alreadyDone.length >= response.results.length) {
						alreadyDone = [];
					}
					pickedQ = Math.floor(Math.random() * response.results.length);
					alreadyDone.push(pickedQ);
					console.log(alreadyDone);
				} else {
					var goodToGo = false;
					do {
						pickedQ = Math.floor(Math.random() * response.results.length);
						if($.inArray(pickedQ, alreadyDone) === -1) {
							goodToGo = true;
							alreadyDone.push(pickedQ);
						}
					} while (!goodToGo);
				}

				var pickedArray = [];
				pickedArray.push(response.results[pickedQ].question);
				pickedArray.push(response.results[pickedQ].correct_answer);
		    	pickedArray.push(response.results[pickedQ].incorrect_answers[0]);
		    	pickedArray.push(response.results[pickedQ].incorrect_answers[1]);
		    	pickedArray.push(response.results[pickedQ].incorrect_answers[2]);

				rightAnswer = answers.indexOf(1) + 1;

				// Debugging purposes only
				right = pickedArray[answers[rightAnswer - 1]];

				$(".answer1").attr("style", "color: white;");
				$(".answer2").attr("style", "color: white;");
				$(".answer3").attr("style", "color: white;");
				$(".answer4").attr("style", "color: white;");
			
			    $(".question").html(pickedArray[0]);
				$(".answer1").html(pickedArray[answers[0]]);
				$(".answer2").html(pickedArray[answers[1]]);
				$(".answer3").html(pickedArray[answers[2]]);
				$(".answer4").html(pickedArray[answers[3]]);
		    	
        	} else {
        		if(amount <= 10) {
        			amount --;
        		} else {
        			amount -= 10;
        		}
        		console.log(amount);
        		apiCall();
        	}
        });
	}
	var restart = function() {
		if((rightWrong[0] - rightWrong[1]) > 0) {
			document.getElementById("applause").play();
		} else {
			document.getElementById("laugh").play();
		}
		alreadyDone = [];
		pickedQ = false;
		amount = 50;
		clearInterval(time);
		seconds = 59;
		hundred = 9;
		$(".question").html("");
		$(".answer").html("");
		setTimeout(function() {
			$(".wrapper3").attr("style", "height: 100%;");
			$(".wrapper").attr("style", "height: 0px;");
			$(".right").html(rightWrong[0]);
			$(".wrong").html(rightWrong[1]);
			$(".total").html(rightWrong[0] - rightWrong[1]);
			rightWrong = [0, 0];
		}, 500);
	}
	var time = setInterval(function(){
		if(!paused) {
			hundred --;
			if(hundred < 0) {
				hundred = 99;
				seconds -= 1;
			}
			if(seconds <= 0 && hundred <= 0) {
				paused = true;
				pause2();
			}
			if(hundred <= 9) {
				$(".timer").html(seconds + " : 0" + hundred);
			} else {
				$(".timer").html(seconds + " : " + hundred);
			}
		}
	}, 10);
	clearInterval(time);

	var pause1 = function() {
		setTimeout(function() {
			setTimeout(function() {
				paused = false;
			}, 100);
			apiCall();
		}, 900);
	}
	var pause2 = function() {
		setTimeout(function() {
			restart();
		}, 1000);
	}
});