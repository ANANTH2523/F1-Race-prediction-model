// Official 2026 F1 driver grid - Confirmed December 2024
// 11 teams, 22 drivers including new Cadillac F1 Team entry
export const F1_2026_DRIVERS = [
  "George Russell", "Andrea Kimi Antonelli",    // Mercedes
  "Max Verstappen", "Isack Hadjar",              // Red Bull
  "Charles Leclerc", "Lewis Hamilton",           // Ferrari
  "Lando Norris", "Oscar Piastri",               // McLaren
  "Fernando Alonso", "Lance Stroll",             // Aston Martin
  "Pierre Gasly", "Franco Colapinto",            // Alpine
  "Alexander Albon", "Carlos Sainz",             // Williams
  "Nico Hulkenberg", "Gabriel Bortoleto",        // Audi (formerly Kick Sauber)
  "Liam Lawson", "Arvid Lindblad",               // Racing Bulls
  "Oliver Bearman", "Esteban Ocon",              // Haas
  "Sergio Perez", "Valtteri Bottas",             // Cadillac (NEW)
];

export const RACE_CIRCUITS = [
    "Albert Park Circuit, Melbourne",
    "Shanghai International Circuit, China (Sprint)",
    "Shanghai International Circuit, China",
    "Suzuka International Racing Course, Japan",
    "Bahrain International Circuit, Sakhir",
    "Jeddah Corniche Circuit, Saudi Arabia",
    "Miami International Autodrome, USA (Sprint)",
    "Miami International Autodrome, USA",
    "Imola Circuit, Italy",
    "Circuit de Monaco, Monaco",
    "Circuit de Barcelona-Catalunya, Spain",
    "Circuit Gilles Villeneuve, Montreal",
    "Red Bull Ring, Spielberg",
    "Silverstone Circuit, UK",
    "Circuit de Spa-Francorchamps, Belgium(Sprint)",
    "Circuit de Spa-Francorchamps, Belgium",
    "Hungaroring, Budapest",
    "Circuit Zandvoort, Netherlands",
    "Monza Circuit, Italy",
    "Baku City Circuit, Azerbaijan",
    "Marina Bay Street Circuit, Singapore",
    "Circuit of the Americas, Austin (Sprint)",
    "Circuit of the Americas, Austin",
    "Autódromo Hermanos Rodríguez, Mexico City",
    "Interlagos Circuit, São Paulo (Sprint)",
    "Interlagos Circuit, São Paulo",
    "Las Vegas Strip Circuit, USA",
    "Lusail International Circuit, Qatar (Sprint)",
    "Lusail International Circuit, Qatar",
    "Yas Marina Circuit, Abu Dhabi",
  ];
  
  export const F1_2026_CALENDAR = [
    { name: "Australian Grand Prix", circuit: "Albert Park Circuit", date: "Mar 14-16", startDate: "2026-03-16" },
    { name: "Chinese Grand Prix", circuit: "Shanghai International Circuit", date: "Mar 21-23", startDate: "2026-03-23" },
    { name: "Japanese Grand Prix", circuit: "Suzuka Circuit", date: "Apr 4-6", startDate: "2026-04-06" },
    { name: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: "Apr 11-13", startDate: "2026-04-13" },
    { name: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", date: "Apr 18-20", startDate: "2026-04-20" },
    { name: "Miami Grand Prix", circuit: "Miami International Autodrome", date: "May 2-4", startDate: "2026-05-04" },
    { name: "Emilia Romagna Grand Prix", circuit: "Imola Circuit", date: "May 16-18", startDate: "2026-05-18" },
    { name: "Monaco Grand Prix", circuit: "Circuit de Monaco", date: "May 23-25", startDate: "2026-05-25" },
    { name: "Spanish Grand Prix", circuit: "Circuit de Barcelona-Catalunya", date: "May 30 - Jun 1", startDate: "2026-06-01" },
    { name: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", date: "Jun 13-15", startDate: "2026-06-15" },
    { name: "Austrian Grand Prix", circuit: "Red Bull Ring", date: "Jun 27-29", startDate: "2026-06-29" },
    { name: "British Grand Prix", circuit: "Silverstone Circuit", date: "Jul 4-6", startDate: "2026-07-06" },
    { name: "Belgian Grand Prix", circuit: "Circuit de Spa-Francorchamps", date: "Jul 25-27", startDate: "2026-07-27" },
    { name: "Hungarian Grand Prix", circuit: "Hungaroring", date: "Aug 1-3", startDate: "2026-08-03" },
    { name: "Dutch Grand Prix", circuit: "Circuit Zandvoort", date: "Aug 29-31", startDate: "2026-08-31" },
    { name: "Italian Grand Prix", circuit: "Monza Circuit", date: "Sep 5-7", startDate: "2026-09-07" },
    { name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", date: "Sep 19-21", startDate: "2026-09-21" },
    { name: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", date: "Oct 3-5", startDate: "2026-10-05" },
    { name: "United States Grand Prix", circuit: "Circuit of the Americas", date: "Oct 17-19", startDate: "2026-10-19" },
    { name: "Mexico City Grand Prix", circuit: "Autódromo Hermanos Rodríguez", date: "Oct 24-26", startDate: "2026-10-26" },
    { name: "São Paulo Grand Prix", circuit: "Interlagos Circuit", date: "Nov 7-9", startDate: "2026-11-09" },
    { name: "Las Vegas Grand Prix", circuit: "Las Vegas Strip Circuit", date: "Nov 20-22", startDate: "2026-11-22" },
    { name: "Qatar Grand Prix", circuit: "Lusail International Circuit", date: "Nov 28-30", startDate: "2026-11-30" },
    { name: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", date: "Dec 5-7", startDate: "2026-12-07" },
  ];
  
  
  // Maps each team to its accent colour (border and background). Updated for 2026 season.
  // Includes Cadillac F1 Team and Audi F1 Team rebrand.
  export const TEAM_COLORS: { [key: string]: { border: string; hex: string; bg: string } } = {
    "Mercedes-AMG Petronas Formula One Team": { border: "border-cyan-400", hex: "#27F4D2", bg: "bg-cyan-400" },
    "Oracle Red Bull Racing": { border: "border-indigo-600", hex: "#3671C6", bg: "bg-indigo-600" },
    "Scuderia Ferrari HP": { border: "border-red-600", hex: "#F91536", bg: "bg-red-600" },
    "McLaren Formula 1 Team": { border: "border-orange-500", hex: "#F58020", bg: "bg-orange-500" },
    "Aston Martin Aramco Formula One Team": { border: "border-emerald-600", hex: "#229971", bg: "bg-emerald-600" },
    "BWT Alpine F1 Team": { border: "border-pink-500", hex: "#FD4BC7", bg: "bg-pink-500" },
    "Williams Racing": { border: "border-blue-500", hex: "#64C4FF", bg: "bg-blue-500" },
    "Visa Cash App RB Formula One Team": { border: "border-blue-700", hex: "#6692FF", bg: "bg-blue-700" },
    "Audi F1 Team": { border: "border-red-500", hex: "#F50537", bg: "bg-red-500" },
    "MoneyGram Haas F1 Team": { border: "border-gray-400", hex: "#B6BABD", bg: "bg-gray-400" },
    "Cadillac F1 Team": { border: "border-purple-600", hex: "#9333EA", bg: "bg-purple-600" },
    // Synonyms for AI outputs (old and shortened names)
    "Racing Bulls": { border: "border-blue-700", hex: "#6692FF", bg: "bg-blue-700" },
    "Kick Sauber": { border: "border-red-500", hex: "#F50537", bg: "bg-red-500" },
    "Sauber": { border: "border-red-500", hex: "#F50537", bg: "bg-red-500" },
    "Stake F1 Team Kick Sauber": { border: "border-red-500", hex: "#F50537", bg: "bg-red-500" },
    "Visa Cash App Racing Bulls Formula One Team": { border: "border-blue-700", hex: "#6692FF", bg: "bg-blue-700" },
    "Visa Cash App RB": { border: "border-blue-700", hex: "#6692FF", bg: "bg-blue-700" },
    "Cadillac": { border: "border-purple-600", hex: "#9333EA", bg: "bg-purple-600" },
    "Audi": { border: "border-red-500", hex: "#F50537", bg: "bg-red-500" },
  };
  
  export const F1_2026_TEAMS = [
    "Mercedes-AMG Petronas Formula One Team",
    "Oracle Red Bull Racing",
    "Scuderia Ferrari HP",
    "McLaren Formula 1 Team",
    "Aston Martin Aramco Formula One Team",
    "BWT Alpine F1 Team",
    "Williams Racing",
    "Audi F1 Team",
    "Visa Cash App RB Formula One Team",
    "MoneyGram Haas F1 Team",
    "Cadillac F1 Team",
  ];
  
  const IMG_BASE_URL = "https://raw.githubusercontent.com/f1-results/f1-results-app/main/src/img";
  
  // 2026 team logos (using 2024 assets where official 2026 logos aren't available)
  export const TEAM_LOGOS: { [key: string]: string } = {
    "Mercedes-AMG Petronas Formula One Team": `${IMG_BASE_URL}/teams/2024/mercedes.png`,
    "Oracle Red Bull Racing": `${IMG_BASE_URL}/teams/2024/red-bull.png`,
    "Scuderia Ferrari HP": `${IMG_BASE_URL}/teams/2024/ferrari.png`,
    "McLaren Formula 1 Team": `${IMG_BASE_URL}/teams/2024/mclaren.png`,
    "Aston Martin Aramco Formula One Team": `${IMG_BASE_URL}/teams/2024/aston-martin.png`,
    "BWT Alpine F1 Team": `${IMG_BASE_URL}/teams/2024/alpine.png`,
    "Williams Racing": `${IMG_BASE_URL}/teams/2024/williams.png`,
    "Visa Cash App RB Formula One Team": `${IMG_BASE_URL}/teams/2024/rb.png`,
    "Audi F1 Team": `${IMG_BASE_URL}/teams/2024/sauber.png`,
    "MoneyGram Haas F1 Team": `${IMG_BASE_URL}/teams/2024/haas.png`,
    "Cadillac F1 Team": `${IMG_BASE_URL}/teams/2024/haas.png`,
    // synonym keys
    "Racing Bulls": `${IMG_BASE_URL}/teams/2024/rb.png`,
    "Kick Sauber": `${IMG_BASE_URL}/teams/2024/sauber.png`,
    "Sauber": `${IMG_BASE_URL}/teams/2024/sauber.png`,
    "Stake F1 Team Kick Sauber": `${IMG_BASE_URL}/teams/2024/sauber.png`,
    "Visa Cash App Racing Bulls Formula One Team": `${IMG_BASE_URL}/teams/2024/rb.png`,
    "Visa Cash App RB": `${IMG_BASE_URL}/teams/2024/rb.png`,
    "Cadillac": `${IMG_BASE_URL}/teams/2024/haas.png`,
    "Audi": `${IMG_BASE_URL}/teams/2024/sauber.png`,
  };

  // 2025 F1 Championship Standings (as of Dec 4, 2025 - Pre-Abu Dhabi)
  export const F1_WDC_STANDINGS = [
    { rank: 1, driver: "Lando Norris", team: "McLaren Formula 1 Team", points: 408 },
    { rank: 2, driver: "Max Verstappen", team: "Oracle Red Bull Racing", points: 396 },
    { rank: 3, driver: "Oscar Piastri", team: "McLaren Formula 1 Team", points: 392 },
    { rank: 4, driver: "Charles Leclerc", team: "Scuderia Ferrari HP", points: 305 },
    { rank: 5, driver: "Lewis Hamilton", team: "Scuderia Ferrari HP", points: 215 },
    { rank: 6, driver: "George Russell", team: "Mercedes-AMG Petronas Formula One Team", points: 198 },
    { rank: 7, driver: "Carlos Sainz", team: "Williams Racing", points: 195 },
    { rank: 8, driver: "Fernando Alonso", team: "Aston Martin Aramco Formula One Team", points: 85 },
    { rank: 9, driver: "Pierre Gasly", team: "BWT Alpine F1 Team", points: 62 },
    { rank: 10, driver: "Liam Lawson", team: "Oracle Red Bull Racing", points: 58 },
    { rank: 11, driver: "Yuki Tsunoda", team: "Visa Cash App RB Formula One Team", points: 45 },
    { rank: 12, driver: "Nico Hulkenberg", team: "Kick Sauber", points: 38 },
    { rank: 13, driver: "Lance Stroll", team: "Aston Martin Aramco Formula One Team", points: 35 },
    { rank: 14, driver: "Esteban Ocon", team: "MoneyGram Haas F1 Team", points: 28 },
    { rank: 15, driver: "Alexander Albon", team: "Williams Racing", points: 22 },
    { rank: 16, driver: "Isack Hadjar", team: "Visa Cash App RB Formula One Team", points: 18 },
    { rank: 17, driver: "Oliver Bearman", team: "MoneyGram Haas F1 Team", points: 12 },
    { rank: 18, driver: "Franco Colapinto", team: "Williams Racing", points: 10 },
    { rank: 19, driver: "Andrea Kimi Antonelli", team: "Mercedes-AMG Petronas Formula One Team", points: 6 },
    { rank: 20, driver: "Jack Doohan", team: "BWT Alpine F1 Team", points: 2 },
    { rank: 21, driver: "Gabriel Bortoleto", team: "Kick Sauber", points: 0 },
  ];