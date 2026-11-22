import React, { useState } from 'react';
import { Search, MapPin, RefreshCw } from 'lucide-react';
import { CityLocation, PRESET_CITIES, searchCities } from '../../services/geocoding';

interface CitySearchBarProps {
  currentCity: string;
  placeholderText: string;
  onCitySelect: (city: CityLocation) => void;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  currentCity,
  placeholderText,
  onCitySelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length >= 2) {
      setIsSearching(true);
      const results = await searchCities(val);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const selectCity = (city: CityLocation) => {
    onCitySelect(city);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="relative flex-1 max-w-xs md:max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchResults.length > 0 || searchQuery.length >= 2) setShowDropdown(true);
          }}
          placeholder={`${currentCity} • ${placeholderText}`}
          className="w-full pl-9 pr-8 py-2.5 min-h-[44px] text-sm rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        {isSearching && (
          <RefreshCw className="absolute right-3 top-3 w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 mt-1.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto"
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="px-3 py-1 text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Presets & Results
          </div>
          {(searchResults.length > 0 ? searchResults : PRESET_CITIES).map((c) => (
            <button
              key={`${c.name}-${c.latitude}-${c.longitude}`}
              type="button"
              onClick={() => selectCity(c)}
              className="w-full text-left px-3 py-2.5 min-h-[44px] flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-slate-400">({c.country})</span>
              </span>
              <span className="text-xs text-slate-400">{c.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
