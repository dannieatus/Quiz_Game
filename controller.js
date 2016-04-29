$(document).ready(function () {
	
	var questionNumber=0;
	var questionBank=new Array();
	var questionLock=false;
	var numberOfQuestions;
	var score=0;
	var timeID;
	var timeoutID;
	var timeLeft;
	var questionJSON;
	var questionFileNum = $.cookie('question_sel');
	var questionFileNumYesterday = $.cookie('question_sel_yes');
	
	if (questionFileNum != null) {
		questionJSON = "question"+questionFileNum+".json";
	}else {
		while ((questionFileNum = parseInt(5*Math.random()+1)) == questionFileNumYesterday) ;
		questionJSON = "question"+questionFileNum+".json";
		$.cookie('question_sel_yes', questionFileNum);
		$.cookie('question_sel', questionFileNum, { expires: 1});
	}
    
    if (questionFileNum == 1){
        $("#questionfile").append("You Are Taking Math Quiz");
    }else if (questionFileNum == 2){
        $("#questionfile").append("You Are Taking Physics Quiz");
    }else if (questionFileNum == 3){
        $("#questionfile").append("You Are Taking President Quiz");
    }else if (questionFileNum == 4){
        $("#questionfile").append("You Are Taking Geography Quiz");
    }else if (questionFileNum == 5){
        $("#questionfile").append("You Are Taking Celebrity Facts Quiz");
    }
    
 	$.getJSON(questionJSON, function(data) {//questionJSON
		for(i=0;i<data.quizlist.length;i++){ 
			questionBank[i]=new Array;
			questionBank[i][0]=data.quizlist[i].question1;
			questionBank[i][1]=data.quizlist[i].question2;
			questionBank[i][2]=data.quizlist[i].option1;
			questionBank[i][3]=data.quizlist[i].option2;
			questionBank[i][4]=data.quizlist[i].option3;
		}
		shuffle(questionBank);
		numberOfQuestions=questionBank.length; 
		
		displayQuestion();
	})//gtjson
 
	function displayQuestion(){
		var rnd=Math.random()*3;
		rnd=Math.ceil(rnd);
	 	var q1;
	 	var q2;
	 	var q3;
		
		if(rnd==1){
			q1=questionBank[questionNumber][2];
			q2=questionBank[questionNumber][3];
			q3=questionBank[questionNumber][4];
		}
		if(rnd==2){
			q2=questionBank[questionNumber][2];
			q3=questionBank[questionNumber][3];
			q1=questionBank[questionNumber][4];
		}
		if(rnd==3){
			q3=questionBank[questionNumber][2];
			q1=questionBank[questionNumber][3];
			q2=questionBank[questionNumber][4];
		}
	
		$("#question").empty();
		$("#question").append(questionBank[questionNumber][0]);
		if (questionBank[questionNumber][1] == ""){
			$("#question").append('<p><input type=radio id="1" class="opt">A&#58;&#32;'+q1+'<br><input type=radio id="2" class="opt">B&#58;&#32;'+q2+'<br><input type=radio id="3" class="opt">C&#58;&#32;'+q3+'</p>');
		}else{
			$("#question").append('<input type=text length=40 id="input">');
			$("#question").append(questionBank[questionNumber][1]);
			$("#question").append('<br><input value=" next " type=button length=40 class="in">');
		}
		$("#stopdiv").empty();
        $("#stopdiv").append('<input value=" stop " type=button length=40 class="stop">');
		$("#correctcount").empty();
        $("#correctcount").append('<p> Correct: '+score+' </p>');
        $("#correctcount").append('<p> Wrong: '+(questionNumber-score)+' </p>');
        $("#correctcount").append('<p> Total: '+(questionNumber)+' </p>');
        
		timeLeft=10;
		timeID = setTimeout(function(){changeQuestion()},timeLeft*1000);
		changeTimer();
        
		$('.opt').click(function(){
		  	//correct answer
			if(this.id == rnd){
		   		score++;
			}
			setTimeout(function(){changeQuestion()},100);
		})
		
		$('.in').click(function(){
		  	//correct answer
			if(q1=questionBank[questionNumber][3] === $("#input").val()){
		   		score++;
			}
			setTimeout(function(){changeQuestion()},100);
		})
		
		$('.stop').click(function(){
			if($('.stop').val() === " stop "){
                $('.stop').val(" start ");
                clearTimeout(timeID);
                clearTimeout(timeoutID);
            }   
            else if($('.stop').val() === " start "){
                $('.stop').val(" stop ");
                timeLeft += 1;
                timeID = setTimeout(function(){changeQuestion()},timeLeft*1000);
                changeTimer();
            }
		})
	}//display question
	
	function changeQuestion(){
		clearTimeout(timeID);
		questionNumber++;
	
		if(questionNumber < numberOfQuestions){
			displayQuestion();
		}else{
			displayFinalSlide();
		}
	
	}//change question
	
	function changeTimer(){
		$("#timer").empty();
		$("#timer").append('Time Left for This Question: '+timeLeft+'');
		timeLeft--;
		clearTimeout(timeoutID);
		timeoutID=setTimeout(function(){changeTimer()},1000);
	}
	
	function displayFinalSlide(){
		clearTimeout(timeoutID);
		$("#timer").empty();
		$("#question").empty();
		$("#question").append('<p>You have finished the quiz!</p><p>Total questions: '+numberOfQuestions+'</p><p>Correct answers: '+score+'</p>');
        $("#stopdiv").empty();
        $("#correctcount").empty();
	}
	
	function shuffle(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        temp = new Array;
			temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}
	
});