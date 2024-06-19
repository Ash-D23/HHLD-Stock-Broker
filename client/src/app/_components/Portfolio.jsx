'use client'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore'
import io from "socket.io-client";

const Portfolio = () => {

    const [holdingsData, setHoldingsData] = useState([])
    const { accessToken } = useUserAccessDataStore()
    const [socket, setSocket] = useState(null)
    const [currentHoldingsData, setCurrentHoldingsData] = useState({})

    const getHoldings = async () => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_MD_BE_URI}/stock/getHoldings`, {
                accessToken: accessToken
            })

            setHoldingsData(res?.data?.data)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getHoldings()
    }, [])

    useEffect(() => {
        if(holdingsData.length !== 0){
            const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
            setSocket(newSocket);

            const instrumentKeys = holdingsData.map((data) => data.instrumentToken)

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

                setCurrentHoldingsData(temp)
            
            })
        }

        return () => {
            if(socket){
                socket.close()
            }
        }
    }, [holdingsData])

    const CalculatePL = (data) => {
        const total = data.averagePrice*data.quantity
        if(!currentHoldingsData[data.instrumentToken]){
            return `Rs. ${total}`
        }else{
            const currentTtotal =  currentHoldingsData[data.instrumentToken]*data.quantity 
            const pandl = currentTtotal - total
            const positive = pandl > 0 ? true : false

            return `Rs. ${total} (${positive ? '+' : ''}${pandl.toFixed(2)})`
        }
        
    }

    const InvestedAmount = holdingsData?.reduce((acc, curr) => acc + (curr.quantity*curr.averagePrice) , 0)

    const CurrentAmount = holdingsData?.reduce((acc, curr) => acc + (curr.quantity*currentHoldingsData[curr.instrumentToken]) , 0)

    const pandl = CurrentAmount ? CurrentAmount - InvestedAmount : null


  return (
    <div>
        <div className='p-4 pb-2'>
            <div className='flex space-x-4 items-center w-full text-gray-700 dark:text-gray-200'>
                <div className='w-1/3 bg-gray-50 dark:bg-gray-700 boder rounded p-3 pl-4 font-medium'>
                    <p className='pb-1'>Invested</p>
                    <p className='dark:text-gray-400 '>{InvestedAmount.toLocaleString()}</p>
                </div>
                <div className='w-1/3 bg-gray-50 dark:bg-gray-700 boder rounded p-3 pl-4'>
                    <p className='pb-1'>Current</p>
                    <p className='dark:text-gray-400'>{CurrentAmount ? CurrentAmount.toLocaleString() : '-'}</p>
                </div>
                <div className='w-1/3 bg-gray-50 dark:bg-gray-700 boder rounded p-3 pl-4' >
                    <p className='pb-1'>P&L</p>
                    {pandl ? <p className={`dark:text-gray-400 ${pandl > 0 ? 'text-green-500 dark:text-green-500' : 'text-red-700 dark:text-red-500'}`}><span className='mr-1'>+</span>{pandl.toFixed(2)}</p> : '-'}
                </div>
            </div>
        </div>
        <div className='p-4 pr-3 overflow-y-scroll'>
                <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Company Name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Quantity
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Current
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdingsData?.map((data) => (<tr key={data.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {data.companyName}
                                </td>
                                <td class="px-6 py-4">
                                    {data.quantity}
                                </td>
                                <td class="px-6 py-4">
                                {`Rs. ${data.averagePrice}`}
                                </td>
                                <td class="px-6 py-4">
                                {currentHoldingsData[data.instrumentToken] ? `Rs. ${currentHoldingsData[data.instrumentToken]}` : ''}
                                </td>
                                <td class="px-6 py-4">
                                {CalculatePL(data)}
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
  )
}

export default Portfolio