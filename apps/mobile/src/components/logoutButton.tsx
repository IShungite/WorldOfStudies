import Button from '@/components/shared/Button'
import { useSession } from '@/providers/session.provider'

export default function LogoutButton() {
  const { signOut } = useSession()

  return <Button onPress={signOut} title="Logout" color="red" />
}
