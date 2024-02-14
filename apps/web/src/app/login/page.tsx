'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AuthResponse } from '@/interfaces/authResponse';

export default function Login() {
  const router = useRouter();
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      }, 
      body: JSON.stringify({ "email" : email, "password" : password }),
    });
    const body: AuthResponse = await response.json();
 
    if (response.ok && body) {
      localStorage.setItem("token",JSON.stringify(body.token));
      router.push('/profile');
    } else {
      alert("TODO : handle errors");
    }
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  )
}