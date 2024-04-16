import { Button } from '@/components/ui/button'
import React from 'react'

const PendingRequests = () => {
  return (
    <div>
        <Button variant="link" className="hover:text-sky-500">Pending requests</Button>
        {/* this will cause a new map to show over all the requests that are not reviewed till now. */}
    </div>
  )
}

export default PendingRequests