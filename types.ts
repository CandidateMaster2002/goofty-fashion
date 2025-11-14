export enum Role {
  Admin = "Admin",
  Manager = "Manager",
  Tailor = "Tailor",
  Customer = "Customer",
}

export enum RentalStatus {
  Reserved = "Reserved",
  Active = "Active",
  Returned = "Returned",
  Late = "Late",
  Cancelled = "Cancelled",
}

export enum CustomOrderStatus {
  Received = "Received",
  Cutting = "Cutting",
  Stitching = "Stitching",
  Finishing = "Finishing",
  Ready = "Ready",
  Delivered = "Delivered",
}

export interface MeasurementProfile {
  bust?: number;
  waist?: number;
  hip?: number;
  length?: number;
  sleeve?: number;
  units: 'in' | 'cm';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  measurement_profile: MeasurementProfile;
  notes: string;
  created_at: string;
}

export interface Item {
  id: string;
  sku: string;
  title: string;
  category: string;
  subcategory?: string;
  sizes: string[];
  color: string;
  qty: number;
  rent_price_per_day: number;
  buy_price: number;
  condition: string;
  images: string[];
  status: 'available' | 'rented' | 'in-repair';
  description: string;
  tags?: string[];
}

export interface RentedItemInfo {
  item_id: string;
  qty: number;
  price_per_day: number;
}

export interface Rental {
  id: string;
  customer_id: string;
  items: RentedItemInfo[];
  start_date: string;
  end_date: string;
  deposit_amount: number;
  total_amount: number;
  status: RentalStatus;
  pickup_location?: string;
  return_location?: string;
  damage_notes?: string;
  photos_return?: string[];
}

export interface CustomOrder {
  id: string;
  customer_id: string;
  material_provided: boolean;
  material_notes?: string;
  measurement_snapshot: MeasurementProfile;
  design_images?: string[];
  assigned_tailor_id?: string;
  price_estimate: number;
  actual_cost?: number;
  status: CustomOrderStatus;
  due_date: string;
  created_at: string;
  title: string;
}

export interface WorkOrder {
  id: string;
  custom_order_id: string;
  task_list?: string[];
  start_date?: string;
  end_date?: string;
  status: CustomOrderStatus;
  technician_notes?: string;
  photos?: string[];
}

export interface InvoiceItem {
  item_id: string;
  description: string;
  qty: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  customer_id: string;
  related_ref?: string; // rental/custom/sale id
  amount: number;
  tax: number;
  discount: number;
  total_amount: number;
  payment_method: string;
  paid: boolean;
  paid_at?: string;
  items: InvoiceItem[];
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  recipient_role: Role;
  sent_at: string;
}

export interface AppData {
  customers: Customer[];
  items: Item[];
  rentals: Rental[];
  customOrders: CustomOrder[];
  workOrders: WorkOrder[];
  invoices: Invoice[];
  users: User[];
  notifications: Notification[];
}

export interface CartItem {
    id: string; // Unique ID for the cart item, e.g., `${item.id}-${type}`
    type: 'buy' | 'rent';
    item: Item;
    quantity: number;
    // For rentals
    startDate?: string;
    endDate?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Rental;
}