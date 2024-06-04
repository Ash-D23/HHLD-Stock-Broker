import React from 'react'
import StockChart from './StockChart'
import Orders from './Orders'
import Portfolio from './Portfolio'
import Positions from './Positions'

const Main = ({ activeTab, openOrderModal }) => {
  
    switch(activeTab){
        case 'Dashboard' : 
            return <StockChart openOrderModal={openOrderModal} />
        case 'Orders' :
            return <Orders />
        case 'Portfolio' :
            return <Portfolio />
        case 'Positions': 
            return <Positions />
        default:
            return <StockChart openOrderModal={openOrderModal} />
    }
}

export default Main