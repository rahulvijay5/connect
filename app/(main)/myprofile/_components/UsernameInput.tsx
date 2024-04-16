"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UsernameInput = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const response = await fetch('/api/auth/success', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      router.push('/myprofile');
    }
  };

  return (
    <div className='mfc flex-col w-1/4'>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className='p-4 mb-2'
      />
      <Button onClick={handleSubmit} className='w-full'>Submit</Button>
    </div>
  );
};

export default UsernameInput;