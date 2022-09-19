import fetch from 'node-fetch';

export const request = async (url, method, params) => {
  const response = await fetch(url, {
    method: method,
    body: params
  })

  const result = await response.json();
  return result;
}

export const format_response = async (stored_results) => {
  const formatted = stored_results.features[0].properties?.formatted;
  const address_line1 = stored_results?.features[0].properties?.address_line1;
  const address_line2 = stored_results?.features[0].properties?.address_line2;
  const country = stored_results?.features[0].properties?.country;
  const street = stored_results.features[0].properties?.street;
  const postcode = stored_results.features[0].properties?.postcode;

  const doc =
    [
      formatted,
      address_line1,
      address_line2,
      country,
      street,
      postcode
    ];

  return doc;
}

export const rangeDates = async () => {
  const start_date = new Date();
  const end_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate() + 7)

  return { start_date, end_date }
}

export const getDatesInRange = async (startDate, endDate) => {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}