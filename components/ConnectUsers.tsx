"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';

const ConnectUsersButton = ({ id1, id2 }:{ id1: string; id2: string }) => {
  const [message, setMessage] = useState('');

  const handleConnectUsers = async () => {
    try {
      const response = await fetch('/api/user/connectusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id1: id1, id2: id2 })
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error connecting users:", error);
      setMessage("Error connecting users");
    }
  };

  return (
    <div className='flex-center flex-col gap-2'>
      <Button onClick={handleConnectUsers}>Connect Users</Button>
      <p className='text-red-400'>{message}</p>
    </div>
  );
};

export default ConnectUsersButton;
