const fetch = require("node-fetch");

const countryCodes = [
  "AU",
  "AR",
  "AU",
  "AT",
  "BE",
  "BO",
  "BR",
  "BG",
  "CA",
  "CL",
  "CO",
  "CR",
  "HR",
  "CZ",
  "DK",
  "EC",
  "EG",
  "FI",
  "FR",
  "DE",
  "GR",
  "GT",
  "HU",
  "IN",
  "ID",
  "IE",
  "IT",
  "JP",
  "MY",
  "MX",
  "NL",
  "NZ",
  "NO",
  "PK",
  "PE",
  "PH",
  "PL",
  "PT",
  "RO",
  "RU",
  "SA",
  "SG",
  "SK",
  "ZA",
  "KR",
  "ES",
  "SE",
  "CH",
  "TW",
  "TH",
  "TR",
  "AE",
  "UK",
  "US",
  "VE"
];

const countries = [
  "Australia",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Bolivia",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Ecuador",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Guatemala",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Italy",
  "Japan",
  "Malaysia",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "Slovakia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Venezuela"
]

const data = {};

async function fetchData() {
  try {
    const results = await Promise.all(countryCodes.map((countryCode => 
      fetch("https://apis.justwatch.com/graphql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "app-version": "3.8.2-web-web",
          "content-type": "application/json",
          "device-id": "Wyv-07PEEe6iABbP7Vc12g",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        "referrer": "https://www.justwatch.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
          "operationName": "GetUrlTitleDetails",
          "variables": {
              "platform": "WEB",
              "fullPath": "/br/serie/the-walking-dead-daryl-dixon",
              "country": countryCode,
          },
          "query": `
            query GetUrlTitleDetails(
              $fullPath: String!
              $country: Country!
              $platform: Platform! = WEB
            ) {
                urlV2(fullPath: $fullPath) {
                node {
                  ... on MovieOrShowOrSeason {
                    offers(country: $country, platform: $platform) {
                      monetizationType
                      elementCount
                      package {
                        clearName
                      }
                    }
                  }
                }
              }
            }
          `
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      })
    )));
    for(result of results) {
      const json = await result.json();
      const offers = json.data.urlV2.node.offers;
      if(offers.length)
        data[countries[results.indexOf(result)]] = prettifyOffers(offers);
    }
  } catch(e) {
    console.log(e);
  }
}

function getTypeByMonetizationType(type) {
  if(type === "FLATRATE") return "Streamar";
  else if(type === "BUY") return "Comprar";
  else if(type === "ADS") return "Streamar com anúncios";
  else if(type === "FREE") return "Streamar de graça";
  return "Tipo desconhecido: " + type;
}

function prettifyOffers(offers) {
  const formattedOffers = [];
  offers.forEach((offer) => {
    const formattedOffer = {
      tipo: getTypeByMonetizationType(offer.monetizationType),
      plataforma: offer.package.clearName,
    };
    if(!formattedOffers.some(fm => fm.tipo === formattedOffer.tipo && fm.plataforma === formattedOffer.plataforma)) {
      formattedOffers.push(formattedOffer);
    }
  })
  return formattedOffers;
}

fetchData().then(() => console.log(data));
