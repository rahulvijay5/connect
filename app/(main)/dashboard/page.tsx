import ClientPage from '@/components/ClientUserDetails'
import {ServerUserDetails, isUserAuthenticated, userDetails} from '@/components/ServerUserDetails'
import React from 'react'

const Dashboard = async () => {
    const user = await isUserAuthenticated();
    const userdetails = userDetails();
  return (
    <>
        <div className="flex-center">
           {/* <ClientPage/>  */}
           {/* <ServerUserDetails/> */}
           {user && <div>User is authenticated</div>}
           
        </div>


    </>
  )
}

export default Dashboard