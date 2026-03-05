// Shared domain types

export interface RawRow {
  title: string;
  release_year: string;
  locations: string;
  fun_facts: string;
  director: string;
  writer: string;
  actor_1: string;
  actor_2: string;
  actor_3: string;
  production_company: string;
  distributor: string;
  latitude: string;
  longitude: string;
}

export interface MovieLocation {
  description: string;
  funFact: string | null;
  lat: number;
  lng: number;
}

export interface Movie {
  id: string;
  title: string;
  releaseYear: number | null;
  director: string | null;
  writer: string | null;
  actors: string[];
  productionCompany: string | null;
  distributor: string | null;
  locations: MovieLocation[];
}

export interface MapMarker {
  id: string;
  movieTitle: string;
  releaseYear: number | null;
  description: string;
  funFact: string | null;
  lat: number;
  lng: number;
}
