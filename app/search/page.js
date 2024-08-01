"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { RadioGroup } from "@headlessui/react";
import { ItemCard } from '@/components/ItemCard';
import Link from 'next/link';

export default function Home() {
  "use client";

  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [languageList, setLanguageList] = useState(["en", "de", "fr", "ja"]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleInputChange = async (e) => {
    const newSearchParam = e.target.value;
    setSearchParam(newSearchParam);

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', newSearchParam);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);

    getResults(newSearchParam, 1);
  };

  const getResults = async (searchParam, page) => {
    setLoading(true);

    try {
      const response = await fetch(`api/search?query=${searchParam}&languages=en,de,fr,ja&page=${page}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error('Invalid JSON response');
      }

      setSearchResults(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading search results:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getResults(searchParam, newPage);
  };

  // load the search param from the URL on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('search');
    setSearchParam(searchValue || '');
    getResults(searchValue);
  }, []);

  function Pagination() {
    return (
      <div className="text-center font-semibold flex justify-center gap-4 text-white dark:text-zinc-500">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="disabled:opacity-50 disabled:cursor-not-allowed">
          ←
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="disabled:opacity-50 disabled:cursor-not-allowed">
          →
        </button>
      </div>
    );
  }

  function SearchResults({ results }) {
    if (loading) {
      return (
        <div className="mt-10 container mx-auto text-center font-semibold text-zinc-500 w-full">
          <Pagination />
          {/* display twenty empty item while loading */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto p-4">
            {[...Array(18)].map((_, i) => (
              <ItemCard key={i} currentLanguage={currentLanguage} languageList={languageList} />
            ))}
          </div>
        </div>
      );
    } else if (!results || results == null || Object.keys(results).length === 0) {
      return (
        <div className="mt-10 container mx-auto text-center font-semibold text-zinc-500 w-full">
          No results - did you check your spelling?
        </div>
      );
    } else if (typeof results !== 'object') {
      // if results is not a JSON object, then it's an error
      <div className="mt-10 container mx-auto text-center font-semibold text-zinc-500 w-full">
        Error loading results: {results.error}
      </div>
    }
    else if (typeof results === 'object' && Object.keys(results).length > 0) {
      return (<div className="mt-10 container mx-auto">
        {/* center text with number of results */}
        <div className="text-center font-semibold text-zinc-500 flex justify-center gap-4">
          <Pagination />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-auto p-4">
          {
            Object.entries(searchResults).map(([id, item]) => (
              <ItemCard
                key={id}
                id={id}
                item={item}
                currentLanguage={currentLanguage}
                languageList={languageList}
              />
            ))
          }
        </div>
      </div>);
    } else {
      <div className="mt-10 container mx-auto text-center font-semibold text-zinc-500">
        No results - did you check your spelling?
      </div>
    }
  }

  // base
  return (
    <main className="bg-gradient-to-b from-blue-500 to-blue-900 dark:from-gray-800 dark:to-gray-900 min-h-screen flex items-center justify-center flex-col font-sans bg-fixed bg-cover bg-center pb-10">
      <h1 className="text-4xl font-header text-white mt-10">
        <Link href="/">
          Ishgardian Tools
          <sub className="text-base ml-1">Search (beta)</sub>
        </Link>
      </h1>
      <form
        className="sm:mx-auto mt-10 sm:w-full sm:flex flex-col items-center max-w-screen-sm "
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex w-full flex-row ">
          <input
            type="text"
            className="w-full px-5 py-3 text-zinc-700 bg-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent"
            placeholder="Search..."
            defaultValue={searchParam}
            onChange={handleInputChange}
          />
        </div>

        <RadioGroup
          value={currentLanguage}
          onChange={setCurrentLanguage}
          className="mt-4 flex flex-row justify-center sm:justify-between"
        >
          <RadioGroup.Label className="sr-only">Language</RadioGroup.Label>
          <div className="flex flex-row space-x-2">
            {languageList.map((language) => (
              <RadioGroup.Option key={language} value={language}>
                {({ checked }) => (
                  <button
                    className={
                      "w-10 h-10 block mr-2 mb-2 text-xl font-mono font-bold text-zinc-900 focus:outline-none bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700" +
                      (checked
                        ? " underline underline-offset-4 decoration-2		"
                        : "")
                    }
                  >
                    {language.toUpperCase().charAt(0)}
                  </button>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </form>
      <SearchResults results={searchResults} />
    </main>
  )
}
