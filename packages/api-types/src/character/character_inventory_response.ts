import { InventoryItem } from "../inventory";

export type CharacterInventoryResponse = {
  result: {
    items: InventoryItem[];
  };
};
