import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore'
import io from "socket.io-client";

const Positions = () => {

    const [positions, setPosition] = useState([])
    const { accessToken } = useUserAccessDataStore()
    const [socket, setSocket] = useState(null)
    const [currentPositionsData, setCurrentPositionsData] = useState({})

    const getPositions = async () => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_MD_BE_URI}/stock/getPositions`,{
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

    useEffect(() => {
        if(positions.length !== 0){
            const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
            setSocket(newSocket);

            const instrumentKeys = positions.map((data) => data.instrumentToken)

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

                setCurrentPositionsData(temp)
            
            })
        }

        return () => {
            if(socket){
                socket.close()
            }
        }
    }, [positions])

    const CalculatePL = (position) => {

        if(!currentPositionsData[position.instrumentToken]){
            return '-'
        }

        const pandl = (position.quantity*currentPositionsData[position.instrumentToken]) - (position.quantity*position.buyPrice)

        const positive = pandl > 0 ? true : false
        return  `${positive ? '+' : ''}${pandl.toFixed(2)}`
    }


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
                            Quantity
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Total
                        </th>
                        <th scope="col" class="px-6 py-3">
                            P&L
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        positions?.map((position) => (
                            <tr key={Portfolio.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {position.tradingSymbol}
                                </th>
                                <td class="px-6 py-4">
                                    {position.quantity}
                                </td>
                                <td class="px-6 py-4">
                                    {`Rs. ${position.buyPrice}`}
                                </td>
                                <td class="px-6 py-4">
                                    {`Rs. ${position.quantity*position.buyPrice}`}
                                </td>
                                <td class="px-6 py-4">
                                    {CalculatePL(position)}
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