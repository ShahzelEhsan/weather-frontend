// pages/resources.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

interface Article {
  id: number;
  title: string;
  url: string;
  description: string;
  published_at: string;
  tag_list: string[];
}

export default function Resources() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/devto');
        setArticles(res.data);
      } catch (err) {
        console.error('Error loading articles', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Head>
        <title>Developer Weather Resources</title>
        <meta
          name="description"
          content="Curated Dev.to articles about weather, JavaScript, and APIs."
        />
      </Head>

      <h1 className="text-2xl font-bold mb-4">🌐 Developer Weather Resources</h1>
      <p className="text-gray-600 mb-6">
        Curated from Dev.to for tags like weather, JavaScript, and API
      </p>

      {loading && <p>Loading articles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="text-gray-500">No articles found at the moment.</p>
      )}

      {!loading &&
        !error &&
        articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded p-4 mb-4 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-1">
              {new Date(article.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-700">{article.description}</p>
            <p className="mt-2 text-xs text-gray-400">
              Tags: {article.tag_list.join(', ')}
            </p>
          </a>
        ))}
    </div>
  );
}
