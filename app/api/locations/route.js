import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCountries } from "@countrystatecity/countries";
import { getCountryCallingCode } from "libphonenumber-js";

const dataRoot = join(process.cwd(), "node_modules", "@countrystatecity", "countries", "dist", "data");

async function getCountryDataDirectory(countryCode) {
  const entries = await readdir(dataRoot, { withFileTypes: true });
  return entries.find((entry) => entry.isDirectory() && entry.name.endsWith(`-${countryCode}`))?.name;
}

async function readLocationData(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  try {
    if (type === "countries") {
      const countries = await getCountries();
      return json({ countries: countries.map(({ id, name, iso2, emoji }) => {
        let callingCode = "";
        try { callingCode = `+${getCountryCallingCode(iso2)}`; } catch {}
        return { id, name, iso2, callingCode, emoji };
      }) });
    }

    const countryCode = (url.searchParams.get("country") || "").toUpperCase();
    const countries = await getCountries();
    const country = countries.find((entry) => entry.iso2 === countryCode);
    if (!country) return json({ message: "Select a valid country." }, 400);

    if (type === "states") {
      const directory = await getCountryDataDirectory(countryCode);
      const states = directory ? await readLocationData(join(dataRoot, directory, "states.json")) : [];
      return json({ states: states.map(({ id, name, iso2 }) => ({ id, name, iso2 })) });
    }

    if (type === "cities") {
      const stateCode = (url.searchParams.get("state") || "").toUpperCase();
      const directory = await getCountryDataDirectory(countryCode);
      const states = directory ? await readLocationData(join(dataRoot, directory, "states.json")) : [];
      if (states.length && !stateCode) return json({ message: "Select a state or province first." }, 400);
      if (stateCode && !states.some((state) => state.iso2 === stateCode)) return json({ message: "The selected state does not belong to this country." }, 400);
      let cities = [];
      if (directory && stateCode) {
        const stateDirectories = await readdir(join(dataRoot, directory), { withFileTypes: true });
        const stateDirectory = stateDirectories.find((entry) => entry.isDirectory() && entry.name.endsWith(`-${stateCode}`));
        if (stateDirectory) cities = await readLocationData(join(dataRoot, directory, stateDirectory.name, "cities.json"));
      } else if (directory) {
        cities = await readLocationData(join(dataRoot, directory, "cities.json"));
      }
      return json({ cities: cities.map(({ id, name }) => ({ id, name })) });
    }

    return json({ message: "Choose countries, states, or cities." }, 400);
  } catch {
    return json({ message: "Location data is temporarily unavailable." }, 503);
  }
}
