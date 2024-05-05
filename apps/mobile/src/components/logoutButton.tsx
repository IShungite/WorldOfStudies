import { Button } from '@rneui/base'

import { useSession } from '@/providers/session.provider'

export default function LogoutButton() {
  const { signOut } = useSession()

  return (
    <Button onPress={signOut} color="error">
      Logout
    </Button>
  )
}
