"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type SearchBarProps = {
  action?: string;
  defaultValue?: string;
  dir?: "ltr" | "rtl";
  hiddenFields?: Record<string, string | undefined>;
  labels?: {
    clear?: string;
    placeholder?: string;
    submit?: string;
  };
};

export function SearchBar({
  action,
  defaultValue = "",
  dir = "ltr",
  hiddenFields,
  labels
}: SearchBarProps) {
  const inputId = useId();
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const clearLabel = labels?.clear ?? "Clear search";
  const placeholder = labels?.placeholder ?? "Search";
  const submitLabel = labels?.submit ?? "Search";

  function clearSearch() {
    setValue("");
    if (action) {
      const searchParams = new globalThis.URLSearchParams();
      for (const [key, fieldValue] of Object.entries(hiddenFields ?? {})) {
        if (fieldValue) searchParams.set(key, fieldValue);
      }
      const query = searchParams.toString();
      router.push(query ? `${action}?${query}` : action);
    }
  }

  return (
    <form action={action} className="search-bar" dir={dir} role="search">
      {Object.entries(hiddenFields ?? {}).map(([name, fieldValue]) =>
        fieldValue ? <input key={name} name={name} type="hidden" value={fieldValue} /> : null
      )}
      <label className="visually-hidden" htmlFor={inputId}>
        {submitLabel}
      </label>
      <Search aria-hidden="true" className="search-bar-icon" size={19} />
      <input
        autoComplete="off"
        id={inputId}
        name="q"
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value ? (
        <button aria-label={clearLabel} className="search-bar-clear" onClick={clearSearch} type="button">
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
      <button className="search-bar-submit" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
