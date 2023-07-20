import './css/style.css';
import synthesis from './js/speechSynthesis.ts';
import recognition from "./js/speechRecognition.ts";
import Navigo from "navigo";

window.addEventListener('DOMContentLoaded', () => {
	const router = new Navigo('/');

	const app = document.querySelector<HTMLDivElement>('#app')!;
	const nav = document.createElement('nav');
	const outlet = document.createElement('div');

	nav.innerHTML = `
		<ul>
			<li><a href="/synthesis" data-navigo>Synthesis</a></li>
			<li><a href="/recognition" data-navigo>Recognition</a></li>
		</ul>
	`;

	app.appendChild(nav);
	app.appendChild(outlet);

	router.on('/synthesis', () => {
		outlet.innerHTML = `
			<div id="wrapper">
				<h1>Speech Synthesis - Player</h1>
				<label>Text:
					<textarea id="textarea">Привет! Как дела?</textarea>
				</label>
				<label>Voice:
					<select id="select"></select>
				</label>
				<label>Volume:
					<input id="volume" type="range" min="0" max="1" step="0.1" value="1" />
					<span>1</span>
				</label>
				<label>Rate:
					<input id="rate" type="range" min="0" max="3" step="0.5" value="1" />
					<span>1</span>
				</label>
				<label>Pitch:
					<input id="pitch" type="range" min="0" max="2" step="0.5" value="1" />
					<span>1</span>
				</label>
				<div id="buttons">
					<button class="speak">Speak</button>
					<button class="cancel">Cancel</button>
					<button class="pause">Pause</button>
					<button class="resume">Resume</button>
				</div>
			</div>
		`;

		setTimeout(synthesis);
	});
	router.on('/recognition', () => {
		outlet.innerHTML = `
			<div id="wrapper">
				<h1>Speech Recognition - Dictaphone</h1>
				<textarea id="final_text" cols="30" rows="10"></textarea>
				<input type="text" id="interim_text" />
				<div id="buttons">
					<button class="start">Старт</button>
					<button class="stop">Стоп</button>
					<button class="abort">Сброс</button>
					<button class="copy">Копия</button>
					<button class="clear">Очистить</button>
				</div>
			</div>
		`;

		setTimeout(recognition);
	});

	router.resolve();
});
