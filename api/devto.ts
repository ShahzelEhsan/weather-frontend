import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Article = {
  id: number;
  title: string;
  url: string;
  // add other article fields as needed
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Article[] | { error: string }>) {
  try {
    const response = await axios.get<Article[]>(
      'https://dev.to/api/articles?per_page=10&tag=weather,javascript,api'
    );

    // Optional: Set cache headers
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Dev.to fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}

