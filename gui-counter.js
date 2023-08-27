define`
	<gui-counter count="0">
		<link href="./component.css" rel="stylesheet" />
		<fieldset>
			<legend>Counter</legend>
			<input readonly value=${'count'}>
			<button onclick="increment(event)">Count</button>
		</fieldset>
	</gui-counter>
`;

function increment(event) {
	const counter = event.target.getRootNode().host;
	const currentCount = parseInt(counter.getAttribute('count'));
	counter.setAttribute('count', currentCount + 1);
}
