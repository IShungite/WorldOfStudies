'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
 
export default function Register() {
  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')
    const email = formData.get('email')
    const password = formData.get('password')
 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({ "firstName" : firstName, "lastName" : lastName, "email" : email, "password" : password }),
    })
 
    if (response.ok) {
      router.push('/login');
    } else {
      alert("TODO : handle errors");
    }
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <input type="firstName" name="firstName" placeholder="firstName" required />
      <input type="lastName" name="lastName" placeholder="lastName" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  )
}