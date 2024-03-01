'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl';
 
export default function Register({ params }: Readonly<{ params: { locale: string } }> ) {
  const router = useRouter();
  const t = useTranslations('Register');
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
 
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ "firstName" : firstName, "lastName" : lastName, "email" : email, "password" : password }),
      })
      if (response.ok) {
        router.push(`/${params.locale}/login`);
      } else {
        alert(new Error(response.status + ' - ' + response.statusText));
      }
    } catch(error) {
      alert(error);
    }

  }
 
  return (
    <div className="nes-container with-title is-centered">
      <form onSubmit={handleSubmit}>
        <input className="nes-input" type="firstName" name="firstName" placeholder={t("firstName")} required />
        <input className="nes-input" type="lastName" name="lastName" placeholder={t("lastName")} required />
        <input className="nes-input" type="email" name="email" placeholder={t("mail")} required />
        <input className="nes-input" type="password" name="password" placeholder={t("password")} required />
        <button className="nes-btn is-primary" type="submit">{t("register")}</button>
      </form>
    </div>

  )
}