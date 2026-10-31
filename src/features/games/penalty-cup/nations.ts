import type { Nation } from './types';

// Frozen factual data. Match results and generic athletes are original gameplay.
export const dataVersion = 'world-cup-2026.2026-06-11.v1';
export const sources = {
 teams: 'https://www.ussoccer.com/stories/2026/05/usmnt/which-countries-are-competing-in-fifa-world-cup-usa-mexico-canada',
 regulations: 'https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf',
 rankings: 'https://wildstat.com/p/7001/ddate/2026-06-11',
 rankingDate: '2026-06-11',
 rankingConfirmation: 'https://ar.fifa.com/fifa-rankings/world-ranking/men/news/argentina-reclaim-top-spot-mens-world-ranking-fifa-coca-cola'
} as const;
export const groups = 'ABCDEFGHIJKL'.split('');
export const nations: Nation[] = [
  {
    "id": "MEX",
    "name": "Mexico",
    "flag": "MX",
    "group": "A",
    "rank": 14,
    "primary": "#006847",
    "secondary": "#ffffff"
  },
  {
    "id": "RSA",
    "name": "South Africa",
    "flag": "ZA",
    "group": "A",
    "rank": 60,
    "primary": "#e6be34",
    "secondary": "#12643a"
  },
  {
    "id": "KOR",
    "name": "South Korea",
    "flag": "KR",
    "group": "A",
    "rank": 25,
    "primary": "#d83d4b",
    "secondary": "#ffffff"
  },
  {
    "id": "CZE",
    "name": "Czechia",
    "flag": "CZ",
    "group": "A",
    "rank": 40,
    "primary": "#bb2336",
    "secondary": "#1a3975"
  },
  {
    "id": "CAN",
    "name": "Canada",
    "flag": "CA",
    "group": "B",
    "rank": 30,
    "primary": "#d81c30",
    "secondary": "#ffffff"
  },
  {
    "id": "BIH",
    "name": "Bosnia and Herzegovina",
    "flag": "BA",
    "group": "B",
    "rank": 64,
    "primary": "#184ca6",
    "secondary": "#efc951"
  },
  {
    "id": "QAT",
    "name": "Qatar",
    "flag": "QA",
    "group": "B",
    "rank": 56,
    "primary": "#7d233e",
    "secondary": "#ffffff"
  },
  {
    "id": "SUI",
    "name": "Switzerland",
    "flag": "CH",
    "group": "B",
    "rank": 19,
    "primary": "#d92835",
    "secondary": "#ffffff"
  },
  {
    "id": "BRA",
    "name": "Brazil",
    "flag": "BR",
    "group": "C",
    "rank": 6,
    "primary": "#ecd747",
    "secondary": "#216c47"
  },
  {
    "id": "MAR",
    "name": "Morocco",
    "flag": "MA",
    "group": "C",
    "rank": 7,
    "primary": "#c6323e",
    "secondary": "#16744b"
  },
  {
    "id": "HAI",
    "name": "Haiti",
    "flag": "HT",
    "group": "C",
    "rank": 83,
    "primary": "#284696",
    "secondary": "#c43848"
  },
  {
    "id": "SCO",
    "name": "Scotland",
    "flag": "GB-SCT",
    "group": "C",
    "rank": 42,
    "primary": "#173965",
    "secondary": "#ffffff"
  },
  {
    "id": "USA",
    "name": "United States",
    "flag": "US",
    "group": "D",
    "rank": 17,
    "primary": "#eeeae0",
    "secondary": "#1b3359"
  },
  {
    "id": "PAR",
    "name": "Paraguay",
    "flag": "PY",
    "group": "D",
    "rank": 41,
    "primary": "#e04750",
    "secondary": "#ffffff"
  },
  {
    "id": "AUS",
    "name": "Australia",
    "flag": "AU",
    "group": "D",
    "rank": 27,
    "primary": "#e8c942",
    "secondary": "#21704f"
  },
  {
    "id": "TUR",
    "name": "Türkiye",
    "flag": "TR",
    "group": "D",
    "rank": 22,
    "primary": "#d13741",
    "secondary": "#ffffff"
  },
  {
    "id": "GER",
    "name": "Germany",
    "flag": "DE",
    "group": "E",
    "rank": 10,
    "primary": "#eeeae0",
    "secondary": "#242b2a"
  },
  {
    "id": "CUW",
    "name": "Curaçao",
    "flag": "CW",
    "group": "E",
    "rank": 82,
    "primary": "#2265aa",
    "secondary": "#e6c342"
  },
  {
    "id": "CIV",
    "name": "Ivory Coast",
    "flag": "CI",
    "group": "E",
    "rank": 33,
    "primary": "#e78535",
    "secondary": "#267e49"
  },
  {
    "id": "ECU",
    "name": "Ecuador",
    "flag": "EC",
    "group": "E",
    "rank": 23,
    "primary": "#e5c83f",
    "secondary": "#224492"
  },
  {
    "id": "NED",
    "name": "Netherlands",
    "flag": "NL",
    "group": "F",
    "rank": 8,
    "primary": "#e77b32",
    "secondary": "#272b2d"
  },
  {
    "id": "JPN",
    "name": "Japan",
    "flag": "JP",
    "group": "F",
    "rank": 18,
    "primary": "#234ca4",
    "secondary": "#ffffff"
  },
  {
    "id": "SWE",
    "name": "Sweden",
    "flag": "SE",
    "group": "F",
    "rank": 38,
    "primary": "#e2c83d",
    "secondary": "#284d95"
  },
  {
    "id": "TUN",
    "name": "Tunisia",
    "flag": "TN",
    "group": "F",
    "rank": 45,
    "primary": "#eeeae0",
    "secondary": "#c82c3b"
  },
  {
    "id": "BEL",
    "name": "Belgium",
    "flag": "BE",
    "group": "G",
    "rank": 9,
    "primary": "#b52b38",
    "secondary": "#282a29"
  },
  {
    "id": "EGY",
    "name": "Egypt",
    "flag": "EG",
    "group": "G",
    "rank": 29,
    "primary": "#c83342",
    "secondary": "#eeeeee"
  },
  {
    "id": "IRN",
    "name": "Iran",
    "flag": "IR",
    "group": "G",
    "rank": 20,
    "primary": "#eeeae0",
    "secondary": "#267d54"
  },
  {
    "id": "NZL",
    "name": "New Zealand",
    "flag": "NZ",
    "group": "G",
    "rank": 85,
    "primary": "#eeeae0",
    "secondary": "#222725"
  },
  {
    "id": "ESP",
    "name": "Spain",
    "flag": "ES",
    "group": "H",
    "rank": 2,
    "primary": "#b72f3d",
    "secondary": "#e9c14a"
  },
  {
    "id": "CPV",
    "name": "Cape Verde",
    "flag": "CV",
    "group": "H",
    "rank": 67,
    "primary": "#2453a2",
    "secondary": "#ffffff"
  },
  {
    "id": "KSA",
    "name": "Saudi Arabia",
    "flag": "SA",
    "group": "H",
    "rank": 61,
    "primary": "#1d7850",
    "secondary": "#ffffff"
  },
  {
    "id": "URU",
    "name": "Uruguay",
    "flag": "UY",
    "group": "H",
    "rank": 16,
    "primary": "#80b6cf",
    "secondary": "#1c252d"
  },
  {
    "id": "FRA",
    "name": "France",
    "flag": "FR",
    "group": "I",
    "rank": 3,
    "primary": "#1c3b75",
    "secondary": "#eeeae0"
  },
  {
    "id": "SEN",
    "name": "Senegal",
    "flag": "SN",
    "group": "I",
    "rank": 15,
    "primary": "#eeeae0",
    "secondary": "#208b53"
  },
  {
    "id": "IRQ",
    "name": "Iraq",
    "flag": "IQ",
    "group": "I",
    "rank": 57,
    "primary": "#eeeae0",
    "secondary": "#29845d"
  },
  {
    "id": "NOR",
    "name": "Norway",
    "flag": "NO",
    "group": "I",
    "rank": 31,
    "primary": "#bd3442",
    "secondary": "#22365e"
  },
  {
    "id": "ARG",
    "name": "Argentina",
    "flag": "AR",
    "group": "J",
    "rank": 1,
    "primary": "#80b6d5",
    "secondary": "#eeeae0"
  },
  {
    "id": "ALG",
    "name": "Algeria",
    "flag": "DZ",
    "group": "J",
    "rank": 28,
    "primary": "#eeeae0",
    "secondary": "#28774d"
  },
  {
    "id": "AUT",
    "name": "Austria",
    "flag": "AT",
    "group": "J",
    "rank": 24,
    "primary": "#ce3342",
    "secondary": "#ffffff"
  },
  {
    "id": "JOR",
    "name": "Jordan",
    "flag": "JO",
    "group": "J",
    "rank": 63,
    "primary": "#d33842",
    "secondary": "#ffffff"
  },
  {
    "id": "POR",
    "name": "Portugal",
    "flag": "PT",
    "group": "K",
    "rank": 5,
    "primary": "#a72b3e",
    "secondary": "#28624c"
  },
  {
    "id": "COD",
    "name": "Congo DR",
    "flag": "CD",
    "group": "K",
    "rank": 46,
    "primary": "#438bd2",
    "secondary": "#e9d33f"
  },
  {
    "id": "UZB",
    "name": "Uzbekistan",
    "flag": "UZ",
    "group": "K",
    "rank": 50,
    "primary": "#eeeae0",
    "secondary": "#3277aa"
  },
  {
    "id": "COL",
    "name": "Colombia",
    "flag": "CO",
    "group": "K",
    "rank": 13,
    "primary": "#e6cb46",
    "secondary": "#293e76"
  },
  {
    "id": "ENG",
    "name": "England",
    "flag": "GB-ENG",
    "group": "L",
    "rank": 4,
    "primary": "#eeeae0",
    "secondary": "#bb283c"
  },
  {
    "id": "CRO",
    "name": "Croatia",
    "flag": "HR",
    "group": "L",
    "rank": 11,
    "primary": "#eeeae0",
    "secondary": "#c93142"
  },
  {
    "id": "GHA",
    "name": "Ghana",
    "flag": "GH",
    "group": "L",
    "rank": 73,
    "primary": "#eeeae0",
    "secondary": "#282b2a"
  },
  {
    "id": "PAN",
    "name": "Panama",
    "flag": "PA",
    "group": "L",
    "rank": 34,
    "primary": "#d33a45",
    "secondary": "#ffffff"
  }
];
