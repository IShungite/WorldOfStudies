import { Button } from '@rneui/base'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
