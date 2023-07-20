const synthesis = () => {
	const select = document.querySelector<HTMLSelectElement>('#select');
	const wrapper = document.querySelector<HTMLDivElement>('#wrapper');
	const buttons = document.querySelector<HTMLDivElement>('#buttons');
	const textarea = document.querySelector<HTMLTextAreaElement>('#textarea');
	const volume = document.querySelector<HTMLInputElement>('#volume');
	const rate = document.querySelector<HTMLInputElement>('#rate');
	const pitch = document.querySelector<HTMLInputElement>('#pitch');

	const U = new SpeechSynthesisUtterance();
	let voices = speechSynthesis.getVoices();

	const convertTextToSpeech = () => {
		const text = textarea!.value.trim();
		if (!text) {
			return
		}

		U.text = text;
		const voice = voices[+select!.value];

		U.voice = voice;
		U.lang = voice.lang;
		U.volume = +volume!.value;
		U.rate = +rate!.value;
		U.pitch = +pitch!.value;

		speechSynthesis.speak(U);
	};

	const handleChange = (element: HTMLInputElement) => {
		if (!element.nextElementSibling) {
			return;
		}

		element.nextElementSibling.textContent = element.value;
	};

	const initializeHandlers = () => {
		U.addEventListener('start', () => console.log('Started'));
		U.addEventListener('end', () => console.log('Finished'));
		U.addEventListener('error', ({ error }) => console.log(error));
		U.addEventListener('pause', () => console.log('Paused'));
		U.addEventListener('resume', () => console.log('Resumed'));

		wrapper!.addEventListener('change', (event) => {
			if (!event.target) {
				return;
			}

			if ((event.target as HTMLInputElement).type !== 'range') {
				handleChange(event.target as HTMLInputElement);
			}
		});

		buttons!.addEventListener('click', (event) => {
			switch ((event.target as HTMLButtonElement).className) {
				case 'speak':
					if (!speechSynthesis.speaking) {
						convertTextToSpeech()
					}
					break
				case 'cancel':
					return speechSynthesis.cancel()
				case 'pause':
					return speechSynthesis.pause()
				case 'resume':
					return speechSynthesis.resume()
				default:
					return
			}
		});
	};

	const populateVoices = (voices: SpeechSynthesisVoice[]) => {
		voices.forEach((voice, index) => {
			select!.options[index] = new Option(voice.name, `${index}`);
		});

		const defaultVoiceIndex = voices.findIndex(
			(voice) => voice.name === 'Google русский' || voice.name === 'русский Россия'
		);

		select!.selectedIndex = defaultVoiceIndex;

		initializeHandlers();
	};

	speechSynthesis.addEventListener('voiceschanged', () => {
		voices = speechSynthesis.getVoices();
		populateVoices(voices);
	});

	window.addEventListener('keydown', (event) => {
		switch (event.key.toLowerCase()) {
			case 's':
				if (!speechSynthesis.speaking) {
					convertTextToSpeech()
				}
				break
			case 'c':
				return speechSynthesis.cancel()
			case 'p':
				return speechSynthesis.pause()
			case 'r':
				return speechSynthesis.resume()
			default:
				return
		}
	});
};

export default synthesis;
