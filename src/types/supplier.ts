export interface Supplier {
  id: string;
  name: string;
  nameFr?: string;
  legalEntityType: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lng: number;
  canadianContentScore: number;
  capacityTier: "Small" | "Medium" | "Large";
  naicsCodes: string[];
  naicsDescriptions: string[];
  certifications: string[];
  website?: string;
  email?: string;
  phone?: string;
  dataSources: string[];
  claimed: boolean;
  lastVerified: string;
  description?: string;
  descriptionFr?: string;
  products?: string[];
}

export interface SearchFilters {
  query: string;
  province: string;
  maxDistance: number;
  capacityTier: string;
  minCanadianContent: number;
  certifications: string[];
  sortBy: "relevance" | "distance" | "canadianContent" | "capacity";
}

export interface TariffComparison {
  productName: string;
  hsCode: string;
  originCountry: string;
  mfnTariffRate: number;
  estimatedDuty: number;
  estimatedFreight: number;
  importedLandedCost: number;
  canadianEstimatedPrice: number;
  savings: number;
  savingsPercent: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  alertEnabled: boolean;
}

export interface ShortlistSupplier {
  id: string;
  name: string;
  city?: string | null;
  provinceCode?: string | null;
  briefInfo?: string | null;
  capacityTier?: string | null;
  sourceProvider?: string | null;
  canadianContentScore: number;
}

export interface Shortlist {
  id: string;
  name: string;
  suppliers: ShortlistSupplier[];
  createdAt: string;
}
