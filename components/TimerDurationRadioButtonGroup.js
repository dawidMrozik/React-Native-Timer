import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native'
import styles from '../styles'
import {
  Select,
  SelectItem,
  inputButtonDefaultStyles,
} from 'react-native-propel-kit'
import {
  makeMinsAndSecsArray,
  calculateSecondsFromMinsAndSecsStrings,
  LocalStorage,
  formatTimer,
} from '../helpers'
import Modal from './Modal'

Object.assign(inputButtonDefaultStyles, {
  view: {
    ...inputButtonDefaultStyles.view,
    backgroundColor: '#fafafa',
    marginBottom: 12,
    borderRadius: 4,
    minWidth: '40%',
    borderColor: '#C5CAE9',
    paddingHorizontal: 10,
  },
  text: {
    color: 'black',
    padding: 12,
    fontSize: 18,
  },
})

const TimerDurationRadioButtonGroup = ({
  setRestDurationInSeconds,
  restDurationInSeconds,
}) => {
  const INITIAL_MINS = '3'
  const INITIAL_SECS = '0'
  const DEFAULT_REST_DURATIONS = [60, 90, 120]
  const modalDialogRef = useRef(null)

  const minsAndSecsArray = makeMinsAndSecsArray()
  const [mins, setMins] = useState(INITIAL_MINS)
  const [secs, setSecs] = useState(INITIAL_SECS)
  const [rests, setRests] = useState(DEFAULT_REST_DURATIONS)
  const [restDurationSelected, setRestDurationSelected] = useState(0)
  const [store, setStore] = useState(new LocalStorage('rest_durations'))

  useEffect(() => {
    const checkStore = async () => {
      await store.prepareStore()

      const rests_ls = store.get('rests')

      if (!rests_ls) {
        store.set('rests', rests)
      } else {
        setRests(rests_ls)
      }

      let last_selected = store.get('last_selected')

      if (!last_selected) {
        store.set('last_selected', 0)
      } else {
        setRestDurationSelected(last_selected)
      }
    }

    checkStore()
  }, [])

  useEffect(() => {
    setRestDurationInSeconds(rests[restDurationSelected])
  }, [rests, restDurationSelected])

  const handleMinsChange = (mins) => {
    setMins(mins)
  }

  const handleSecsChange = (secs) => {
    setSecs(secs)
  }

  const handleConfirm = () => {
    let result = calculateSecondsFromMinsAndSecsStrings(mins, secs)

    if (result < 5) {
      result = 5
      ToastAndroid.showWithGravity(
        'Minimum rest duration is 5 seconds',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
    }

    const tmp = rests
    tmp[restDurationSelected] = result
    store.set('rests', tmp)
    setRests(tmp)
    setRestDurationInSeconds(result)
  }

  const setRestDurationInSecondsAndSelect = (duration, toSelect) => {
    setRestDurationInSeconds(duration)
    store.set('last_selected', toSelect)
    setRestDurationSelected(toSelect)
  }

  const getCurrentMinsAsString = () => {
    return Math.floor(rests[restDurationSelected] / 60).toString()
  }

  const getCurrentSecsAsString = () => {
    return (rests[restDurationSelected] % 60).toString()
  }

  return (
    <View>
      <Modal
        title="Add a new rest duration"
        message="It will change your currently selected duration"
        confirmTitle="SAVE"
        modalRef={modalDialogRef}
        onCancel={() => {
          setMins(INITIAL_MINS)
          setSecs(INITIAL_SECS)
        }}
        onConfirm={handleConfirm}
      >
        <Select
          placeholder="Minutes"
          key={'mins'}
          style={{ justifyContent: 'flex-end' }}
          initialValue={getCurrentMinsAsString()}
          value={mins}
          onChange={handleMinsChange}
        >
          {minsAndSecsArray.map((i) => (
            <SelectItem
              value={i.value}
              label={i.label}
              key={`min:${i.value}`}
            />
          ))}
        </Select>
        <Text style={styles.timeSeparator}>:</Text>
        <Select
          placeholder="Seconds"
          key={'secs'}
          style={{ justifyContent: 'flex-start' }}
          initialValue={getCurrentSecsAsString()}
          value={secs}
          onChange={handleSecsChange}
        >
          {minsAndSecsArray.map((i) => (
            <SelectItem
              value={i.value}
              label={i.label}
              key={`sec:${i.value}`}
            />
          ))}
        </Select>
      </Modal>

      <Text style={[styles.descriptionText, { marginBottom: 5 }]}>
        select your rest duration
      </Text>
      <View style={styles.restTimeContainer}>
        <TouchableOpacity
          onPress={() => setRestDurationInSecondsAndSelect(rests[0], 0)}
          disabled={restDurationSelected === 0}
          style={[
            styles.button,
            styles.restTimeButton,
            styles.restTimeFirstButton,
            restDurationSelected === 0 ? styles.restTimeSelectedButton : null,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText]}>{formatTimer(rests[0])}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRestDurationInSecondsAndSelect(rests[1], 1)}
          disabled={restDurationSelected === 1}
          style={[
            styles.button,
            styles.restTimeButton,
            restDurationSelected === 1 ? styles.restTimeSelectedButton : null,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText]}>{formatTimer(rests[1])}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRestDurationInSecondsAndSelect(rests[2], 2)}
          disabled={restDurationSelected === 2}
          style={[
            styles.button,
            styles.restTimeButton,
            restDurationSelected === 2 ? styles.restTimeSelectedButton : null,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText]}>{formatTimer(rests[2])}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (modalDialogRef.current) {
              modalDialogRef.current.show()
            }
          }}
          style={[
            styles.button,
            styles.restTimeButton,
            styles.restTimeLastButton,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText]}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TimerDurationRadioButtonGroup
