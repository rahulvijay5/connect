import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const UserNotFound = () => {
  return (
    <div className='mfc flex-col'>
        <div className='flex-center gap-4'>
        <span className="text-3xl">404</span> User Not Found.
        </div>
        <br />
        <div>
        <Link href={`/`} ><Button variant="link" className="hover:text-sky-500">Go to Home</Button></Link>
        </div>
    </div>
  )
}

export default UserNotFound