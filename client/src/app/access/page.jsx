"use client"
import { Suspense } from 'react'
import AccessComponent from '../_components/AccessComponent'

const Access = () => {
    
    return (
        <Suspense>
            <AccessComponent />
        </Suspense>
    )
}

export default Access