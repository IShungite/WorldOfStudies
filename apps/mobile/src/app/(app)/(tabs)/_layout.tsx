import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Redirect, Tabs } from 'expo-router'
import { useAtom } from 'jotai'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

import TabIcon from '@/components/TabIcon'
import Header from '@/components/header'
import SelectCharacter from '@/components/selectCharacter'
import { selectedCharacterAtom } from '@/providers/selected-character'

const tabBarLabel = () => {
  return null
}

export default function TabLayout() {
  const { t } = useTranslation()

  const [selectedCharacterResponse] = useAtom(selectedCharacterAtom)
  const selectedCharacter = selectedCharacterResponse || null

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  if (!selectedCharacter) {
    return <Redirect href="/login" />
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          header: () => (
            <SafeAreaView>
              <Header character={selectedCharacter} onClick={handlePresentModalPress} />
            </SafeAreaView>
          ),
        }}
      >
        {/* Shop Tab */}
        <Tabs.Screen
          name="shop"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/shop.webp`)}
                label={t('tab_shop')}
                withBorderLeft={false}
              />
            ),
          }}
        />
        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/profile.png`)}
                label={t('tab_profile')}
              />
            ),
          }}
        />
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon isSelected={focused} icon={require(`@/assets/images/tabs/home.webp`)} label={t('tab_home')} />
            ),
          }}
        />
        {/* Exercises Tab */}
        <Tabs.Screen
          name="exercices"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/exercices.webp`)}
                label={t('tab_exercices')}
              />
            ),
          }}
        />
        {/* Statistics Tab */}
        <Tabs.Screen
          name="statistics"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/statistics.webp`)}
                label={t('tab_statistics')}
                fontSize={13}
                withBorderRight={false}
              />
            ),
          }}
        />
      </Tabs>
      <SelectCharacter sheetRef={bottomSheetModalRef} />
    </>
  )
}
