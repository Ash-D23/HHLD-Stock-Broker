'use client'
import React, { useEffect, useState } from 'react'
import SideBar from '../_components/sidebar'
import { useRouter } from 'next/navigation'
import Main from '../_components/Main'
import PlaceOrder from '../_components/PlaceOrder'
import { useUserAccessDataStore } from '../zustand/useUserAccessDataStore'
import axios from 'axios'

const Tabs = ['Dashboard', 'Orders', 'Positions', 'Portfolio']

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [isModal, setIsModal] = useState(false)
    const [modalType, setModalType] = useState('Buy')
    const [showProfile, setShowprofile] = useState(false)
    const { accessToken, userData, clearUserData, setAccessToken } = useUserAccessDataStore()

    const router = useRouter()

    const openOrderModal = (type) => {
        setIsModal(true)
        setModalType(type)
    }

    const closeOrderModal = () => setIsModal(false)

    useEffect(() => {
        if(!accessToken){
            router.push("/")
        }
    }, [accessToken])

    const Logouthandler = async () => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_MD_BE_URI}/logout`,{
                accessToken: accessToken
            })
            setShowprofile(false)
            clearUserData()

        }catch(err){
            console.log(err)
        }
    }
 
 return (
   <div className='h-screen flex box-content'>
       <div className='w-1/5 relative'>
           <SideBar openOrderModal={openOrderModal} closeOrderModal={closeOrderModal} setActiveTab={setActiveTab} />
           { isModal ? <PlaceOrder closeOrderModal={closeOrderModal} modalType={modalType} setActiveTab={setActiveTab} /> : null }
       </div>
       <div className='w-4/5 h-screen'>
            <div className='p-2 h-2/12'>
                <div className="flex justify-between items-center text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px">
                    {
                        Tabs?.map((tab) => (
                            <li key={tab} onClick={() => setActiveTab(tab)} className="me-2 cursor-pointer">
                                <a className={`${activeTab !== tab ? 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300' : 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'}`}>{tab}</a>
                            </li>
                        ))
                    }
                    </ul>
                    <div className='px-4 overflow-hidden'>
                        
                        <div onClick={() => setShowprofile( prev => !prev)} id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" class=" cursor-pointer flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 dark:text-white" type="button">
                            <div className="relative w-7 h-7 overflow-hidden bg-gray-200 rounded-full">
                                <svg className="absolute w-8 h-8 text-gray-400 -left-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                            </div>
                            <p className='inline-block py-4 pl-2 font-medium text-medium rounded-t-lg dark:text-gray-400 hover:text-blue-500 '>{ userData?.user_name ? userData.user_name.split(" ")[0] : "Profile" }</p>
                            <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </div>


                        { showProfile ? <div id="dropdownAvatarName" class="z-10 absolute top-12 right-3 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <div class="px-3 py-3 text-sm text-gray-900 dark:text-white">
                                <div class="font-medium ">Profile</div>
                                <div class="truncate"></div>
                            </div>
                            {/* <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                                <li>
                                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                </li>

                            </ul> */}
                            <div class="cursor-pointer">
                                <a onClick={Logouthandler} class="block px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                            </div>
                        </div> : null }

                    </div>
                </div>
            </div>
           <div className='h-10/12'>
               <Main activeTab={activeTab} openOrderModal={openOrderModal} />
           </div>
       </div>
   </div>
 )
}

export default Dashboard
