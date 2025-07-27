export const ERROR_MESSAGES = {
    CITY_NOT_FOUND: (cityName: string): string => `City with name ${cityName}`,
    CITY_ALREADY_EXISTS: (cityName: string, regionName: string): string =>
        `City with name ${cityName} already exists in region ${regionName}`,
    CITY_NOT_FOUND_BY_ID: (id: string): string => `City with ID ${id} not found`,

    REGION_NOT_FOUND: (regionName: string, countryName: string): string =>
        `Region with name ${regionName} does not exist in country ${countryName}`,
    REGION_ALREADY_EXISTS: (regionName: string, countryName: string): string =>
        `Region with name ${regionName} already exists in country ${countryName}`,
    REGION_NOT_FOUND_BY_ID: (id: string): string => `Region with ID ${id} not found`,

    COUNTRY_NOT_FOUND: (countryName: string): string =>
        `Country with name ${countryName} does not exist`,
    COUNTRY_ALREADY_EXISTS: (countryName: string): string =>
        `Country with name ${countryName} already exists`,
    COUNTRY_REQUIRED_FOR_REGION: 'A country is required for the region.',
    COUNTRY_NOT_FOUND_BY_ID: (id: string): string => `Country with ID ${id} not found`,

    ADDRESS_NOT_FOUND: (addressId: string): string => `Address with ID ${addressId} not found`,
    ADDRESS_ALREADY_EXISTS: (addressId: string): string =>
        `Address with ID ${addressId} already exists`,

    BOTH_REGION_AND_COUNTRY_REQUIRED: 'Both region_name and country_name must be provided together',
};
