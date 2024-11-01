'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthResponse } from '@/interfaces/authResponse';
import { useTranslations } from 'next-intl';

export default function Login({ params }: Readonly<{ params: { locale: string } }> ) {
  const router = useRouter();
  const t = useTranslations('Login');
  const [spinner, setSpinner] = useState(false);
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSpinner(true);
 
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ "email" : email, "password" : password }),
      });
      const body: AuthResponse = await response.json();
   
      if (response.ok && body) {
        localStorage.setItem("token",JSON.stringify(body.token));
        router.push(`/${params.locale}/profile`);
      } else {
        alert(new Error(response.status + ' - ' + response.statusText));
      }
    } catch(error) {
      alert(error);
    }
    setSpinner(false);
  }

  if(spinner) {
    return (
      <div className="nes-container with-title is-centered">
        <p>Loading...</p>
      </div>
    )
  }
 
  return (
    <div className="nes-container with-title is-centered">
      <form onSubmit={handleSubmit}>
        <input className="nes-input" type="email" name="email" placeholder={t("mail")} required />
        <input className="nes-input" type="password" name="password" placeholder={t("password")} required />
        <button className="nes-btn is-primary" type="submit">{t("login")}</button>
      </form>
      <p>{t("redirectRegister")} <a href={`/${params.locale}/register`}>{t("here")}</a> {t("redirectRegister2")}</p>
    </div>
  )
}
