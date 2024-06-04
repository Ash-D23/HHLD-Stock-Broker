'use client'

import { useState } from "react"

const AddWatchlistModal = ({ closeWatchListModal, handleAddWatchlist }) => {

  const [watchListText, setWatchListText] = useState('')

  const handleSubmit = () => {
    handleAddWatchlist(watchListText)
    setWatchListText('')
    closeWatchListModal('')
  }

  return (
    <div className='absolute top-0  bg-gray-600 backdrop-blur-sm bg-opacity-25 z-50 flex w-screen h-screen justify-center items-center'>
        <div class="overflow-y-auto overflow-x-hidden watchlist-modal">      
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                      Add Watchlist
                  </h3>
                  <button type="button" onClick={closeWatchListModal} class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span class="sr-only">Close modal</span>
                  </button>
              </div>
              <div className="flex flex-col my-1 p-4">
                <div class="mb-4">
                  <input type="text" id="default-input" value={watchListText} onChange={(e) => setWatchListText(e.target.value)} class="bg-gray-50 border-b border-gray-300 text-white text-sm w-full p-2.5 pl-1 outline-none	dark:placeholder-gray-400 dark:bg-gray-700 dark:text-white" placeholder="Add Watchlist"/>
                </div>
                <button type="button" onClick={handleSubmit} class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700">Add Watchlist</button>
              </div>
            </div> 
        </div>
    </div>
  )
}

export default AddWatchlistModal