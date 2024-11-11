// pages/users.js
import React from 'react';

// This function runs on the server-side and fetches the users data from the API
export async function getServerSideProps() {
  try {
    // Fetch data from the API route we created earlier
    const res = await fetch('http://localhost:3000/api/getUsers');
    const data = await res.json();

    if (!data.users) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        users: data.users, // Pass the users data as props
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}

// This component will display the list of users
export default function UsersPage({ users }) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
