define`
	<gui-timer elapsed-time="0" max-time="0">
		<link href="./component.css" rel="stylesheet" />
		<fieldset>
			<legend>Timer</legend>
			Elapsed Time <progress value=${'elapsed-time'} max=${'max-time'}></progress>
			<div>${'elapsed-time'}s</div>
			Duration <input oninput="updateRootAttr('max-time', event)" type="range" min="0" max="30" step="0.01" value=${'max-time'}>
			<button onclick="resetTimer(event)">Reset</button>
		</fieldset>
		<script>
			initTimer(this)
		</script>
	</gui-timer>
`;

function initTimer(guiTimer) {
	addAttributeListener(guiTimer, ['elapsed-time', 'max-time'], () => {
		const elapsedTime = parseFloat(guiTimer.getAttribute('elapsed-time'));
		const maxTime = parseFloat(guiTimer.getAttribute('max-time'));
		const timerId = guiTimer.getAttribute('timer-id');
		if (!timerId && elapsedTime < maxTime) {
			startTimer(guiTimer);
		} else if (timerId && elapsedTime >= maxTime) {
			clearInterval(timerId);
			guiTimer.removeAttribute('timer-id');
		}
	});
}

function startTimer(guiTimer) {
	const timerId = setInterval(() => {
		const elapsedTime = parseFloat(guiTimer.getAttribute('elapsed-time'));
		guiTimer.setAttribute('elapsed-time', (elapsedTime + 0.1).toFixed(1));
	}, 100);
	guiTimer.setAttribute('timer-id', timerId);
}

function resetTimer(event) {
	const guiTimer = event.target.getRootNode().host;
	guiTimer.setAttribute('elapsed-time', 0);
}
