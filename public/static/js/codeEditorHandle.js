let editor;

const codeEditorEl = document.querySelector('#code-editor');
codeEditorEl.onkeydown = (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 's') e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') e.preventDefault();
};

const langSelect = document.querySelector('.lang-select');
langSelect.onchange = function () {
  const opts = this.options;
  monaco.editor.setModelLanguage(editor.getModel(), opts[opts.selectedIndex].getAttribute('lang'));
};

const submitCodeForm = document.querySelector('.submit-code-form');
submitCodeForm.addEventListener('formdata', (e) => {
  e.formData.append('submission', editor.getModel().getValue() || '// Nothing');
});

require.config({ paths: { vs: '/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => {
  editor = monaco.editor.create(codeEditorEl, {
    language: 'cpp',
    theme: 'vs-dark',
    model: monaco.editor.createModel(
      `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() { return 0; }`,
      'cpp',
    ),
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    fontLigatures: true,
    wordWrap: 'on',
  });
});

addEventListener('resize', () => {
  codeEditorEl.width = innerWidth * 0.9 + 'px';
});
