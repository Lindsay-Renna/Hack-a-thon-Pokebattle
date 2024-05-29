async function fetchPokemonData(pokemonName) {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
	);
	// console.log("response", await response.json());
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error("Pokemon not found");
	}
}

// Updating the cards with fetched data
function updatePokemonCard(card, data) {
	const cardBox = card;
	const imageElementWrapper = document.createElement("div");
	imageElementWrapper.classList.add("image-wrapper");
	const imgElement = document.createElement("img");
	const nameElement = document.createElement("h3");
	const descriptionElement = document.createElement("div");

	cardBox.appendChild(imageElementWrapper);

	imgElement.src = data.sprites.other["official-artwork"].front_default;
	imageElementWrapper.appendChild(imgElement);

	nameElement.classList.add("pokemon-name");
	nameElement.textContent =
		data.name.charAt(0).toUpperCase() + data.name.slice(1);
	cardBox.appendChild(nameElement);

	descriptionElement.classList.add("pokemon-description");
	descriptionElement.innerHTML = `
    <ul>
        <li>Type: ${data.types
					.map((typeInfo) => typeInfo.type.name)
					.join(", ")}</li>
        <li>Abilities: ${data.abilities
					.map((abilityInfo) => abilityInfo.ability.name)
					.join(", ")}</li>
        <li>HP: ${
					data.stats.find((stat) => stat.stat.name === "hp").base_stat
				}</li>
        <li>ATK: ${
					data.stats.find((stat) => stat.stat.name === "attack").base_stat
				}</li>
        <li>DEF: ${
					data.stats.find((stat) => stat.stat.name === "defense").base_stat
				}</li>
    </ul>`;

	cardBox.appendChild(descriptionElement);
}

// load data fetched from the Poké API
async function loadPokemonData(pokemon1Name, pokemon2Name) {
	try {
		const [pokemon1Data, pokemon2Data] = await Promise.all([
			fetchPokemonData(pokemon1Name),
			fetchPokemonData(pokemon2Name),
		]);

		updatePokemonCard(document.querySelectorAll(".card")[0], pokemon1Data);
		updatePokemonCard(document.querySelectorAll(".card")[1], pokemon2Data);
	} catch (error) {
		console.error(error);
	}
}

// create function to simulate the battle
function simulateBattle(pokemon1Data, pokemon2Data) {
	const winnerIndex = Math.random() > 0.5 ? 0 : 1;
	const winnerName = [pokemon1Data.name, pokemon2Data.name][winnerIndex];
	document.querySelector(".winner").textContent = `${
		winnerName.charAt(0).toUpperCase() + winnerName.slice(1)
	} is the winner!`;
}

document.addEventListener("DOMContentLoaded", () => {
	const button = document.querySelector(".button-wrapper button");

	button.addEventListener("click", async (event) => {
		event.preventDefault();

		const pokemon1Name = document.querySelectorAll('input[name="names"]')[0]
			.value;
		const pokemon2Name = document.querySelectorAll('input[name="names"]')[1]
			.value;

		if (pokemon1Name && pokemon2Name) {
			const [pokemon1Data, pokemon2Data] = await Promise.all([
				fetchPokemonData(pokemon1Name),
				fetchPokemonData(pokemon2Name),
			]);

			updatePokemonCard(document.querySelectorAll(".card")[0], pokemon1Data);
			updatePokemonCard(document.querySelectorAll(".card")[1], pokemon2Data);

			updateBattleBox(
				document.querySelectorAll(".battle-box")[0],
				pokemon1Data
			);

			setTimeout(() => {
				updateBattleBox(
					document.querySelectorAll(".battle-box")[1],
					pokemon2Data
				);
			}, 500);

			setTimeout(() => {
				simulateBattle(pokemon1Data, pokemon2Data);
			}, 2000);
		} else {
			alert("Please select two Pokémon to battle.");
		}
	});
});

// Battle-text generation

function updateBattleBox(card, data) {
	const battleBox = card;
	const battleText1 = document.createElement("p");
	battleText1.classList.add("battle-text");
	const battleText2 = document.createElement("p");
	battleText2.classList.add("battle-text");

	let elements = [battleText1, battleText2];
	let abilities = [
		data.abilities[0].ability.name,
		data.abilities[1].ability.name,
	];
	let name = data.name;
	let capitalized_name = name.charAt(0).toUpperCase() + name.slice(1);

	function battleTextUpdate(abilities, elements) {
		elements[0].innerText = `${capitalized_name} started with ${abilities[0]}`;
		battleBox.appendChild(elements[0]);

		setTimeout(() => {
			elements[1].innerText = `${capitalized_name} followed up ${abilities[1]}`;
			battleBox.appendChild(elements[1]);
		}, 1000);
	}

	battleTextUpdate(abilities, elements);
}

// reset the battleground

const resetButton = document.querySelector(".reset-button");

function resetAll() {
	const imgElement = document.querySelectorAll(".image-wrapper img");
	const imgWrapper = document.querySelectorAll(".image-wrapper");
	const nameElement = document.querySelectorAll(".pokemon-name");
	const descriptionElement = document.querySelectorAll(".pokemon-description");
	const battleText = document.querySelectorAll(".battle-text");
	const inputs = document.querySelectorAll("input");
	const winnertext = document.querySelector(".winner");

	let resetArray = [
		imgElement,
		nameElement,
		descriptionElement,
		battleText,
		imgWrapper,
	];

	resetArray.forEach((items) => {
		items.forEach((item) => {
			item.remove();
		});
	});

	winnertext.innerText = "";

	inputs.forEach((input) => {
		input.value = ""; // Clear the input value
	});
}

resetButton.addEventListener("click", (event) => {
	resetAll();
});
