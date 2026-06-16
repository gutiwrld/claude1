export interface Pool {
  id: string;
  name: string;
  admin_pin: string;
  exact_pts: number;
  outcome_pts: number;
  created_at: string;
}

export interface Player {
  id: string;
  pool_id: string;
  name: string;
  created_at: string;
}

export interface Match {
  id: string;
  pool_id: string;
  jornada: string;
  grp: string | null;
  knockout: boolean;
  home_name: string;
  home_flag: string;
  away_name: string;
  away_flag: string;
  locked: boolean;
  result_home: number | null;
  result_away: number | null;
  sort_order: number;
  created_at: string;
}

export interface Prediction {
  id: string;
  pool_id: string;
  player_id: string;
  match_id: string;
  home: number;
  away: number;
  updated_at: string;
}

export interface ScoreRules {
  exact: number;
  outcome: number;
}
