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
	document.querySelector(".battle-result .winner").textContent = `${
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

			simulateBattle(pokemon1Data, pokemon2Data);
		} else {
			alert("Please select two Pokémon to battle.");
		}
	});
});

// reset the battleground

const resetButton = document.querySelector(".reset-button");

function resetAll() {
	const imgElement = document.querySelectorAll(".image-wrapper img");
	const nameElement = document.querySelectorAll(".pokemon-name");
	const descriptionElement = document.querySelectorAll(".pokemon-description");
	const battleText = document.querySelectorAll(".battle-text");
	const input = document.querySelectorAll("input");

	let resetArray = [imgElement, nameElement, descriptionElement, battleText];

	resetArray.forEach((items) => {
		items.forEach((item) => {
			item.remove();
		});

		items.forEach((item) => {
			item.value = "";
		});
	});
}

resetButton.addEventListener("click", (event) => {
	resetAll();
});
