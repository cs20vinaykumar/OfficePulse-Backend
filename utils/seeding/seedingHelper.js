import Country from "../../models/country.js";
import Province from "../../models/province.js";
import City from "../../models/city.js";

import countriesResources from "../seeding/seedingResources/countries.json" assert { type: "json" };
import provinceResources from "../seeding/seedingResources/provinces.json" assert { type: "json" };
import cityResources from "../seeding/seedingResources/city.json" assert { type: "json" };

export const countryData = async () => {
  try {
    await Country.insertMany(countriesResources);
    console.log("countries imported successfully");
  } catch (error) {
    console.error("Error importing countries:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
  }
};

export const provinceData = async () => {
  try {
    await Province.insertMany(provinceResources);
    console.log("Provinces imported successfully");
  } catch (error) {
    console.error("Error importing Provinces:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
  }
};

export const cityData = async () => {
  try {
    await City.insertMany(cityResources);
    console.log("Cities imported successfully");
  } catch (error) {
    console.error("Error importing cities:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
  }
};
