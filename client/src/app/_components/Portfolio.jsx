'use client'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore'

const Portfolio = () => {

    const [holdingsData, setHoldingsData] = useState([])
    const { accessToken } = useUserAccessDataStore()

    const getHoldings = async () => {
        try{
            const res = await axios.post('http://localhost:4000/stock/getHoldings', {
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

    const InvestedAmount = holdingsData?.reduce((acc, curr) => acc + (curr.quantity*curr.averagePrice) , 0)

  return (
    <div>
        <div className='p-4 pb-2'>
            <div className='flex space-x-4 items-center w-full text-gray-700 dark:text-gray-200'>
                <div className='w-1/3 bg-gray-50 dark:bg-gray-700 boder rounded p-3 pl-4 font-medium'>
                    <p className='pb-1'>Invested</p>
                    <p className='dark:text-gray-400 '>{InvestedAmount}</p>
                </div>
                <div className='w-1/3 bg-gray-50 dark:bg-gray-700 boder rounded p-3 pl-4'>
                    <p className='pb-1'>Current</p>
                    <p className='dark:text-gray-400'>123</p>
                </div>
                <div className='w-1/3 bg-gray-50 dark:bg-gray-700 boder rounded p-3 pl-4' >
                    <p className='pb-1'>P&L</p>
                    <p className='dark:text-gray-400'>123</p>
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
                            {holdingsData?.map((data) => (<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
                                {`Rs. ${data.averagePrice}`}
                                </td>
                                <td class="px-6 py-4">
                                {`Rs. ${data.averagePrice*data.quantity}`}
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