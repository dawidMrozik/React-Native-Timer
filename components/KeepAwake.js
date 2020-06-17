import React, { useState, useEffect } from 'react'
import { View, Text, Switch } from 'react-native'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import styles from '../styles'
import { LocalStorage } from '../helpers'

const KeepAwake = () => {
  const INITIAL_KEEP_AWAKE = false

  const [keepAwake, setKeepAwake] = useState(INITIAL_KEEP_AWAKE)
  const [store, setStore] = useState(new LocalStorage('settings'))

  useEffect(() => {
    const checkStore = async () => {
      await store.prepareStore()

      const keepAwake_ls = store.get('keepAwake')

      if (!keepAwake_ls) {
        store.set('keepAwake', keepAwake)
      } else {
        setKeepAwake(keepAwake_ls)
      }
    }

    checkStore()
  }, [])

  useEffect(() => {
    if (keepAwake) activateKeepAwake()
    else deactivateKeepAwake()
  }, [keepAwake])

  const toggleKeepAwake = () => {
    store.set('keepAwake', !keepAwake)
    setKeepAwake(!keepAwake)
  }

  return (
    <View style={styles.keepAwakeContainer}>
      <Text style={styles.keepAwakeText}>Keep your screen awake?</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#ffff80' }}
        thumbColor={keepAwake ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleKeepAwake}
        value={keepAwake}
      />
    </View>
  )
}

export default KeepAwake
