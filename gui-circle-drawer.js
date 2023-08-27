define`
	<gui-circle-drawer count="0" vwidth="300" vheight="150">
		<link href="./component.css" rel="stylesheet" />
		<style>
			svg {
				background: #3b3b3b;
				border: 1px solid #858585;
			}

			circle {
				fill: #3b3b3b;
    		stroke: white;
			}

			circle:hover {
				fill: grey;
			}

			#controls {
				display: flex;
				justify-content: center;
				gap: 4px;
				margin-bottom: 4px;
			}
		</style>
		<fieldset>
			<legend>Circle Drawer</legend>
			<context-menu-container matches="circle">
				<span slot="menu-options">
					<button onclick="openAdjustFrame(event)">Adjust diameter...</button>
				</span>
				<span slot="content">
					<div id="controls">
						<button onclick="undoCircleStack(event)">Undo</button>
						<button onclick="redoCircleStack(event)">Redo</button>
					</div>
					<svg viewbox="0 0 ${'vwidth'} ${'vheight'}" xmlns="http://www.w3.org/2000/svg">
						<circle cx="50" cy="50" r="20" />
						<circle cx="200" cy="75" r="30" />
					</svg>
					<dialog id="adjust-frame">
						<label> Adjust Circle Diameter <br/>
							<input type="range" min="10" step="5" max="100" oninput="updateTargetDiameter(event)">
						</label>
						<button onclick="applyAdjustedDiameter(event)">Apply</button>
					</dialog>
				</span>
			</context-menu-container>
		</fieldset>
		<script>
			initCircleDrawerStack(this)
			initCircleDrawerListener(this)
		</script>
	</gui-circle-drawer>
`;

function openAdjustFrame(event) {
	const circleDrawerShadow = event.target.getRootNode();
	const circleDrawer = circleDrawerShadow.host;

	// dismiss a menu
	const circleDrawerMenuContainer = circleDrawerShadow.querySelector('context-menu-container');
	circleDrawerMenuContainer.dismissContextMenu();

	// determine index of targeted element
	const selectedCircle = circleDrawerShadow.querySelector('context-menu-container').target;
	const selectedCircleRadius = selectedCircle.getAttribute('r');
	const selectedCircleIndex = [...circleDrawerShadow.querySelectorAll('circle')].indexOf(selectedCircle) + 1;

	// push a placeholder undo element
	const placeholderStack = `U ${selectedCircleIndex} ${selectedCircleRadius} X`;
	circleDrawer.undoStack.push(placeholderStack);

	// update the range input to have the correct value
	const diameterInput = circleDrawerShadow.querySelector('input[type="range"]');
	diameterInput.value = selectedCircleRadius;

	// open a modal
	const adjustDiameterFrame = circleDrawerShadow.querySelector('#adjust-frame');
	adjustDiameterFrame.showModal();
}

function applyAdjustedDiameter(event) {
	const circleDrawerShadow = event.target.getRootNode();
	const circleDrawer = circleDrawerShadow.host;
	const adjustDiameterFrame = circleDrawerShadow.querySelector('#adjust-frame');

	// target circle
	const selectedCircle = circleDrawerShadow.querySelector('context-menu-container').target;
	const newRadius = selectedCircle.getAttribute('r');

	// update the last item on the undo stack (there should already be a placeholder there)
	const placeholderLastItem = circleDrawer.undoStack.pop();
	const finalLastItem = placeholderLastItem.replace('X', newRadius);
	circleDrawer.undoStack.push(finalLastItem);

	adjustDiameterFrame.close();
}

function updateTargetDiameter(event) {
	const circleDrawerShadow = event.target.getRootNode();

	const selectedCircle = circleDrawerShadow.querySelector('context-menu-container').target;
	selectedCircle.setAttribute('r', event.target.value);
}

function initCircleDrawerListener(circleDrawer) {
	const svgContainer = circleDrawer.shadowRoot.querySelector('svg');
	svgContainer.addEventListener('click', (event) => addCircle(circleDrawer, event));
}

function initCircleDrawerStack(circleDrawer) {
	circleDrawer.undoStack = [
		'N 50 50', // new cirlce, x: 50, y: 50
		'U 1 10 20', // update first circle, from r: 10 to r: 20
		'N 200 75',
		'U 2 10 30',
	];

	circleDrawer.redoStack = [];
}

function undoCircleStack(event) {
	const circleDrawerShadow = event.target.getRootNode();
	const circleDrawer = circleDrawerShadow.host;

	const lastItem = circleDrawer.undoStack.pop();
	if (lastItem) {
		// new circle
		if (lastItem[0] === 'N') {
			// remove last circle added
			const lastCircle = circleDrawerShadow.querySelector('circle:last-of-type');
			lastCircle.remove();
		}

		// updated circle radius
		if (lastItem[0] === 'U') {
			// reset radius
			const [action, index, oldRadius, newRadius] = lastItem.split(' ');
			const targetCircle = circleDrawerShadow.querySelector(`circle:nth-child(${index})`);
			targetCircle.setAttribute('r', oldRadius);
		}

		circleDrawer.redoStack.push(lastItem);
	}
}

function redoCircleStack(event) {
	const circleDrawerShadow = event.target.getRootNode();
	const circleDrawer = circleDrawerShadow.host;

	const lastItem = circleDrawer.redoStack.pop();
	if (lastItem) {
		// new circle
		if (lastItem[0] === 'N') {
			const [action, x, y] = lastItem.split(' ');
			const circleSvgContainer = circleDrawerShadow.querySelector('svg');
			const newCircle = svg`<circle cx="${x}" cy="${y}" r="10" />`;
			circleSvgContainer.appendChild(newCircle);
		}

		// updated circle radius
		if (lastItem[0] === 'U') {
			const [action, index, oldRadius, newRadius] = lastItem.split(' ');
			const targetCircle = circleDrawerShadow.querySelector(`circle:nth-child(${index})`);
			targetCircle.setAttribute('r', newRadius);
		}

		circleDrawer.undoStack.push(lastItem);
	}
}

function addCircle(circleDrawer, event) {
	const circleDrawerShadow = circleDrawer.shadowRoot;
	const circleSvgContainer = circleDrawerShadow.querySelector('svg');

	const containerRect = circleSvgContainer.getBoundingClientRect();

	// scale to the size of the viewbox (as it is rendered)
	const rectWidth = containerRect.right - containerRect.left;
	const rectHeight = containerRect.bottom - containerRect.top;

	const xScale = parseInt(circleDrawer.getAttribute('vwidth')) / rectWidth;
	const yScale = parseInt(circleDrawer.getAttribute('vheight')) / rectHeight;

	const x = (event.clientX - containerRect.left) * xScale;
	const y = (event.clientY - containerRect.top) * yScale;

	const newCircle = svg`<circle cx="${x}" cy="${y}" r="10" />`;
	circleSvgContainer.appendChild(newCircle);

	circleDrawer.undoStack.push(`N ${x} ${y}`);
	circleDrawer.redoStack = [];
}