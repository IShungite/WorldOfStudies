import { Button } from '@rneui/base'
import { Text, View } from 'react-native'

import { useSession } from '@/providers/session.provider'

export default function App() {
  const { signOut } = useSession()
  return (
    <View>
      <Text>Home</Text>
      <Button onPress={signOut}>Logout</Button>
    </View>
  )
}
