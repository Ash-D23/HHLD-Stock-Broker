'use client'
import React, { act, useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { useActiveStockDataStore } from '../zustand/useActiveStockDataStore';
import axios from 'axios';

const Chart = dynamic(
  () => {
    return import('react-apexcharts');
  },
  { ssr: false }
);

const BasicValues = {
  options: {
    chart: {
      id: ''
    },
    xaxis: {
      categories: []
    }
  },
  series: [{
    name: '',
    data: []
  }]
}

const filters = ["1D", "1M", "6M", "1Y"]

const StockChart = ({ openOrderModal }) => {

  const [value, setValue] = useState(BasicValues)
  const { activeStock, updateActiveStock } = useActiveStockDataStore()
  const [chartFilter, setChartFilter] = useState('1D')

  const getCandleData =  (val) => {
    if(val === "1D"){
      getIntradayChart()
    }else{
      getHistoricalData()
    }
  }

  const getIntradayChart = async () => {
    try{
      const res = await axios(`${process.env.NEXT_PUBLIC_MD_BE_URI}/chart/getIntraDayData`, {
        params: {
          symbol: activeStock?.instrumentKey
        }
      })

      const candles = res.data.data.candles
      const ChartData = candles.map((data) => ({ x: new Date(data[0]) , y: [data[1], data[2], data[3], data[4]]}))
      ChartData.reverse()

      setValue({
        options: {
          chart: {
            id: ''
          },
          xaxis: {
            type: 'datetime',
            labels: {
              datetimeUTC: false
            }
          },
          tooltip: {
            enabled: false
          }
        },
        series: [{
          data: ChartData
        }]
      })
    }catch(err){
      console.log(err)
    }
  }

  const getHistoricalData = async () => {
    try{
      const res = await axios('http://localhost:4000/chart/getHistoricalData', {
        params: {
          symbol: activeStock?.instrumentKey,
          filter: chartFilter
        }
      })

      const candles = res.data.data.candles
      const ChartData = candles.map((data) => ({ x: new Date(data[0]) , y: [data[1], data[2], data[3], data[4]]}))
      ChartData.reverse()

      setValue({
        options: {
          chart: {
            id: ''
          },
          xaxis: {
            type: 'datetime',
            labels: {
              datetimeUTC: false
            }
          }
        },
        series: [{
          data: ChartData
        }]
      })
    }catch(err){
      console.log(err)
    }
  }
  
  useEffect(() => {
    if(activeStock?.name){
      getCandleData(chartFilter)
    }
    
  }, [activeStock, chartFilter])

  return (
    <div className='overflow-y-hidden'>
      {activeStock?.name ? (
        <>
          <div className='mx-4 flex items-center justify-between '>
              <p>{activeStock.name} <span className="text-gray-400 text-sm">({activeStock.instrumentKey})</span></p>

            <div>
              <button onClick={() => openOrderModal('Buy')} className='border border-green-700 text-white text-medium font-medium bg-green-700 p-1 px-2 mr-2 rounded'>Buy</button>
              <button onClick={() => openOrderModal('Sell')} className='border border-red-700 text-white text-medium font-medium bg-red-700 p-1 px-2 rounded'>Sell</button>
            </div>
          </div>
          <div>
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b p-1 pb-0 mx-4 border-gray-200 dark:border-gray-700 dark:text-gray-400">
                {filters?.map((data) => (
                  <li key={data} onClick={() => setChartFilter(data)} class="me-2 cursor-pointer">
                    <a class={chartFilter === data ? "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"}>{data}</a>
                </li>
                ) )}
            </ul>
          </div>
          <div className='p-2'>
              <Chart options={value?.options} series={value?.series} type="candlestick" width={1200} height={500} />
          </div>
        </>
      ) : <div className='flex justify-center items-center overflow-hidden'>
        <img className="" src="./stock.svg" />
      </div>}
    </div>
  )
}

export default StockChart