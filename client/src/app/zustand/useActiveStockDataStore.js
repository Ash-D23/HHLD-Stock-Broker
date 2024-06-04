import {create} from "zustand";

export const useActiveStockDataStore = create((set) => ({
   activeStock: {},
   activeWatchlistStockData: {},
   updateActiveStock : (stock) => set({ activeStock: stock }),
   setActiveWatchlistStockData: (data) => {
      set((state) => { 
         const temp = {...state.activeWatchlistStockData, ...data}


         return {
            activeWatchlistStockData: temp
         }
       })
   }
}))