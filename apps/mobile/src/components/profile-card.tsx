import { Character } from '@world-of-studies/api-types/src/character/character'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import BerryIcon from '@/components/shared/BerryIcon'
import Container from '@/components/shared/Container'
import Text from '@/components/shared/Text'

type Props = {
  character: Character
}

const ProfileCard: React.FC<Props> = ({ character }) => {
  const { t } = useTranslation()

  return (
    <Container>
      <Text style={styles.productName}>
        {t('character')} : {character.name}
      </Text>
      <Text style={styles.productName}>
        {t('school')} : {character.schoolName}
      </Text>
      <Text style={styles.productName}>
        {t('promotion')} : {character.promotionName}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>
          {t('balance')} : {character.berries}
        </Text>
        <BerryIcon size={24} />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  productName: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
  },
  productPrice: {
    color: '#fff',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
})

export default ProfileCard
