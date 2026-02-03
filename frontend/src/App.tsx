import { useState } from 'react';

import { UrlResponse } from './types/url';
import { shortenUrl } from './api/urlApi';

import { UrlForm } from './components/UrlForm';
import { UrlResult } from './components/UrlResult';
import { ErrorMessage } from './components/ErrorMessage';

import styles from './App.module.css';

function App() {
  const [result, setResult] = useState<UrlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await shortenUrl({ url });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>URL Shortener</h1>
            <p className={styles.subtitle}>
              Transform your long URLs into short, shareable links
            </p>
          </header>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {result ? (
            <UrlResult result={result} onReset={handleReset} />
          ) : (
            <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with React + NestJS</p>
      </footer>
    </div>
  );
}

export default App;
