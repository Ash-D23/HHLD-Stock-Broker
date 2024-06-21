"use client"
import { redirect } from "next/navigation";
import { useUserAccessDataStore } from "./zustand/useUserAccessDataStore";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'

export default function Home() {
  const { accessToken } = useUserAccessDataStore()
  const router = useRouter()
  
  useEffect(() =>{
    if(accessToken){
      redirect("/dashboard")
    }
  }, [accessToken])

  const LoginToUpstoxHandler = () => {
    router.push("https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=a73b5ab0-cdb4-420e-b20a-3a9fe4fa706c&redirect_uri=http%3A%2F%2Fhhld-stock-broker.vercel.app%2Faccess")
  }

  return (
    <div className="box-content w-screen h-screen flex ">
      <div className="w-2/5 p-6 pb-5 pl-8 flex items-end">
        <div className="flex flex-col h-4/5">
          <p className="text-8xl font-serif dark:text-orange-200	subpixel-antialiased">Go Traders</p>
          <p className="text-2xl font-semibold p-2 ml-2 font-sans text-gray-500 antialiased">Welcome to your own Stock Trading App</p>

          <div className="mt-8 flex justify-center items-center">
            <button onClick={LoginToUpstoxHandler} type="button" class="px-6 py-3.5 inline-flex items-center text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Login to Upstox
              <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </button>
          </div>

          <div className="flex items-end grow justify-center">
            <p className="text-xl font-semibold p-2 ml-2 font-sans text-gray-600 antialiased">Copyrights © 2024 All Rights Reserved by Ashutosh.</p>
          </div>
        </div>
      </div>
      <div className="w-3/5 flex justify-center items-center">
        <img className="h-full" src="./stock2.svg" />
      </div>
    </div>
  );
}
