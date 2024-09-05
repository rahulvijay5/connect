import { getUserConnections } from '@/actions/users/getUserConnections';
import { Connection, Level } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export async function MyConnections({ userId }: { userId: string }) {
  let connections: Connection[] = [];
  let error: string | null = null;

  try {
    connections = await getUserConnections(userId);
  } catch (err) {
    error = "Failed to fetch connections. Please try again later.";
    console.error("Error fetching connections:", err);
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;
  }

  return (
    <div className='py-3 my-1'>
      {connections.length > 0 ? (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {connections.map((connection: Connection) => (
            <li key={connection.id} className='bg-gray-500 shadow-md rounded-lg p-4 flex flex-col items-center text-black dark:text-white'>
              <Image
                src={connection.connectedUser.profilePicture || '/placeholder.svg'}
                alt={connection.connectedUser.username}
                width={64}
                height={64}
                className='rounded-full mb-2'
              />
              <h3 className='font-bold text-lg'>{connection.connectedUser.username}</h3>
              <p className='text-sm text-gray-600 mb-2'>
                {connection.connectedUser.given_name} {connection.connectedUser.family_name}
              </p>
              <p className='text-sm dark:text-white text-black mb-2'>Level: {Level[connection.level]}</p>
              <Link
                href={`/${connection.connectedUser.username}`}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
              >
                View Profile
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-center text-gray-600'>No connections found.</p>
      )}
    </div>
  );
}