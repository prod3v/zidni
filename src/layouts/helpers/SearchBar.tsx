import dateFormat from "@/lib/utils/dateFormat";
import { humanize, slugify } from "@/lib/utils/textConverter";
import Fuse from "fuse.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiCalendarEdit, BiCategoryAlt } from "react-icons/bi";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";

export type SearchItem = {
  slug: string;
  data: any;
  content: any;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

const MAX_RESULTS = 20;

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const clearSearch = () => {
    setInputVal("");
    inputRef.current?.focus();
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: [
          { name: "data.title", weight: 3 },
          { name: "data.categories", weight: 2 },
          { name: "data.tags", weight: 1.5 },
          { name: "data.description", weight: 1 },
        ],
        includeMatches: true,
        includeScore: true,
        minMatchCharLength: 2,
        threshold: 0.3,
        ignoreLocation: true,
        useExtendedSearch: true,
      }),
    [searchList],
  );

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = inputVal.length > 1
      ? fuse.search(inputVal, { limit: MAX_RESULTS }).filter((r) => (r.score ?? 1) < 0.3)
      : [];
    setSearchResults(inputResult);

    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  const hasQuery = inputVal.length > 1;
  const resultCount = searchResults?.length || 0;

  return (
    <div className="min-h-[50vh]">
      {/* Search header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold text-dark mb-3">البحث في المقالات</h1>
        <p className="text-text/70 mb-8">
          ابحث في أكثر من {searchList.length} مقالة تعليمية
        </p>

        {/* Search input */}
        <div className="relative group">
          <span className="absolute top-1/2 start-4 -translate-y-1/2 text-text/40 group-focus-within:text-primary transition-colors">
            <IoSearchOutline className="h-5 w-5" />
          </span>
          <input
            className="w-full rounded-xl border-2 border-transparent bg-gray-100 py-4 ps-12 pe-12 text-base text-dark placeholder:text-text/40 focus:bg-white focus:border-primary/20 focus:ring-0 focus:outline-none transition-all outline-none"
            placeholder="اكتب للبحث... (مثال: بايثون، مشروع تخرج، OOP)"
            type="text"
            name="search"
            value={inputVal}
            onChange={handleChange}
            autoComplete="off"
            autoFocus
            ref={inputRef}
          />
          {inputVal.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute top-1/2 end-4 -translate-y-1/2 text-text/40 hover:text-dark transition-colors"
              aria-label="مسح البحث"
            >
              <IoCloseCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results status */}
      {hasQuery && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-text/70">
              {resultCount > 0 ? (
                <>
                  تم العثور على{" "}
                  <span className="font-semibold text-dark">{resultCount}</span>{" "}
                  {resultCount === 1 ? "نتيجة" : "نتائج"} لـ &laquo;{inputVal}
                  &raquo;
                </>
              ) : (
                <>
                  لا توجد نتائج لـ &laquo;{inputVal}&raquo;
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* No results state */}
      {hasQuery && resultCount === 0 && (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-6xl mb-4 opacity-30">🔍</div>
          <h3 className="text-lg font-semibold text-dark mb-2">
            لم نجد ما تبحث عنه
          </h3>
          <p className="text-text/60 text-sm">
            جرّب كلمات مختلفة أو أقصر، مثل &laquo;جافا&raquo; بدلاً من
            &laquo;برمجة جافا للمبتدئين&raquo;
          </p>
        </div>
      )}

      {/* Empty state - before searching */}
      {!hasQuery && (
        <div className="max-w-md mx-auto text-center py-8">
          <p className="text-text/50 text-sm">
            ابدأ بالكتابة للبحث في العناوين والتصنيفات والوسوم
          </p>
        </div>
      )}

      {/* Results list */}
      {hasQuery && resultCount > 0 && (
        <div className="max-w-2xl mx-auto space-y-4">
          {searchResults?.map(({ item }) => (
            <a
              key={item.slug}
              href={`/${item.slug}`}
              className="block rounded-xl border border-border bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                {item.data.image && (
                  <div className="hidden sm:block flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      src={item.data.image}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-dark group-hover:text-primary transition-colors mb-1.5 line-clamp-1">
                    {item.data.title}
                  </h3>

                  {item.data.description && (
                    <p className="text-sm text-text/70 line-clamp-2 mb-3">
                      {item.data.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-text/50">
                    <span className="flex items-center gap-1">
                      <BiCalendarEdit className="h-3.5 w-3.5" />
                      {dateFormat(item.data.date)}
                    </span>
                    {item.data.categories?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <BiCategoryAlt className="h-3.5 w-3.5" />
                        {item.data.categories
                          .map((c: string) => humanize(c))
                          .join("، ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}

        </div>
      )}
    </div>
  );
}
