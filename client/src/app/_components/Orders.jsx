import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useOrderDataStore } from '../zustand/useOrderDataStore';
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore';

const Orders = () => {

    const { orders, updateOrders } = useOrderDataStore();
    const { accessToken } = useUserAccessDataStore()

    const getOrders = async () => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_OM_BE_URI}/orders/get`, {
                accessToken: accessToken 
            })
            console.log(res)
            updateOrders(res?.data?.message?.data)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getOrders()
    }, [])


  return (
    <div className='p-4 overflow-y-scroll'>

      <div class="relative overflow-x-auto ">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Order
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Type
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Status
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
                    {
                        orders?.map((order) => (
                            <tr key={order.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {order.tradingSymbol}
                                </td>
                                <td class="px-6 py-4">
                                    {order.transactionType}
                                </td>
                                <td class="px-6 py-4">
                                    {order.status}
                                </td>
                                <td class="px-6 py-4">
                                    {order.quantity}
                                </td>
                                <td class="px-6 py-4">
                                    {`Rs. ${order.averagePrice}`}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
      </div>

    </div>
  )
}

export default Orders