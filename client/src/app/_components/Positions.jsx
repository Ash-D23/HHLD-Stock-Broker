import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore'

const Positions = () => {

    const [positions, setPosition] = useState([])
    const { accessToken } = useUserAccessDataStore()

    const getPositions = async () => {
        try{
            const res = await axios.post('http://localhost:4000/stock/getPositions',{
                accessToken: accessToken
            })
            setPosition(res?.data?.data)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getPositions()
    }, [])

  return (
    <div className='p-4 overflow-y-scroll'>

      <div class="relative overflow-x-auto ">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Name
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
                        positions?.map((position) => (
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {position.tradingSymbol}
                                </th>
                                <td class="px-6 py-4">
                                    {position.status}
                                </td>
                                <td class="px-6 py-4">
                                    {position.quantity}
                                </td>
                                <td class="px-6 py-4">
                                    {`Rs. ${position.price}`}
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

export default Positions