define`
	<gui-crud>
		<link href="./component.css" rel="stylesheet" />
		<style>
			fieldset {
				display: grid;
				gap: 4px;
				grid-template-areas:
					"filter   ."
					"contacts form"
					"controls controls";
			}

			#filter { grid-area: filter; }
			#contact-list { grid-area: contacts; }
			#name-form { grid-area: form; }
			#controls { grid-area: controls; }
		</style>
		<fieldset>
			<legend>CRUD</legend>
			<label id="filter">Filter prefix: <input oninput="filterOptions(event)"></label>

			<select id="contact-list" size="5">
				<option>Emil, Hans</option>
				<option>Mustermann, Max</option>
				<option>Tisch, Roman</option>
			</select>

			<div id="name-form">
				<label>Name: <input id="name-input"></label>
				<label>Surname: <input id="surname-input"></label>
			</div>

			<div id="controls">
				<button onclick="createRecord(event)">Create</button>
				<button onclick="updateRecord(event)">Update</button>
				<button onclick="deleteRecord(event)">Delete</button>
			</div>
		</fieldset>
	</gui-crud>
`;

function filterOptions(event) {
	const filterString = event.target.value;

	// get contact list options
	const contactListShadow = event.target.getRootNode();
	const contactListSelect = contactListShadow.querySelector('#contact-list');
	const contactListOptions = contactListSelect.querySelectorAll('option');

	// update the display style attribute (which hides options)
	[...contactListOptions].forEach((option) => {
		const shouldHide = !option.textContent.startsWith(filterString);
		option.style.display = shouldHide ? 'none' : '';
	});
}

function getNameAndSurname(contactListShadow) {
	const name = contactListShadow.querySelector('#name-input').value;
	const surname = contactListShadow.querySelector('#surname-input').value;
	return { name, surname };
}

function createRecord(event) {
	const contactListShadow = event.target.getRootNode();
	const contactListSelect = contactListShadow.querySelector('#contact-list');

	const { name, surname } = getNameAndSurname(contactListShadow);
	const optionElement = html`<option>${surname}, ${name}</option>`;
	contactListSelect.appendChild(optionElement);
}

function updateRecord(event) {
	const contactListShadow = event.target.getRootNode();
	const contactListSelect = contactListShadow.querySelector('#contact-list');
	const contactListOptions = contactListSelect.querySelectorAll('option');

	const selectedOption = contactListOptions[contactListSelect.selectedIndex];

	const { name, surname } = getNameAndSurname(contactListShadow);
	const updatedText = `${surname}, ${name}`;
	selectedOption.textContent = updatedText;
}

function deleteRecord(event) {
	const contactListShadow = event.target.getRootNode();
	const contactListSelect = contactListShadow.querySelector('#contact-list');
	const contactListOptions = contactListSelect.querySelectorAll('option');

	const selectedOption = contactListOptions[contactListSelect.selectedIndex];

	selectedOption.remove();
}
