import { getUserConnections } from '@/actions/users/getUserConnections';
import { Connection } from '@/lib/types';

const MyConnections = async ({ userId }: { userId: string }) => {
  let userConnections: Connection[] = [];
  
  try {
    const userConnections = await getUserConnections(userId);
    console.log(userConnections)
  } catch (error) {
    console.error('Error fetching connections:', error);
  }
  return (
    <div className='border-y-2 py-3 my-1'>
      <h2 className='text-emerald-400'>Random Connections</h2>
      <ul>
        {userConnections.map((connection) => (
          <li key={connection.userId}>
            User ID: {connection.connectedUserId}, Level: {connection.level}
            hello
          </li>
        ))}
      </ul>
    </div>
  );
};
export {MyConnections};