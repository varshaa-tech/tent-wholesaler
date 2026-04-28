// =====================================================
// PRODUCT CATALOG — Tent Supplier Wholesale
// =====================================================

export const PRODUCTS = [
  { id: 1,  name: 'Premium Canopy Tent 10×10 ft',     sku: 'PCT-1010', price: 3200,  unit: 'pc',  category: 'Canopy Tents' },
  { id: 2,  name: 'Heavy Duty Event Tent 20×20 ft',   sku: 'HDT-2020', price: 8500,  unit: 'pc',  category: 'Event Tents' },
  { id: 3,  name: 'Aluminum Frame Tent 10×20 ft',     sku: 'AFT-1020', price: 5800,  unit: 'pc',  category: 'Event Tents' },
  { id: 4,  name: 'Waterproof Tarpaulin 12×15 ft',    sku: 'WPT-1215', price: 950,   unit: 'pc',  category: 'Tarpaulins' },
  { id: 5,  name: 'Camping Tent — 4 Person',          sku: 'CT4-PRG',  price: 2200,  unit: 'pc',  category: 'Camping Tents' },
  { id: 6,  name: 'Large Event Canopy 30×30 ft',      sku: 'EC-3030',  price: 14000, unit: 'pc',  category: 'Event Tents' },
  { id: 7,  name: 'Tent Pole Set (6 pcs)',            sku: 'TPS-006',  price: 480,   unit: 'set', category: 'Accessories' },
  { id: 8,  name: 'Rope & Stake Kit (Professional)',  sku: 'RSK-PRO',  price: 320,   unit: 'kit', category: 'Accessories' },
  { id: 9,  name: 'Replacement Tent Cover (Standard)',sku: 'TCR-STD',  price: 1100,  unit: 'pc',  category: 'Accessories' },
  { id: 10, name: 'Sandbag Weight Set (4 pcs)',       sku: 'SBW-004',  price: 650,   unit: 'set', category: 'Accessories' },
  { id: 11, name: 'Military Tarpaulin 20×30 ft',      sku: 'MT-2030',  price: 2800,  unit: 'pc',  category: 'Tarpaulins' },
  { id: 12, name: 'Beach Umbrella Tent UV50+',        sku: 'BU-UV50',  price: 1800,  unit: 'pc',  category: 'Canopy Tents' },
  { id: 13, name: 'Folding Gazebo 3×3 m',            sku: 'FG-3X3',   price: 4500,  unit: 'pc',  category: 'Canopy Tents' },
  { id: 14, name: 'Mosquito Net (Double Bed)',        sku: 'MN-DBL',   price: 380,   unit: 'pc',  category: 'Accessories' },
  { id: 15, name: 'Camping Tent — 8 Person',          sku: 'CT8-FAM',  price: 4200,  unit: 'pc',  category: 'Camping Tents' },
];

export const TAX_RATE = 0.18; // 18% GST (9% CGST + 9% SGST)

export const CUSTOMER_TYPES = ['Retailer', 'Dealer', 'Distributor', 'Direct / Walk-in'];

export const PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Cheque', 'UPI / QR', 'Credit (30 days)', 'Credit (60 days)'];

export const STATES_IN = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
];

export const COMPANY_INFO = {
  name: 'TentPro Wholesale Pvt. Ltd.',
  address: 'Plot No. 42, Industrial Area, Izatnagar\nBareilly, Uttar Pradesh — 243122',
  phone: '+91 98765 43210',
  email: 'sales@tentprowholesale.in',
  gstin: '09AAATP1234A1Z5',
  bank: 'Punjab National Bank',
  account: '4521098765432',
  ifsc: 'PUNB0452100',
};
