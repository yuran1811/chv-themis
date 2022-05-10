const codeEditorEl = document.querySelector('#code-editor');
let editor;

require.config({ paths: { vs: '/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => {
	editor = monaco.editor.create(codeEditorEl, {
		language: 'cpp',
		theme: 'vs-dark',
		model: monaco.editor.createModel(
			`#include <iostream>\nusing namespace std;\n\nint main() {\n\treturn 0;\n}`,
			'cpp'
		),
		automaticLayout: true,
		minimap: { enabled: false },
		fontLigatures: true,
		// wordWrap: 'on',
	});

	const theme = 'Oceanic Next';
	fetch(`monaco-themes/themes/${theme}.json`)
		.then((res) => res.json())
		.then((data) => {
			monaco.editor.defineTheme(theme.split(' ').join('-'), data);
			monaco.editor.setTheme(theme.split(' ').join('-'));
		});
});

codeEditorEl.onkeydown = (e) => {
	if (e.ctrlKey && e.key.toLowerCase() === 's') e.preventDefault();
	if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')
		e.preventDefault();
};

const langSelect = document.querySelector('.lang-select');
langSelect.onchange = function () {
	const opts = this.options;
	monaco.editor.setModelLanguage(
		editor.getModel(),
		opts[opts.selectedIndex].getAttribute('lang')
	);
};

const submitCodeForm = document.querySelector('.submit-code-form');
submitCodeForm.addEventListener('formdata', (e) => {
	e.formData.append(
		'submission',
		editor.getModel().getValue() || '// Nothing'
	);
});

addEventListener('resize', () => {
	codeEditorEl.width = innerWidth * 0.9 + 'px';
});
