// components/SearchBar.tsx
import React from 'react';
import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (trimmedCity) {
      onSearch(trimmedCity);
      setCity('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="search-form"
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
    >
      <input
        type="text"
        aria-label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto flex-1"
      />
      <button
        type="submit"
        disabled={!city.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Search
      </button>
    </form>
  );
}

