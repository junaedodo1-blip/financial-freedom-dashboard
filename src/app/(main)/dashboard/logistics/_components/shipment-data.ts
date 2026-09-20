import {
  AlertTriangleIcon,
  ArrowUp,
  Ban,
  CheckCircle2,
  Droplets,
  Flame,
  Forklift,
  type LucideIcon,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Snowflake,
  Star,
  Thermometer,
  Truck,
} from "lucide-react";

export type ShipmentStatus =
  | "Scheduled"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold"
  | "Customs Hold";

export type TransportMode = "land" | "air" | "sea";
export type RouteType = "road" | "flight" | "ship";
export type CustomerTier = "Priority" | "Standard" | "Non-priority";

export type GeoCoordinate = [longitude: number, latitude: number];

export type ShipmentLocation = {
  coordinates: GeoCoordinate;
  display: string;
  country: string;
  countryCode: string;
};

export type ShipmentCustomer = {
  name: string;
  initials: string;
  id: string;
  tier: CustomerTier;
  tierLabel: string;
};

export type HandlingTag = {
  label: string;
  icon: LucideIcon;
};

export type ShipmentHandling = {
  label: string;
  note: string;
  tags: HandlingTag[];
};

export type Shipment = {
  id: string;
  customer: ShipmentCustomer;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  handling: ShipmentHandling;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
  transportNumber: string;
};

const customerAccounts = {
  techCorp: {
    name: "TechCorp",
    initials: "TC",
    id: "SDA-1001-2401-01",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  regionalRoadExpress: {
    name: "Regional Road Express",
    initials: "RR",
    id: "SDA-1002-2402-02",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  sendWell: {
    name: "SendWell B.V.",
    initials: "SW",
    id: "SDA-1003-2403-03",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  sourceDay: {
    name: "SourceDay",
    initials: "SD",
    id: "SDA-1004-2404-04",
    tier: "Standard",
    tierLabel: "Recurring shipment account",
  },
  shippingEasy: {
    name: "ShippingEasy",
    initials: "SE",
    id: "SDA-1005-2405-05",
    tier: "Standard",
    tierLabel: "Recurring shipment account",
  },
  freightView: {
    name: "FreightView",
    initials: "FV",
    id: "SDA-1006-2406-06",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  logisticsPlus: {
    name: "Logistics Plus",
    initials: "LP",
    id: "SDA-1007-2407-07",
    tier: "Standard",
    tierLabel: "Managed freight account",
  },
  transvirtual: {
    name: "Transvirtual",
    initials: "TV",
    id: "SDA-1008-2408-08",
    tier: "Standard",
    tierLabel: "Managed freight account",
  },
  skyTrack: {
    name: "SkyTrack",
    initials: "ST",
    id: "SDA-1009-2409-09",
    tier: "Non-priority",
    tierLabel: "Occasional shipment account",
  },
  maersk: {
    name: "Maersk",
    initials: "MK",
    id: "SDA-1010-2410-10",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  flexport: {
    name: "Flexport",
    initials: "FX",
    id: "SDA-1011-2411-11",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  piedPiper: {
    name: "Pied Piper",
    initials: "PP",
    id: "SDA-1012-2412-12",
    tier: "Non-priority",
    tierLabel: "Occasional shipment account",
  },
} satisfies Record<string, ShipmentCustomer>;

export const shipments: Shipment[] = [];
