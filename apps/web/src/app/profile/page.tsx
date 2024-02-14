'use client'

import isLogged from '@/actions/isLogged';
import { useRouter } from 'next/navigation'
export default function Profile() {

  const router = useRouter();

  async function submit() {

    localStorage.removeItem("token");
    router.push('/login');

  }

  const userState = isLogged();

  if(!userState) {
    router.push('/login');
  }

  return (
    <main>
      <div>
        {localStorage.getItem("token") ? "Logged in" : "Not logged in"}
      </div>
      <div>
        <button onClick={submit}>Logout</button>
      </div>
    </main>
  );
}
