import { Product } from "./shop_product";

export type ShopCategory = {
  id: string;
  name: string;
  products: Product[];
};
