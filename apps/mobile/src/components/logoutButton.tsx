import { useTranslation } from 'react-i18next'

import Button from '@/components/shared/Button'
import { useSession } from '@/providers/session.provider'

export default function LogoutButton() {
  const { signOut } = useSession()
  const { t } = useTranslation()
  return <Button onPress={signOut} title={t('logout')} color="red" />
}
