export enum ItemType {
  Misc = "MISC",
  Skin = "SKIN",
}

export type InventoryItem = {
  id: string;
  name: string;
  type: ItemType;
  image: string;
  icon: string;
};
