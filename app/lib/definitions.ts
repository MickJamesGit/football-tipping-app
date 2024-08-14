export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: string;
  alias: string;
};

export type Session = {
  id: string;
  userId: string;
  expires: string;
  sessionToken: string;
};

export type UserWithoutId = Omit<User, "id">;

export type Team = {
  id: string;
  name: string;
  sport: string;
};

export type TeamWithoutId = Omit<Team, "id">;

export type Game = {
  id: string;
  sport: string;
  round: string;
  home_team_name: string;
  home_team_id: string;
  away_team_name: string;
  away_team_id: string;
  venue: string;
  datetime: string;
  season: string;
  winning_team_id: string | null;
  status: "upcoming" | "inprogress" | "completed";
};

export type GameWithoutId = Omit<Game, "id">;

export type GameWithoutIdentifiers = Omit<
  Game,
  "id" | "home_team_id" | "away_team_id"
>;

export type Tips = {
  id: string;
  user_id: string;
  game_id: string;
  tip_team_id: string;
  status: string;
};

export type Sport = "NRL" | "AFL";

export type AuthProvider =
  | "Google"
  | "Facebook"
  | "Instagram"
  | "Apple"
  | "Twitter";

export type Round = {
  id: string;
  sport: string;
  season: string;
  round: string;
  start_date: string;
  end_date: string;
};

export type RoundWithoutId = Omit<Round, "id">;

export type Scores = {
  id: string;
  user_id: string;
  sport: string;
  season: string;
  round: string;
  score: number;
  start_date: string;
  end_date: string;
};

export type LeaderboardEntry = {
  id: string;
  alias: string;
  previous_round_points: number;
  total_points: number;
  ranking: number;
};

export type Competition = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
};

export type CompetitionWithoutId = Omit<Competition, "id">;

export type UserCompetition = {
  id: string;
  user_id: string;
  competition_id: string;
  signup_date: string;
};

export type SeedUserCompetition = {
  user_id: string;
  competition_id: string;
};

interface TeamColors {
  [key: string]: {
    primary: string;
    secondary: string;
  };
}

export type VerificationToken = {
  id: string;
  email: string;
  token: string;
  expires: string;
};

export type PasswordResetToken = {
  id: string;
  email: string;
  token: string;
  expires: string;
};

export const teamColors: TeamColors = {
  "Canberra Raiders": {
    primary: "#00A859", // Green
    secondary: "#FFD700", // Yellow (Gold)
  },
  "South Sydney Rabbitohs": {
    primary: "#007A33", // Green
    secondary: "#D50C1A", // Red
  },
  "Gold Coast Titans": {
    primary: "#1CABE2", // Light Blue
    secondary: "#FFD700", // Yellow (Gold)
  },
  "Brisbane Broncos": {
    primary: "#5A1A57", // Maroon
    secondary: "#FFC324", // Yellow (Gold)
  },
  "Cronulla Sharks": {
    primary: "#00B4D8", // Sky Blue
    secondary: "#002B5C", // Dark Blue
  },
  "Penrith Panthers": {
    primary: "#231F20", // Black
    secondary: "#A64D23", // Bronze
  },
  "Melbourne Storm": {
    primary: "#43276D", // Purple
    secondary: "#FDB515", // Yellow (Gold)
  },
  "North Queensland Cowboys": {
    primary: "#002B5C", // Dark Blue
    secondary: "#FFD700", // Yellow (Gold)
  },
  "Redcliffe Dolphins": {
    primary: "#FF0000", // Red
    secondary: "#BEBEBE", // Silver (Gray)
  },
  "Sydney Roosters": {
    primary: "#C8102E", // Red
    secondary: "#002B5C", // Dark Blue
  },
  "Wests Tigers": {
    primary: "#F26522", // Orange
    secondary: "#231F20", // Black
  },
  "New Zealand Warriors": {
    primary: "#000000", // Black
    secondary: "#A5ACAF", // Silver (Gray)
  },
  "Manly Sea Eagles": {
    primary: "#660033", // Maroon
    secondary: "#A9A9A9", // Gray
  },
  "Newcastle Knights": {
    primary: "#003087", // Blue
    secondary: "#C8102E", // Red
  },
  "Parramatta Eels": {
    primary: "#FFD700", // Yellow (Gold)
    secondary: "#002B5C", // Dark Blue
  },
  "St. George Illawarra Dragons": {
    primary: "#FFFFFF", // White
    secondary: "#D50C1A", // Red
  },
  "Canterbury-Bankstown Bulldogs": {
    primary: "#00539F", // Blue
    secondary: "#FFFFFF", // White
  },
  "Adelaide Crows": {
    primary: "#002B5C", // Dark Blue
    secondary: "#FDBB30", // Yellow (Gold)
  },
  "Brisbane Lions": {
    primary: "#9A0036", // Maroon
    secondary: "#005689", // Blue
  },
  "Carlton Blues": {
    primary: "#031A2C", // Navy Blue
    secondary: "#FFFFFF", // White
  },
  "Collingwood Magpies": {
    primary: "#000000", // Black
    secondary: "#FFFFFF", // White
  },
  "Essendon Bombers": {
    primary: "#000000", // Black
    secondary: "#C8102E", // Red
  },
  "Fremantle Dockers": {
    primary: "#2A1A42", // Purple
    secondary: "#FFFFFF", // White
  },
  "Geelong Cats": {
    primary: "#001C3D", // Dark Blue
    secondary: "#FFFFFF", // White
  },
  "Gold Coast Suns": {
    primary: "#D30016", // Red
    secondary: "#FDBB30", // Yellow (Gold)
  },
  "Greater Western Sydney Giants": {
    primary: "#F37022", // Orange
    secondary: "#4B4F54", // Charcoal
  },
  "Hawthorn Hawks": {
    primary: "#4D2004", // Brown
    secondary: "#FFC324", // Yellow (Gold)
  },
  "Melbourne Demons": {
    primary: "#0A1C28", // Dark Blue
    secondary: "#D50C1A", // Red
  },
  "North Melbourne Kangaroos": {
    primary: "#003087", // Blue
    secondary: "#FFFFFF", // White
  },
  "Port Adelaide Power": {
    primary: "#01B4C7", // Teal
    secondary: "#000000", // Black
  },
  "Richmond Tigers": {
    primary: "#000000", // Black
    secondary: "#FFD700", // Yellow (Gold)
  },
  "St Kilda Saints": {
    primary: "#000000", // Black
    secondary: "#FFFFFF", // White
  },
  "Sydney Swans": {
    primary: "#E00034", // Red
    secondary: "#FFFFFF", // White
  },
  "West Coast Eagles": {
    primary: "#003087", // Blue
    secondary: "#FDBB30", // Yellow (Gold)
  },
  "Western Bulldogs": {
    primary: "#002B5C", // Dark Blue
    secondary: "#FFFFFF", // White
  },
};
