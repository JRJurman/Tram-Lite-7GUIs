define`
	<gui-flight-booker flight-option="one-way" start-date="03/27/2014" return-date="03/27/2014">
		<link href="./component.css" rel="stylesheet" />
		<style>
			fieldset {
				display: flex;
				flex-direction: column;
				max-width: 4em;
				gap: 4px;
			}
			input[invalid] {
				background: red;
			}
		</style>
		<fieldset>
			<legend>Flight Booker</legend>
			<select id="flight-input" onchange="updateRootAttr('flight-option', event)" value=${'flight-option'}>
				<option value="one-way">one-way flight</option>
				<option value="return">return flight</option>
			</select>
			<input id="start-input" oninput="updateRootAttr('start-date', event)" value=${'start-date'}>
			<input id="return-input" oninput="updateRootAttr('return-date', event)" value=${'return-date'}>
			<button id="book-confirm" onclick="bookFlight(this)">Book</button>
		</fieldset>
		<script>
			initFlightBooker(this)
		</script>
	</gui-flight-booker>
`;

function initFlightBooker(flightBooker) {
	// setup listeners
	addAttributeListener(flightBooker, ['flight-option', 'start-date', 'return-date'], () =>
		decorateFlightBookerControls(flightBooker)
	);
	decorateFlightBookerControls(flightBooker);
}

function decorateFlightBookerControls(flightBooker) {
	// attributes from the root component
	const flightOption = flightBooker.getAttribute('flight-option');
	const startDate = flightBooker.getAttribute('start-date');
	const returnDate = flightBooker.getAttribute('return-date');

	// startDate and returnDate values as time, used to check for validity
	const startDateTime = new Date(startDate).getTime();
	const returnDateTIme = new Date(returnDate).getTime();

	// elements we may need to decorate or disable
	const startInput = flightBooker.shadowRoot.querySelector('#start-input');
	const returnInput = flightBooker.shadowRoot.querySelector('#return-input');
	const bookConfirm = flightBooker.shadowRoot.querySelector('#book-confirm');

	// if one-way flight is selected, disable the return date
	if (flightOption === 'one-way') {
		flightBooker.setAttribute('return-date', startDate);
		returnInput.setAttribute('disabled', '');
	} else {
		returnInput.removeAttribute('disabled');
	}

	// if either date is improperly formatted, mark the input to be styled
	const isStartInvalid = isNaN(startDateTime);
	if (isStartInvalid) {
		startInput.setAttribute('invalid', '');
	} else {
		startInput.removeAttribute('invalid');
	}

	const isReturnInvalid = isNaN(returnDateTIme);
	if (isReturnInvalid) {
		returnInput.setAttribute('invalid', '');
	} else {
		returnInput.removeAttribute('invalid');
	}

	// if either date is invalid, or the startDate is after the return, disable booking
	const isStartAfterReturn = startDateTime > returnDateTIme;
	if (isStartInvalid || isReturnInvalid || isStartAfterReturn) {
		bookConfirm.setAttribute('disabled', '');
	} else {
		bookConfirm.removeAttribute('disabled');
	}
}

function bookFlight(flightButton) {
	const flightBooker = flightButton.getRootNode().host;
	const flightOption = flightBooker.getAttribute('flight-option');
	if (flightOption === 'one-way') {
		alert(`You have booked a one-way flight on ${flightBooker.getAttribute('start-date')}.`);
	}
	if (flightOption === 'return') {
		alert(
			`You have booked a return flight from ${flightBooker.getAttribute('start-date')} to ${flightBooker.getAttribute(
				'return-date'
			)}.`
		);
	}
}
