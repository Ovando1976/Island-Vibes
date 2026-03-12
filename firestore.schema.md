# Firestore Schema (Island-Vibes)

This schema is the canonical v1 data contract for Island-Vibes.

## Collections

- `/users/{userId}`
- `/dispensaries/{dispensaryId}`
- `/products/{productId}`
- `/orders/{orderId}`
- `/reviews/{reviewId}`
- `/posts/{postId}`
- `/favorites/{userId}/items/{productId}`
- `/adminLogs/{logId}`

> Optional denormalized collection:
- `/orderItems/{orderItemId}` (only if needed for analytics or reporting)

---

## Domain Types (TypeScript)

```ts
export type UserRole = "customer" | "dispensary_admin" | "super_admin";

export interface UserProfile {
  id: string;
  displayName: string;
  username?: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  birthdate?: string;
  isAgeVerified: boolean;
  favoriteDispensaryIds: string[];
  favoriteProductIds: string[];
  createdAt: number;
  updatedAt?: number;
}

export type Island = "St. Thomas" | "St. John" | "St. Croix";

export interface Dispensary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoURL?: string;
  coverURL?: string;
  address?: string;
  island: Island;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  averageRating?: number;
  reviewCount?: number;
  verified: boolean;
  published: boolean;
  createdAt: number;
  updatedAt?: number;
}

export type ProductCategory =
  | "flower"
  | "preroll"
  | "edible"
  | "vape"
  | "concentrate"
  | "tincture"
  | "accessory";

export type StrainType = "indica" | "sativa" | "hybrid";

export interface Product {
  id: string;
  dispensaryId: string;
  name: string;
  slug: string;
  category: ProductCategory;
  strainType?: StrainType;
  thc?: number;
  cbd?: number;
  price: number;
  salePrice?: number;
  brand?: string;
  description?: string;
  imageURLs: string[];
  inStock: boolean;
  quantityAvailable?: number;
  terpeneTags: string[];
  effectTags: string[];
  featured: boolean;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready"
  | "completed"
  | "cancelled";

export type FulfillmentType = "pickup" | "delivery";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  dispensaryId: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
}
```

---

## Index Recommendations

Create composite indexes for common query patterns:

1. `products`: `published ASC, featured DESC, createdAt DESC`
2. `products`: `published ASC, category ASC, price ASC`
3. `products`: `published ASC, island ASC, inStock DESC`
4. `dispensaries`: `published ASC, island ASC, verified DESC`
5. `orders`: `userId ASC, createdAt DESC`
6. `orders`: `dispensaryId ASC, status ASC, createdAt DESC`

---

## Rule Intent (high-level)

- Public can read only published dispensaries/products.
- Users can access only their own profiles/favorites/orders unless elevated role.
- `dispensary_admin` can manage only their dispensary content and relevant orders.
- `super_admin` can manage all protected collections.
- `adminLogs` should be writeable by trusted backend only.

---

## Operational Notes

- Use `slug` fields on dispensaries/products for SEO-friendly URLs.
- Keep `updatedAt` on mutable documents for sorting and audits.
- Avoid storing sensitive internal analytics in public-readable docs.
- Keep order item snapshots (`productName`, `unitPrice`) for historical integrity.
