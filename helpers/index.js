import { AsyncStorage } from 'react-native'
import { Alert } from 'react-native'

export const formatTimer = (time) => {
  const mins = Math.floor(time / 60)
  const secs = time - mins * 60

  return `${formatNumber(mins)}:${formatNumber(secs)}`
}

const formatNumber = (number) => `0${number}`.slice(-2)

export const makeMinsAndSecsArray = () => {
  const arr = []

  for (let i = 0; i < 60; i++) {
    arr.push({
      value: i.toString(),
      label: formatNumber(i),
    })
  }

  return arr
}

export const calculateSecondsFromMinsAndSecsStrings = (mins, secs) => {
  return parseInt(mins * 60) + parseInt(secs)
}

export class LocalStorage {
  constructor(storeName) {
    this.storeName = storeName
    this.store = null
    this.storeJSON = null
  }

  async prepareStore() {
    try {
      this.store = await AsyncStorage.getItem(this.storeName)

      if (!this.store) {
        await AsyncStorage.setItem(this.storeName, '{}')
        this.store = await AsyncStorage.getItem(this.storeName)
      }

      this.storeJSON = JSON.parse(this.store)
    } catch (e) {
      Alert.alert('Error accessing memory')
    }
  }

  async _save() {
    await AsyncStorage.setItem(this.storeName, JSON.stringify(this.storeJSON))
  }

  set(key, value) {
    this.storeJSON[key] = value
    this._save()
  }

  get(key) {
    if (key in this.storeJSON) {
      return this.storeJSON[key]
    } else {
      new Error('Key does not exist')
    }
  }

  async remove(key) {
    delete this.storeJSON[key]
    this._save()
  }
}
