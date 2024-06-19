"use client"
import React, { useEffect, useState } from 'react'
import { useActiveStockDataStore } from '../zustand/useActiveStockDataStore'
import axios from 'axios'
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore'

const PlaceOrder = ({ closeOrderModal, modalType, setActiveTab }) => {

  const { activeStock, activeWatchlistStockData } = useActiveStockDataStore()
  const { accessToken } = useUserAccessDataStore()
  const [quantity, setQuantity] = useState(0)
  const [price, setPrice] = useState(0)
  const [order, setOrder] = useState('CNC')
  const [orderType, setOrderType] = useState('Market')
  const [OHLC, setOHLC] = useState({})

  const getMarketStats = async () => {
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MD_BE_URI}/stock/getOHLCData`, {
        symbol: activeStock?.instrumentKey,
        accessToken: accessToken
      })
      setOHLC(res.data.ohlc)
      setPrice(res.data.lastPrice)
    }catch(err){
      console.log(err)
    }
  }

  const handleSubmit = async () => {
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_OM_BE_URI}/orders/add`, {
        instrumentKey: activeStock?.instrumentKey,
        accessToken: accessToken,
        quantity: quantity,
        price: price,
        orderType: orderType,
        order: modalType
      })
      
      setActiveTab('Orders')
      closeOrderModal()

    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getMarketStats()
  }, [activeStock])

  return (
    <div className='h-screen w-full bg-gray-100 text-black absolute z-40 place-order-position p-3'>
      <div className='flex flex-col h-full'>

        <div className="flex justify-between items-center mb-1">
          { modalType === 'Buy' ? <h2 className='text-lg font-semibold text-black'>Place order</h2> : <h2 className='text-lg font-semibold text-black'>Sell order</h2> }
          <button onClick={closeOrderModal} type="button" class="end-2.5 text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-gray-900" data-modal-hide="authentication-modal">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div className='flex justify-between items-center my-2'>
          <div className='text-gray-600 font-medium'>
            <p className='text-medium'>{activeStock?.name}</p>
            <p className='text-xs'>{activeStock?.instrumentKey}</p>
          </div>
          <div>
            { activeWatchlistStockData[activeStock?.instrumentKey] ? <p className='text-gray-500'>&#8377; {activeWatchlistStockData[activeStock?.instrumentKey]}</p> : null}
          </div>
        </div>

        <form className=''>
            <div className='mt-4'>
              <div className='flex'>
                <button type="button" onClick={() => setOrder('CNC')} className={`flex-grow text-purple-700 hover:text-white border border-purple-800 hover:bg-purple-800 rounded text-sm px-4 py-2 text-center me-2 mb-2 ${order === 'CNC' ? 'bg-purple-800 text-white' : ''}`}>Long Term</button>
                <button type="button" onClick={() => setOrder('Intra')} className={`flex-grow text-purple-700 hover:text-white border border-purple-800 hover:bg-purple-800 rounded text-sm px-4 py-2 text-center me-2 mb-2 ${order === 'Intra' ? 'bg-purple-800 text-white' : ''}`}>Intraday</button>
              </div>
            </div>

            <div className='my-4'>
                <p className='text-medium font-medium text-gray-900 pb-1'>Market Stats</p>
                <div className='bg-white p-2 border rounded text-gray-500 font-medium'>
                  <div className='flex text-sm mb-2'>
                    <div className='w-1/2'>
                      <p className='text-xs'>Open</p>
                      <p>&#8377; {OHLC?.open}</p>
                    </div>
                    <div className='w-1/2 pl-3'>
                      <p className='text-xs'>Close</p>
                      <p>&#8377; {OHLC?.close}</p>
                    </div>
                  </div>
                  <div className='flex text-sm'>
                    <div className='w-1/2'>
                      <p className='text-xs'>High</p>
                      <p>&#8377; {OHLC?.high}</p>
                    </div>
                    <div className='w-1/2 pl-3'>
                      <p className='text-xs'>Low</p>
                      <p>&#8377; {OHLC?.low}</p>
                    </div>
                  </div>
                </div>
            </div>
            
            <div className='flex justify-between w-full items-center'>
              <div class="w-1/2 overflow-hidden mr-2">
                  <label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
                  <div class="relative flex items-center max-w-[8rem]">
                      <button onClick={()=>setQuantity(prev => prev-1)} disabled={quantity === 0} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className={`bg-gray-200 border border-gray-400 rounded-s-lg px-3 h-10 ${quantity === 0 ? 'opacity-50' : ''}`}>
                          <svg class="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                          </svg>
                      </button>
                      <input type="text" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" class="bg-white border-x-0 border-gray-600 h-10 text-center text-gray-900 text-sm w-11 flex-grow" placeholder="1" required />
                      <button onClick={()=>setQuantity(prev => prev+1)} type="button" id="increment-button" data-input-counter-increment="quantity-input" class="bg-gray-200 border border-gray-400 rounded-e-lg  px-3 h-10">
                          <svg class="w-3 h-3 text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                          </svg>
                      </button>
                  </div>
              </div>
              
              <div class="w-1/2 ml-2">
                  <label for="number-input" class="block mb-2 text-sm font-medium text-gray-900">Price</label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">&#8377;</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(parseInt(e.target.value === "" ? 0 : e.target.value))}
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {/* <span className="text-gray-500 sm:text-sm" id="price-currency">
                        USD
                      </span> */}
                    </div>
                  </div>
              </div>

            </div>

            <div className='my-6'>
              <p className='text-sm font-medium text-gray-900'>Order Type</p>
              <ul class="flex items-center w-full text-sm font-medium text-gray-900">
    
                <li class="w-full">
                    <div class="flex items-center ps-1">
                     <input id="horizontal-list-radio-license" type="radio" value="Market" checked={orderType === "Market"} onChange={(e) => setOrderType(e.target.value)} name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300" />
                    <label for="horizontal-list-radio-license" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">Market</label>
                  </div>
                </li>
                <li class="w-full">
                  <div class="flex items-center ps-3">
                      <input id="horizontal-list-radio-id" type="radio" value="Limit" checked={orderType === "Limit"} onChange={(e) => setOrderType(e.target.value)} name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300" />
                      <label for="horizontal-list-radio-id" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">Limit</label>
                  </div>
                </li>
            </ul>
            </div>

        </form>
        <div className='flex-grow flex items-end'>

          <p className='text-sm pb-1.5'>Amount: Rs.{(quantity*price).toFixed(2)}</p>
        </div>

        <button onClick={handleSubmit} type="button" class="w-full text-white font-medium border border-purple-800 bg-purple-800 hover:bg-purple-900 rounded text-sm px-4 py-2 text-center mb-2">{ modalType === "Buy" ? 'Place Order' : 'Sell Order' }</button>
      </div>
    </div>
  )
}

export default PlaceOrder