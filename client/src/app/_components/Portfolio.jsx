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

  return (
    <div className='p-4 overflow-y-scroll'>
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
                    </tr>
                </thead>
                <tbody>
                    {holdingsData?.map((data) => (<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                         {data.companyName}
                        </th>
                        <td class="px-6 py-4">
                            {data.quantity}
                        </td>
                        <td class="px-6 py-4">
                        {`Rs. ${data.averagePrice}`}
                        </td>
                    </tr>))}
                </tbody>
            </table>
      </div>
    </div>
  )
}

export default Portfolio