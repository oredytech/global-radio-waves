
export const continents = [
  { name: "Tous", value: "all" },
  { name: "Afrique", value: "africa" },
  { name: "Amérique", value: "america" },
  { name: "Asie", value: "asia" },
  { name: "Europe", value: "europe" },
  { name: "Océanie", value: "oceania" },
];

export const africaCountries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", 
  "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", 
  "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", 
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", 
  "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", 
  "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", 
  "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", 
  "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", 
  "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", 
  "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", 
  "Zambia", "Zimbabwe"];

export const asiaCountries = ["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", 
  "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Cyprus", 
  "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", 
  "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", 
  "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", 
  "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi Arabia", 
  "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", 
  "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates", 
  "Uzbekistan", "Vietnam", "Yemen"];

export const europeCountries = ["Albania", "Andorra", "Austria", "Belarus", 
  "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", 
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", 
  "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", 
  "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", 
  "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", 
  "Switzerland", "Ukraine", "United Kingdom", "Vatican City"];

export const oceaniaCountries = ["Australia", "Fiji", "Kiribati", "Marshall Islands", 
  "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", 
  "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"];

export const getContinentForCountry = (countryName: string): string => {
  if (africaCountries.some(c => countryName.includes(c))) return "africa";
  if (asiaCountries.some(c => countryName.includes(c))) return "asia";
  if (europeCountries.some(c => countryName.includes(c))) return "europe";
  if (oceaniaCountries.some(c => countryName.includes(c))) return "oceania";
  return "america";
};

export const getContinentColor = (continent: string): string => {
  switch (continent) {
    case "africa": return "bg-gradient-to-br from-emerald-400/40 to-emerald-600/40";
    case "america": return "bg-gradient-to-br from-red-400/40 to-red-600/40";
    case "asia": return "bg-gradient-to-br from-yellow-400/40 to-yellow-600/40";
    case "europe": return "bg-gradient-to-br from-blue-400/40 to-blue-600/40";
    case "oceania": return "bg-gradient-to-br from-purple-400/40 to-purple-600/40";
    default: return "bg-gradient-to-br from-gray-400/40 to-gray-600/40";
  }
};
