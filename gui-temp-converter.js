define`
	<gui-temp-converter celsius="" fahrenheit="">
		<link href="./component.css" rel="stylesheet" />
		<fieldset>
			<legend>Temperature Converter</legend>
			<input unit="celsius" oninput="updateRootAttr('celsius', event)" value=${'celsius'}>
			Celsius =
			<input unit="fahrenheit" oninput="updateRootAttr('fahrenheit', event)" value=${'fahrenheit'}>
			Fahrenheit
		</fieldset>
		<script>
			addAttributeListener(this, ['celsius', 'fahrenheit], convertTemperature)
		</script>
	</gui-temp-converter>
`;

/**
 * on updating any temperature attribute, convert to the other unit and update
 */
function convertTemperature(updatedAttributeRecord) {
	const tempConverter = updatedAttributeRecord.target;
	const updatedAttribute = updatedAttributeRecord.attributeName;
	const activeUnit = tempConverter.shadowRoot.activeElement.getAttribute('unit');

	const isInvalid = isNaN(parseInt(tempConverter.getAttribute(updatedAttribute)));
	if (isInvalid) {
		return;
	}

	// if the attribute we've updated isn't the one that is selected
	// then we'll end up updating the input we are currently in, which we should avoid
	if (updatedAttribute !== activeUnit) {
		return;
	}

	const currentCelsius = parseInt(tempConverter.getAttribute('celsius'));
	const currentFahrenheit = parseInt(tempConverter.getAttribute('fahrenheit'));

	if (updatedAttribute === 'celsius') {
		const newFahrenheit = (currentCelsius * (9 / 5) + 32).toFixed(0);
		tempConverter.setAttribute('fahrenheit', newFahrenheit);
	}

	if (updatedAttribute === 'fahrenheit') {
		const newCelsius = ((currentFahrenheit - 32) * (5 / 9)).toFixed(0);
		tempConverter.setAttribute('celsius', newCelsius);
	}
}
