export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Teams = {
  id: string;
  name: string;
  sport: string;
};

export type Games = {
  id: string;
  sport: string;
  round: number;
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

export type Tips = {
  id: string;
  user_id: string;
  game_id: string;
  tip_team_id: string;
  status: string;
};

export type Sport = "NRL" | "AFL";

export type Rounds = {
  id: string;
  sport: string;
  season: string;
  round: string;
  start_date: string;
  end_date: string;
};

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
