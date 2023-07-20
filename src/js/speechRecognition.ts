const recognition = () => {
	const interim_text = document.querySelector<HTMLInputElement>('#interim_text');
	const final_text = document.querySelector<HTMLTextAreaElement>('#final_text');
	const buttons = document.querySelector<HTMLDivElement>('#buttons');

	let final_transcript = '';
	let recognizing = false;
	const DICTIONARY: Record<string, string> = {
		точка: '.',
		запятая: ',',
		вопрос: '?',
		восклицание: '!',
		двоеточие: ':',
		тире: '-',
		абзац: '\n',
		отступ: '\t'
	}

	const editInterim = (str: string) => {
		return str
			.split(' ')
			.map((word) => {
				word = word.trim()
				return DICTIONARY[word.toLowerCase()]
					? DICTIONARY[word.toLowerCase()]
					: word
			})
			.join(' ');
	};

	const editFinal = (str: string) => {
		return str.replace(/\s{1,}([\.+,?!:-])/g, '$1')
	};

	const speechRecognition = (window as any).webkitSpeechRecognition;
	const recognition = new speechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.maxAlternatives = 3;
	recognition.lang = 'ru-RU';

	recognition.addEventListener('start', () => console.log('Started'));
	recognition.addEventListener('error', ({ error }: { error: string }) => console.log(error));
	recognition.addEventListener('end', () => {
		console.log('End');

		if (!recognizing) {
			return;
		}

		recognition.start();
	});
	recognition.addEventListener('result', (event: any) => {
		console.log('result');
		let interim_transcript = '';

		for (let i = event.resultIndex; i < event.results.length; i++) {
			if (event.results[i].isFinal) {
				const result = editInterim(event.results[i][0].transcript);
				final_transcript += result;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}

		interim_text!.value = interim_transcript;

		final_transcript = editFinal(final_transcript);
		final_text!.value = final_transcript;
	});

	buttons!.addEventListener('click', (event) => {
		switch ((event.target as HTMLButtonElement).className) {
			case 'start':
				final_transcript = '';
				recognition.start();
				recognizing = true;
				final_text!.value = '';
				interim_text!.value = '';
				break;
			case 'stop':
				recognition.stop();
				recognizing = false;
				break
			case 'abort':
				recognition.abort();
				recognizing = false;
				break;
			case 'copy':
				navigator.clipboard.writeText(final_text!.value);

				(event.target as HTMLButtonElement).textContent = 'Готово';
				const timerId = setTimeout(() => {
					(event.target as HTMLButtonElement).textContent = 'Копия';
					clearTimeout(timerId);
				}, 3000);
				break
			case 'clear':
				final_transcript = '';
				final_text!.value = '';
				break
			default:
				break
		}
	})
};

export default recognition;
