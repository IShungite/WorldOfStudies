import { CharacterResponse } from "./character_response";

export type CharacterListResponse = {
  results: { result: CharacterResponse }[];
};
