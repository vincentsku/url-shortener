import { useState } from 'react';

import { UrlResponse } from '../types/url';
import styles from './UrlResult.module.css';

interface UrlResultProps {
  result: UrlResponse;
  onReset: () => void;
}

export function UrlResult({ result, onReset }: UrlResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.result}>
      <div className={styles.successIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className={styles.title}>Your short URL is ready!</h3>

      <div className={styles.urlBox}>
        <a
          href={result.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shortUrl}
        >
          {result.shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div className={styles.originalUrl}>
        <span className={styles.label}>Original URL:</span>
        <a
          href={result.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.original}
        >
          {result.originalUrl}
        </a>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{result.clickCount}</span>
          <span className={styles.statLabel}>Clicks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {new Date(result.createdAt).toLocaleDateString()}
          </span>
          <span className={styles.statLabel}>Created</span>
        </div>
      </div>

      <button onClick={onReset} className={styles.resetButton}>
        Shorten another URL
      </button>
    </div>
  );
}
