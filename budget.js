//Budget App - Michael Henderson
function Income() {}

Income.prototype.wipe = function() {
	resetValue(document.getElementById('enterAmount'));
	document.getElementById('paychecks').innerHTML = '';
};

Income.prototype.addPaycheck = function(a,i) {
	var paycheck = 'paycheck'+i;

	this[paycheck] = {};
	this[paycheck].amount = parseFloat(a);
	this[paycheck].warningAmount = parseFloat(this[paycheck].amount / 2);
	this[paycheck].afterBills = parseFloat(a);
};

function addAmount() {
	var props = {
		class:'paycheck green', 
		draggable:'true', 
		ondragover: 'handleDrag(event);', 
		ondrop: 'dropAmount(event);'
	}

	var input = document.getElementById('enterAmount');
	var len = document.getElementById('paychecks').children.length+1;
	var match = /^(?=\.*\d)\d{0,6}\.\d{2}$/g;

	if (match.test(input.value) == true) {
		money.addPaycheck(input.value,len);
		props.id = 'paycheck'+(len);
		createElement('div','paychecks','$'+money['paycheck'+len].amount,props);
		resetValue(input);
	} else {
		return false;
	}
}

function getAmount(element) {
	event.dataTransfer.effectAllowed = 'copy';
	event.dataTransfer.setData('text/plain', element.getAttribute('data-amount'));
}

function handleDrag(event) {
	event.preventDefault();
}

function dropAmount(event) {
	var paycheck = event.target.id;
	var element = document.getElementById(paycheck);
	var bill = parseFloat(event.dataTransfer.getData('text/plain'));
	var currTotal = parseFloat(element.innerHTML.replace('$',''));

	money[paycheck].afterBills = (currTotal - bill);
	var newTotal = money[paycheck].afterBills;

	console.log(money[paycheck]);

	if (newTotal < 0) {
		element.setAttribute('class', 'paycheck red');
	}
	else if (newTotal <= money[paycheck].warningAmount) {
		element.setAttribute('class', 'paycheck orange');
	}

	element.innerHTML = '$'+newTotal.toFixed(2);
}

function clearValue(element) {
	element.value = '';
}

function resetValue(element) {
	element.value = 'Add paycheck amount';
}

function createElement(el,parent,str,props) {
	var element = document.createElement(el);
	var text = document.createTextNode(str);
	
	for (var prop in props) {
		element.setAttribute(prop, props[prop]);
	}

	element.appendChild(text);
	document.getElementById(parent).appendChild(element);
}