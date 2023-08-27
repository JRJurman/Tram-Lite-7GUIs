define`
	<context-menu-container matches="">
		<style>
			menu {
				display: none;
				position: absolute;
			}
		</style>
		<menu>
			<slot name="menu-options"></slot>
		</menu>
		<section oncontextmenu="displayContextMenu(this, event)" onclick="dismissContextMenu(this, event)">
			<section id="content-wrapper">
				<slot name="content"></slot>
			</section>
		</section>
		<script>
			this.dismissContextMenu = () => dismissContextMenu(this.shadowRoot.querySelector('menu'))
		</script>
	</context-menu-container>
`;

function displayContextMenu(contextMenuSection, event) {
	const contextMenuShadow = contextMenuSection.getRootNode();
	const contextMenuContainer = contextMenuShadow.host;

	// check if the target element matches what is required in the host (if we have matches)
	const matches = contextMenuContainer.getAttribute('matches');
	const elementMatches = event.target.matches(matches);
	if ((matches && elementMatches) || !matches) {
		event.preventDefault();
	} else {
		return;
	}

	// set the target on the context menu container
	contextMenuContainer.target = event.target;

	// display the context menu
	const contextMenuMenu = contextMenuShadow.querySelector('menu');
	contextMenuMenu.style.display = 'block';
	contextMenuMenu.style.top = `${event.pageY - 20}px`;
	contextMenuMenu.style.left = `${event.pageX - 35}px`;

	const contentWrapper = contextMenuShadow.querySelector('#content-wrapper');
	contentWrapper.style.pointerEvents = 'none';
}

function dismissContextMenu(contextMenuSection, event) {
	const contextMenuShadow = contextMenuSection.getRootNode();
	const contextMenuMenu = contextMenuShadow.querySelector('menu');
	const contentWrapper = contextMenuShadow.querySelector('#content-wrapper');

	contextMenuMenu.style.display = 'none';
	contentWrapper.style.pointerEvents = '';
}