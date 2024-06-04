"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useWatchlistsDataStore } from '../zustand/useWatchlistsDataStore';
import io from "socket.io-client";
import { useActiveStockDataStore } from '../zustand/useActiveStockDataStore';
import AddWatchlistModal from './AddWatchlistModal';
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore';

const Sidebar = ({ openOrderModal, closeOrderModal }) => {

   const [activeTab, setActiveTab] = useState('watchlists');
   const [activeWatchlist, setActiveWatchlist] = useState(null);
   const [suggestions, setSuggestions] = useState([]);
   const [newStock, setNewStock] = useState(null);
   const [stocknput, setStockInput] = useState('')
   const [socket, setSocket] = useState(null);
   const { watchlists, updateWatchlists } = useWatchlistsDataStore();
   const { activeStock, activeWatchlistStockData, setActiveWatchlistStockData, updateActiveStock } = useActiveStockDataStore()
   const [showWatchlistModal, setWatchlistModal] = useState(false)
   const [watchlistTitle, setwatchlistTitle] = useState('');
   const { accessToken, userData, setAccessToken } = useUserAccessDataStore()


   const closeWatchListModal = () => setWatchlistModal(false)

   const handleDeleteStockFromWatchlist = async (stock) => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/deleteStock`, {
                watchlist : activeWatchlist.title,
                stock : stock,
                user_id : userData?.user_id
            })
            const newWatchlists = watchlists?.map(data => data.title === res.data.watchlist.title ? res.data.watchlist : data)
            updateWatchlists(newWatchlists)
           
           updatewsConnectToBE(res.data?.watchlist?.stocks)
           updateActiveStock(null)
           closeOrderModal()
        }catch(err){
            console.log(err)
        }
   }

   const handleTabClick = (tab) => {
       setActiveTab(tab);
       setActiveWatchlist(null);
   };

   const handleWatchlistClick = (watchlist) => {
       setActiveTab('watchlist');
       setActiveWatchlist(watchlist);
       wsConnectToBE(watchlist.stocks)
   };

   const handleAddWatchlist = async (watchlistTitleText) => {
       try {
           setwatchlistTitle(watchlistTitleText);
           const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/add`, {
               title : watchlistTitleText,
               user_id : userData?.user_id
           })
          // setActiveWatchlist(...activeWatchlist, watchlistTitleText);
          updateWatchlists([...watchlists, res.data])
       } catch (error) {
           console.log('Error in adding watchlist ', error.message);
       }
   };

   const handleAddStock = async () => {
       try {
           const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/addStock`, {
               watchlist: activeWatchlist.title,
               stock: newStock,
               user_id: userData?.user_id
           });
           setStockInput('')
           const newWatchlists = watchlists?.map(data => data.title === res.data.title ? res.data : data)
           updateWatchlists(newWatchlists)
           
           updatewsConnectToBE(res.data?.stocks)
           setNewStock(null)
       } catch (error) {
           console.log('Error in adding stock');
       }  
   };

   const getWatchlists = async () => {
       try {
           const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/get`, {
            user_id: userData.user_id
           });

           updateWatchlists(res.data);
           //setting first watchlist as active by default
           if (res.data.length !== 0) {
               setActiveTab('watchlist');
               setActiveWatchlist(res.data[0]);
               wsConnectToBE(res.data[0].stocks)
           }
       } catch (error) {
           console.log('Error in getting watchlists');
       }
   }

   const searchStocks = async (e) => {
       setStockInput(e.target.value);
       const stockToBeSearched = e.target.value;
       if (stocknput?.length > 2) {
           try {
               const res = await axios.get(`${process.env.NEXT_PUBLIC_AG_URI}`, { params: { q: stockToBeSearched } });
               const stockDetails = res.data.map(stock => ({ name: stock._source.name, instrumentKey: stock._source.instrumentKey })); // Extract stock names
               setSuggestions(stockDetails);
           } catch (error) {
               console.log("Error in searching : ", error.message)
           }
       } else {
           setSuggestions([]);
       }
   }

   const wsConnectToBE = (activeWatchlistStocks) => {
        if(socket){
            socket.close()
        }
       const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
       setSocket(newSocket);

       const instrumentKeys = activeWatchlistStocks?.map(item => item.instrumentKey)

       // const instrumentKeys = ["NSE_EQ|INE669E01016", "NSE_EQ|INE155A01022", "NSE_EQ|INE245A01021"]

       if(instrumentKeys){
         newSocket.emit('market data', instrumentKeys, accessToken)
       }

       newSocket.on('market data', (msg) => {
        const data = JSON.parse(msg)
        const arr = Object.keys(data.feeds)

        const temp = {}

        for(let index of arr){
            const key = index.split("|")[0]
            if(key==="NSE_EQ"){
                temp[index] = data?.feeds[index]?.ff?.marketFF?.ltpc?.ltp
            }else{
                temp[index] = data?.feeds[index]?.ff?.indexFF?.ltpc?.ltp
            }
            
        }
        setActiveWatchlistStockData(temp)

       })

   }

   const updatewsConnectToBE = (updatedWatchListStocks) => {
        if(socket){
            socket.close()
        }
        const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
        setSocket(newSocket);

        const instrumentKeys = updatedWatchListStocks?.map(item => item.instrumentKey)

        if(instrumentKeys){
            newSocket.emit('market data', instrumentKeys, accessToken)
        }
   
        newSocket.on('market data', (msg) => {
        const data = JSON.parse(msg)
        const arr = Object.keys(data.feeds)

        const temp = {}
   
        for(let index of arr){
            const key = index.split("|")[0]
            if(key==="NSE_EQ"){
                temp[index] = data?.feeds[index]?.ff?.marketFF?.ltpc?.ltp
            }else{
                temp[index] = data?.feeds[index]?.ff?.indexFF?.ltpc?.ltp
            }
            
        }

        setActiveWatchlistStockData(temp)
   
        })
   }

   useEffect(() => {
       getWatchlists();
   }, []);


   return (
       <div className="flex flex-col bg-gray-200 h-screen border-r border-gray-300">
           <div className="p-2">
               <div className="flex justify-between items-center mb-2 p-1">
                   <h1 className="text-lg font-semibold text-black">Watchlists</h1>
                   <button
                       className={`text-gray-700
                                   hover:text-gray-900
                                    font-medium text-2xl pb-1`}
                       onClick={() => setWatchlistModal(true)}
                   >
                       +
                   </button>

               </div>
               <div>
                   <ul className="flex overflow-x-auto p-1 pl-0">
                       {watchlists.map((watchlist, index) => (
                           <li
                               key={index}
                               className={`cursor-pointer text-black mr-3 p-1 px-1.5 ${activeTab === 'watchlist' &&
                                   activeWatchlist.title === watchlist.title
                                   ? 'font-semibold bg-gray-50 border rounded'
                                   : ''
                                   }`}
                               onClick={() =>
                                   handleWatchlistClick(watchlist)}
                           >
                               {watchlist.title}
                           </li>
                       ))}
                   </ul>
               </div>
           </div>
           {activeTab === 'watchlist' && (
               <div className="bg-white h-full overflow-y-scroll">
                   <div className="flex justify-between items-center mb-1 p-2 pt-4 pl-3">
                       <div className="flex relative items-center">
                           <input
                               type="text"
                               className="border border-gray-400 mr-2 p-1 text-black"
                               placeholder="New Stock"
                               value={stocknput}
                               onChange={searchStocks}
                           />
                           {suggestions.length > 0 && (
                               <ul className="absolute left-0 top-10 z-50 border border-gray-400 bg-white">
                                   {suggestions.map((suggestion, index) => (
                                       <li
                                           key={index}
                                           className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                                           onClick={() => {
                                               setStockInput(suggestion?.name)
                                               setNewStock(suggestion);
                                               setSuggestions([]);
                                           }}
                                       >
                                           {suggestion.name}
                                       </li>
                                   ))}
                               </ul>
                           )}
                           <button
                               className="text-white hover:bg-green-700 bg-green-600 p-1 px-2 rounded"
                               onClick={handleAddStock}
                           >
                               Add
                           </button>
                       </div>
                   </div>
                   <div>
                       <ul>
                           {watchlists
                               .find((watchlist) => watchlist.title === activeWatchlist.title)
                               ?.stocks.map((stock, index) => (
                                <div key={index} onClick={() => updateActiveStock(stock)} className={`${activeStock === stock ? 'bg-gray-200' : ''} flex justify-between items-center p-4 pl-3 cursor-pointer`}>
                                    <div className='w-4/5'>
                                        <p className="text-black" >{stock?.name}</p>
                                        <p className="text-gray-600 text-xs" >{stock?.instrumentKey}</p>
                                    </div>
                                    <div className='w-1/5 flex justify-center'>
                                        { !activeWatchlistStockData[stock?.instrumentKey] ? (
                                            <div role="status">
                                                <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>): (<div className='group relative'>
                                                        <div className='group-hover:hidden flex text-black text-sm'>
                                                            <p className='pr-0.5'>&#8377;</p>
                                                            <p>{activeWatchlistStockData[stock?.instrumentKey]}</p>
                                                        </div>
                                                        <div className='hidden group-hover:flex'>
                                                            <button onClick={() => openOrderModal('Buy')} className='border border-green-700 text-black text-xs font-medium hover:bg-green-700 p-1 px-1.5 mr-2 rounded hover:text-white'>B</button>
                                                            <button onClick={() => openOrderModal('Sell')} className='border border-red-700 text-black text-xs font-medium hover:bg-red-700 p-1 px-1.5 mr-1 rounded hover:text-white'>S</button>
                                                            <button onClick={() => handleDeleteStockFromWatchlist(stock)} type="button" className="">
                                                                <svg class="text-red-700 w-6 h-6 hover:text-red-800" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                        </div>
                                                </div>) }
                                    </div>
                                    
                                </div>
                                   
                               ))}
                       </ul>
                   </div>
               </div>
           )}
        { showWatchlistModal ? <AddWatchlistModal closeWatchListModal={closeWatchListModal} handleAddWatchlist={handleAddWatchlist} /> : null }
       </div>
   );
};

export default Sidebar;
