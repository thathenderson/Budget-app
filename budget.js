//Budget App - Michael Henderson
function Income() {
	this.defaultPaycheckText = 'Add Income';
	this.defaultBillText = 'Add a Bill';
}

Income.prototype.wipePaychecks = function() {
	resetValue(document.getElementById('enterAmount'),this.defaultPaycheckText);
	document.getElementById('paychecks').innerHTML = '';
};

Income.prototype.wipeBills = function() {
	resetValue(document.getElementById('enterBill'),this.defaultBillText);
	document.getElementById('bills').innerHTML = '';
};

Income.prototype.createPaycheck = function(a,i) {
	var paycheck = 'paycheck'+i;

	this[paycheck] = {};
	this[paycheck].amount = parseFloat(a);
	this[paycheck].warningAmount = parseFloat(this[paycheck].amount / 2);
	this[paycheck].afterBills = parseFloat(a);
};

function displayPaycheck() {
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
		money.createPaycheck(input.value,len);
		props.id = 'paycheck'+(len);
		createElement('div','paychecks','$'+money['paycheck'+len].amount,props);
		createElement('div','paycheck'+len,'-',{
			class: 'delete hide', 
			onclick: 'deleteElement("paychecks","paycheck'+len+'");'
		});

		resetValue(input,money.defaultPaycheckText);
	} else {
		return false;
	}
}

function displayBill() {
	var props = {
		class:'bill grey', 
		draggable:'true', 
		ondragstart: 'getAmount(this);' 
	}

	var input = document.getElementById('enterBill');
	var len = document.getElementById('bills').children.length+1;
	var match = /^(?=\.*\d)\d{0,6}\.\d{2}$/g;

	if (match.test(input.value) == true) {
		props.id = 'bill'+(len);
		props['data-amount'] = input.value;
		createElement('div','bills','$'+props['data-amount'],props);
		createElement('div','bill'+len,'-',{
			class: 'delete hide', 
			onclick: 'deleteElement("bills","bill'+len+'");'
		});

		resetValue(input,money.defaultBillText);
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

function resetValue(element,val) {
	element.value = val;
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

function deleteElement(parent,id) {
	var parent = document.getElementById(parent);
	var element = document.getElementById(id);

	parent.removeChild(element);
}

function editElements(t,element) {
	var parent = document.getElementById(element);
	var buttonClass = t.getAttribute("class");
	
	if (parent.children.length < 1 && buttonClass == 'button') {
		return false;
	} else if (parent.children.length > 0 && buttonClass == 'button') {
	//not in edit mode
		t.setAttribute("class",buttonClass+" editing");
		t.innerHTML = 'Done';

		for (var i=0; i < parent.children.length; i++) {
			var deleteButton = parent.children[i].children[0];
			deleteButton.setAttribute("class",deleteButton.getAttribute("class").replace("hide","show"));
		}
	} else if (buttonClass != 'button') {
	//already in edit mode
		t.setAttribute("class","button");
		t.innerHTML = 'Edit';

		for (var i=0; i < parent.children.length; i++) {
			var deleteButton = parent.children[i].children[0];
			deleteButton.setAttribute("class",deleteButton.getAttribute("class").replace("show","hide"));
		}
	}
}