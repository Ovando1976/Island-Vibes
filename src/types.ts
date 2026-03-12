export type Island = "St. Thomas" | "St. John" | "St. Croix";
export type UserRole = "customer" | "dispensary_admin" | "super_admin";
export type Category = "flower" | "preroll" | "edible" | "vape" | "concentrate" | "tincture" | "accessory";
export type StrainType = "indica" | "sativa" | "hybrid";
export type OrderStatus = "pending" | "confirmed" | "ready" | "completed" | "cancelled";
export type FulfillmentType = "pickup" | "delivery";

export interface User {
  id: string;
  displayName: string;
  username: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  birthdate?: string;
  isAgeVerified: boolean;
  favoriteDispensaryIds: string[];
  favoriteProductIds: string[];
  createdAt: number;
}

export interface Dispensary {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoURL?: string;
  coverURL?: string;
  address: string;
  island: Island;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  averageRating: number;
  reviewCount: number;
  verified: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: number;
}

export interface Product {
  id: string;
  dispensaryId: string;
  name: string;
  category: Category;
  strainType?: StrainType;
  thc?: number;
  cbd?: number;
  price: number;
  salePrice?: number;
  brand?: string;
  description: string;
  imageURLs: string[];
  inStock: boolean;
  terpeneTags?: string[];
  terpeneProfiles?: Array<{ name: string; percentage: number }>;
  effectTags?: string[];
  lineage?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  userId: string;
  dispensaryId?: string;
  productId?: string;
  rating: number;
  title?: string;
  body: string;
  imageURLs?: string[];
  createdAt: number;
}

export interface Order {
  id: string;
  userId: string;
  dispensaryId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    qty: number;
  }>;
  subtotal: number;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  imageURLs?: string[];
  likesCount: number;
  likedBy?: string[];
  sharedProductId?: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  rating: number;
  effects: string[];
  notes: string;
  createdAt: number;
}
