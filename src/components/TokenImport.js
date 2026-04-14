import { Button, Notice, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { parseTokensJson } from '../utils/tokens';

export default function TokenImport({ onImport }) {
  const [error, setError] = useState('');
  const [raw, setRaw] = useState('');

  const applyJson = (input) => {
    try {
      const updates = parseTokensJson(input);
      onImport(input, updates);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to parse token JSON.');
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setRaw(text);
      applyJson(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mzv-style-tile__token-import">
      <input
        type="file"
        accept="application/json"
        onChange={onFileChange}
        className="mzv-style-tile__token-file"
      />
      <TextareaControl
        label="Token JSON"
        help="Paste DTCG or Figma Variables JSON export"
        value={raw}
        onChange={setRaw}
        rows={8}
      />
      <Button variant="primary" onClick={() => applyJson(raw)}>
        Import Tokens JSON
      </Button>
      {error ? (
        <Notice status="error" isDismissible={false}>
          {error}
        </Notice>
      ) : null}
    </div>
  );
}
