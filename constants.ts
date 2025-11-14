import { Role, CustomOrderStatus } from './types';

export const APP_NAME = "Goofty Fashions";
export const LOCAL_STORAGE_KEY = "gooftyFashionsDemoData";
export const LOCAL_STORAGE_CART_KEY = "gooftyFashionsDemoCart";


export const ROLES = [Role.Admin, Role.Manager, Role.Tailor, Role.Customer];

export const KANBAN_STAGES = [
  CustomOrderStatus.Received,
  CustomOrderStatus.Cutting,
  CustomOrderStatus.Stitching,
  CustomOrderStatus.Finishing,
  CustomOrderStatus.Ready,
  CustomOrderStatus.Delivered,
];