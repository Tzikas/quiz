var correct = new Audio('Correct-answer.mp3');
var wrong = new Audio('Wrong-answer.mp3');
var start = new Audio('Winning-sound-effect.mp3');
var end = new Audio('5_Sec_Crowd.mp3');

var state = {
	questions: [
	{
		text: "Kimchi is served with every Korean meal and can be made from the many different vegetables. What's the most common vegetable used to make Kimichi?",
		answers: ["Radish", "Parsnip", "Eggplant", "Cabbage"],
		answerIndex: 3,
		correctResponse: "The most common type of kimchi is made from napa cabbage.",
		incorrectResponse: "While kimichi can be made from virtually any vegetable napa cabbage is the most common type of kimchi."
	},
	{
		text: "The side dishes served with Korean meals are called?",
		answers: ["Appetizers","Banchan", "Tsukidashi", "Tapas"],
		answerIndex: 1,
		correctResponse: "Banchan dishes can cover the entire table during a korean meal.",
		incorrectResponse: "Banchan are small dishes to eat with your meal and can cover the entire table."
	},
	{
		text: "Korean meals often include this alcoholic beverage?",
		answers: ["Soju","Port","Sake","Absinthe"],
		answerIndex: 0,
		correctResponse: "During dinner in a korean restaurants almost every table will have at least one greeen soju bottle.",
		incorrectResponse: "Soju is a korea's most popular alcoholic beverage."
	},
	{
		text: "In Korea stews and soup are called?",
		answers: ["Chowder","Ramen","Jjigae","Stock"],
		answerIndex: 2,
		correctResponse: "Jjigae is the perfect meal on a cold day.",
		incorrectResponse: "Stews and soups are called jjigae in Korea."
	},
	{
		text: "A popular dish of rice mixed with vegetables and spicy sauces is?",
		answers: ["Curry", "Bibimbap", "Jambalaya", "Paella"],
		answerIndex: 1,
		correctResponse: "Try dolcet bibimbap. It's served in a hot, stone bowl which crisps the rice on the bottom of the bowl.",
		incorrectResponse: "Bibimbap is big bowl of rice topped with vegetables and spicy sauce."
	}
	],
	currentQuestionIndex: 0,
	score: 0,
	lastAnswerCorrect: false,
	route: 'start'
}

var pageElements = {
	'start': $('.quiz-start'),
	'question': $('.question-block'),
	'feedback': $('.feedback-block'),
	'results': $('.final-results')
}

function updateState(state, route) {
	state.route = route;
}

function advanceQuestion(state) {
	state.currentQuestionIndex++;
	if (state.currentQuestionIndex === state.questions.length) {
		state.route = 'results';
	} else {
		state.route = 'question';
	}
}

function resetState(state){
	state.currentQuestionIndex = 0;
	state.score = 0;
	state.lastAnswerCorrect = false;
	state.route = 'start';
}

function displayCurrentQuestion(state, element) {
	element.text(state.currentQuestionIndex + 1);
}

function displayScore(state, element) {
	element.text(state.score);
}

function displayQuestionText(state, element) {
	var question = getCurrentQuestion(state);
	element.html(question.text);
}

function displayQuestionAnswers(state, element) {
	var question = getCurrentQuestion(state);
	var answers = question.answers.map(function(item, index) {
		return ('<li><input type="radio" name="answers" value="' + index + '"><label>' + item + '</label></li>');
	});
	element.html(answers);
}

function displayCorrectFeedback(state, element) {
	correct.play();
	$('.container').addClass('correct');
	var question = getCurrentQuestion(state);
	var response = '<strong>Correct:</strong> ' + question.correctResponse;
	element.html(response);
}

function displayIncorrectFeedback(state, element) {
	wrong.play();
	$('.container').addClass('wrong');	
	var question = getCurrentQuestion(state);
	var response = '<strong>Incorrect:</strong> ' + question.incorrectResponse;
	element.html(response);
}

function displayNextButtonText(state, element) {	
	var text = state.currentQuestionIndex < state.questions.length - 1 ? "Next Question" : "See Results";
	element.text(text);
}

function getCurrentQuestion(state) {
	return state.questions[state.currentQuestionIndex];
}

function checkAnswer(state, value) {
	var question = getCurrentQuestion(state);
	if(question.answerIndex === value) {
		state.score++;
		state.lastAnswerCorrect = true;
	} else {
		state.lastAnswerCorrect = false;
	}
}

function renderApp(state, elements) {
	Object.keys(elements).forEach(function(route) {
			if (!elements[route].hasClass('hidden')) {
				elements[route].addClass('hidden');
		}
	});

	elements[state.route].removeClass('hidden');

	if (state.route === 'start'){
		renderStart(state, elements[state.route]);
		start.play();	
	}else	if (state.route === 'question') {
		renderQuestion(state, elements[state.route]);
	}else if (state.route === 'feedback') {
		renderFeedback(state, elements[state.route]);
	}else if (state.route === 'results') {
		renderResults(state, elements[state.route]);
		end.play();
	}
}

function renderStart(state, element) {
}

function renderQuestion(state, element) {
	displayCurrentQuestion(state, element.find('.current-question'));
	displayScore(state, element.find('.current-score'));
	displayQuestionText(state, element.find('.question-text'));
	displayQuestionAnswers(state, element.find('.answer-list'));
}

function renderFeedback(state, element) {
	if(state.lastAnswerCorrect) {
		displayCurrentQuestion(state, element.find('.current-question'));
		displayScore(state, element.find('.current-score'));
		displayCorrectFeedback(state, element.find('.response'));
	} else {
		displayCurrentQuestion(state, element.find('.current-question'));
		displayScore(state, element.find('.current-score'));
		displayIncorrectFeedback(state, element.find('.response'));
	}
	displayNextButtonText(state, element.find('.next-question'));
}

function renderResults(state, element) {
	element.find('.correct').text(state.score);
}

$("form[name='start-game']").submit(function(event){
	event.preventDefault();
	updateState(state, 'question');
	renderApp(state, pageElements);
})

$("form[name='answer-block']").submit(function(event) {
	event.preventDefault();
	var answer = $('input[name="answers"]:checked').val();
	answer = parseInt(answer, 10);
	updateState(state, 'feedback');
	checkAnswer(state, answer);
	renderApp(state, pageElements);
})

$('.next-question').click(function() {
	advanceQuestion(state);
	renderApp(state, pageElements);
	$('.container').removeClass('correct wrong');	
	
})

$('.restart-quiz').click(function() {
	resetState(state);
	renderApp(state, pageElements);
})

$(document).ready(function (){
	renderApp(state, pageElements);
})



