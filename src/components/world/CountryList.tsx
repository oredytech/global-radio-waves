
import React from "react";
import { CountryInfo } from "@/services/radioService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CountryListProps {
  countries: Array<CountryInfo & { continent?: string }>;
  onCountryClick: (country: CountryInfo) => void;
  getColorClass: (country: CountryInfo & { continent?: string }) => string;
}

const CountryList: React.FC<CountryListProps> = ({ countries, onCountryClick, getColorClass }) => {
  // Group countries by first letter for alphabetical sections
  const groupedCountries = countries.reduce((acc, country) => {
    const firstLetter = country.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(country);
    return acc;
  }, {} as Record<string, Array<CountryInfo & { continent?: string }>>);

  // Get sorted keys
  const sortedLetters = Object.keys(groupedCountries).sort();

  return (
    <div className="space-y-6">
      {sortedLetters.map(letter => (
        <div key={letter} className="space-y-2">
          <h3 className="font-bold text-xl text-white">{letter}</h3>
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Drapeau</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead className="text-right">Stations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedCountries[letter].map((country) => {
                  const countryCode = country.code?.toUpperCase();
                  const flagUrl = countryCode ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png` : null;
                  
                  return (
                    <TableRow 
                      key={country.name}
                      onClick={() => onCountryClick(country)}
                      className={`cursor-pointer hover:bg-white/5 ${getColorClass(country)} bg-opacity-20`}
                    >
                      <TableCell className="font-medium w-12">
                        {flagUrl ? (
                          <div className="w-8 h-5 overflow-hidden rounded">
                            <img 
                              src={flagUrl}
                              alt={`Drapeau ${country.name}`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                            {country.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{country.name}</TableCell>
                      <TableCell className="text-right">{country.stationCount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountryList;
