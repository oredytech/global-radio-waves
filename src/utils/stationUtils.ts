
export const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

export const findStationBySlug = (stations: any[], slug: string): any =>
  stations.find((s) => generateSlug(s.name) === slug);

export const getCountryFlag = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
