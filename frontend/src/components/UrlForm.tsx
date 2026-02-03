import { useState, FormEvent } from 'react';

import styles from './UrlForm.module.css';

interface UrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onSubmit(url);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your long URL here..."
          className={styles.input}
          disabled={isLoading}
          aria-label="URL to shorten"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <span className={styles.spinner} />
          ) : (
            'Shorten'
          )}
        </button>
      </div>
    </form>
  );
}
