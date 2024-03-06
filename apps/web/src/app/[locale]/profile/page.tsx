'use client'

import isLogged from '@/actions/isLogged';
import { useRouter } from 'next/navigation';
export default function Profile({ params }: Readonly<{ params: { locale: string } }> ) {

  const router = useRouter();

  async function submit() {

    localStorage.removeItem("token");
    router.push(`/${params.locale}/login`);

  }

  const userState = isLogged();

  if(!userState) {
    router.push(`/${params.locale}/login`);
  }

  return (
    <main>
      <div>
        <button onClick={submit} className="nes-btn is-primary">Logout</button>
      </div>
    </main>
  );
}
