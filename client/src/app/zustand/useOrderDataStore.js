import {create} from "zustand";

export const useOrderDataStore = create((set) => ({
   orders: [],
   updateOrders : (orders) => set({orders: orders})
}))