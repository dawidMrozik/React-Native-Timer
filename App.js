import React, { useState, useRef, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Vibration,
  Animated,
  Dimensions,
  Easing,
  Switch,
  Alert,
} from 'react-native'
import TimerDurationRadioButtonGroup from './components/TimerDurationRadioButtonGroup'
import { formatTimer } from './helpers'
import styles from './styles'
import { BackdropProvider } from 'react-native-propel-kit'
import DoubleTap from './components/DoubleTap'
import KeepAwake from './components/KeepAwake'
import Modal from './components/Modal'

export default function App() {
  const TIMER_ADD_REST_DURATION = 30

  const [timerState, setTimerState] = useState('idle')
  const [timerCurrentSecond, setTimerCurrentSecond] = useState(0)
  const [timer, setTimer] = useState(formatTimer(timerCurrentSecond))
  const [restDurationInSeconds, setRestDurationInSeconds] = useState(120)
  const [rest, setRest] = useState(formatTimer(restDurationInSeconds))
  const [timerIntervalId, setTimerIntervalId] = useState(null)
  const [restIntervalId, setRestIntervalId] = useState(null)
  const [restCurrentSecond, setRestCurrentSecond] = useState(
    restDurationInSeconds
  )
  const [roundNumber, setRoundNumber] = useState(1)
  const [restNumber, setRestNumber] = useState(0)
  const resultsModalRef = useRef(null)
  const [totalRestDuration, setTotalRestDuration] = useState(0)

  const screenHeight = Math.round(Dimensions.get('window').height)
  const normalTimerWrapperHeight =
    screenHeight - 350 < 150 ? 150 : screenHeight - 350
  const extendedTimerWrapperHeight = screenHeight - 150

  const resizeTimerAnim = useRef(new Animated.Value(normalTimerWrapperHeight))
    .current

  const timerBackground = useRef(new Animated.Value(0)).current
  const timerBackgroundAnim = timerBackground.interpolate({
    inputRange: [-1, 0, 1, 2, 3, 4, 5, 6],
    outputRange: [
      'rgb(97, 97, 97)',
      'rgb(97, 97, 97)',
      'rgb(50, 168, 82)',
      'rgb(97, 97, 97)',
      'rgb(235, 178, 66)',
      'rgb(97, 97, 97)',
      'rgb(65, 99, 140)',
      'rgb(97, 97, 97)',
    ],
  })

  useEffect(() => {
    pickTimerBackgroundColor()
  }, [timerState])

  const handleTimer = () => {
    switch (timerState) {
      case 'idle':
        startTimer()
        extendTimerWrapperAnim()
        break
      case 'running':
        startRest()
        break
      case 'timerPaused':
        startTimer(timerCurrentSecond)
        break
      case 'restPaused':
        startRest(restCurrentSecond)
        startTimer(timerCurrentSecond)
        break
      case 'rest':
        addRest()
        break
      case 'finished':
        showResults()
        break
      default:
        break
    }
  }

  const showResults = () => {
    if (resultsModalRef.current) {
      resultsModalRef.current.show()
    }
  }

  const handleFinishOrReset = () => {
    if (timerState === 'finished') handleReset()
    else handleFinish()
  }

  const handleFinish = () => {
    Vibration.cancel()
    setTimerState('finished')
    clearInterval(timerIntervalId)
    clearInterval(restIntervalId)
  }

  const handleReset = () => {
    setTimerState('idle')
    setTimer(formatTimer(0))
    setTotalRestDuration(0)
    shrinkTimerWrapperAnim()
    setRoundNumber(1)
    setRestNumber(0)
  }

  const extendTimerWrapperAnim = () => {
    Animated.timing(resizeTimerAnim, {
      toValue: extendedTimerWrapperHeight,
      duration: 1000,
    }).start()
  }

  const shrinkTimerWrapperAnim = () => {
    Animated.timing(resizeTimerAnim, {
      toValue: normalTimerWrapperHeight,
      duration: 1000,
    }).start()
  }

  const handlePause = () => {
    clearInterval(timerIntervalId)
    clearInterval(restIntervalId)

    if (timerState === 'running') setTimerState('timerPaused')
    if (timerState === 'rest') setTimerState('restPaused')
  }

  const startTimer = (startAt = 0) => {
    let timerSeconds = startAt
    setTimerCurrentSecond(timerSeconds)
    if (timerState !== 'restPaused') setTimerState('running')

    let timerIntervalId = setInterval(() => {
      timerSeconds++
      setTimerCurrentSecond(timerSeconds)
      setTimer(formatTimer(timerSeconds))
    }, 1000)

    setTimerIntervalId(timerIntervalId)
  }

  const startVibrations = () => {
    const ONE_SECOND_IN_MS = 1000

    const PATTERN = [
      0 * ONE_SECOND_IN_MS, // wait 0s
      1 * ONE_SECOND_IN_MS, // vibrate 1s
      1 * ONE_SECOND_IN_MS, // wait 1s, etc...
      1 * ONE_SECOND_IN_MS,
      1 * ONE_SECOND_IN_MS,
      0.3 * ONE_SECOND_IN_MS,
      0.1 * ONE_SECOND_IN_MS,
      0.3 * ONE_SECOND_IN_MS,
      0.1 * ONE_SECOND_IN_MS,
      0.2 * ONE_SECOND_IN_MS,
    ]

    Vibration.vibrate(PATTERN)
  }

  const startRest = (startAt = restDurationInSeconds, isExtending = false) => {
    let restSeconds = startAt
    setRestCurrentSecond(restSeconds)
    setRest(formatTimer(restSeconds))
    setTimerState('rest')
    let currentRestDuration = totalRestDuration - 1
    if (!isExtending) setRestNumber(restNumber + 1)

    let restIntervalId = setInterval(async () => {
      if (restSeconds === 5) startVibrations()
      restSeconds--
      setRestCurrentSecond(restSeconds)
      setRest(formatTimer(restSeconds))

      if (restSeconds === -1) {
        setRoundNumber(roundNumber + 1)
        setTimerState('running')
        clearInterval(restIntervalId)
      }

      currentRestDuration++
      setTotalRestDuration(currentRestDuration)
    }, 1000)

    setRestIntervalId(restIntervalId)
  }

  const addRest = () => {
    clearInterval(restIntervalId)
    startRest(restCurrentSecond + TIMER_ADD_REST_DURATION, true)
    Vibration.cancel()
  }

  const cancelRest = () => {
    if (timerState === 'rest') {
      clearInterval(restIntervalId)
      setRoundNumber(roundNumber + 1)
      setTimerState('running')
    }
  }

  const timerToDisplay = () => {
    if (timerState === 'running' || timerState === 'timerPaused') return timer
    if (timerState === 'rest' || timerState === 'restPaused') return rest
    if (timerState === 'finished') return timer

    return '00:00'
  }

  const renderMainButtonText = () => {
    if (timerState === 'idle') return 'START'
    if (timerState === 'running') return 'REST'
    if (timerState === 'rest') return '+30s'
    if (timerState === 'timerPaused' || timerState === 'restPaused')
      return 'RESUME'
    if (timerState === 'finished') return 'RESULTS'
  }

  const renderTimerDescription = () => {
    if (timerState === 'idle') return 'start your training below 🏋️'
    if (timerState === 'rest') return 'double tap to finish rest 👋🏽'
    if (timerState === 'timerPaused' || timerState === 'restPaused')
      return '⏸️ timer paused'
    if (timerState === 'finished') return '🏆 you can see your results below 🏆'
  }

  const changeTimerBackgroundAnim = (state) => {
    timerBackground.setValue(state - 1)

    Animated.timing(timerBackground, {
      toValue: state,
      easing: Easing.linear,
      duration: 500,
    }).start()
  }

  const pickTimerBackgroundColor = () => {
    if (timerState === 'idle') changeTimerBackgroundAnim(0)
    if (timerState === 'running') changeTimerBackgroundAnim(1)
    if (timerState === 'timerPaused') changeTimerBackgroundAnim(2)
    if (timerState === 'rest') changeTimerBackgroundAnim(3)
    if (timerState === 'restPaused') changeTimerBackgroundAnim(4)
    if (timerState === 'finished') changeTimerBackgroundAnim(5)
  }

  const renderCurrentPhase = () => {
    if (timerState === 'rest') return `Rest ${restNumber}`
    if (timerState === 'running') return `Round ${roundNumber}`
  }

  const calculateAvgRestDuration = () => {
    return restNumber !== 0
      ? formatTimer(roundTo2Digits(totalRestDuration / restNumber))
      : formatTimer(totalRestDuration)
  }

  const roundTo2Digits = (number) => {
    return Math.round((number + Number.EPSILON) * 100) / 100
  }

  return (
    <BackdropProvider>
      <View style={styles.container}>
        <Modal
          title="Your results 🏆"
          confirmTitle="OK"
          modalRef={resultsModalRef}
          modalViewStyles={styles.resultsModalView}
        >
          <Text style={styles.resultsText}>
            Total duration:{' '}
            <Text style={{ alignSelf: 'flex-end' }}>
              {formatTimer(timerCurrentSecond)}
            </Text>
          </Text>
          <Text style={styles.resultsText}>
            Rest duration: {formatTimer(totalRestDuration)}
          </Text>
          <Text style={styles.resultsText}>
            Exercise duration:{' '}
            {formatTimer(timerCurrentSecond - totalRestDuration)}
          </Text>
          <Text style={styles.resultsText}>Rounds: {roundNumber}</Text>
          <Text style={styles.resultsText}>Rests: {restNumber}</Text>
          <Text style={styles.resultsText}>
            Avarage rest duration: {calculateAvgRestDuration()}
          </Text>
        </Modal>

        <DoubleTap onDoubleTap={cancelRest} delay={300}>
          <Animated.View
            style={[
              styles.timerWrapper,
              {
                height: resizeTimerAnim,
                backgroundColor: timerBackgroundAnim,
              },
            ]}
          >
            <Text style={styles.descriptionText}>{renderCurrentPhase()}</Text>
            <Text style={styles.timerCounter}>{timerToDisplay()}</Text>
            <Text style={styles.descriptionText}>
              {renderTimerDescription()}
            </Text>
          </Animated.View>
        </DoubleTap>
        <View style={styles.buttonsContainer}>
          <View style={styles.mainControllers}>
            <TouchableOpacity
              onPress={handleTimer}
              style={[
                styles.button,
                styles.mainButton,
                timerState === 'rest' ? styles.buttonAddRest : null,
                timerState === 'running' ? styles.timerButtonRest : null,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{renderMainButtonText()}</Text>
            </TouchableOpacity>
            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                onPress={handleFinishOrReset}
                style={[
                  styles.button,
                  styles.secondaryButton,
                  timerState !== 'finished'
                    ? styles.finishButton
                    : styles.stopButton,
                ]}
                activeOpacity={0.8}
                disabled={timerState === 'idle'}
              >
                <Text style={styles.buttonText}>
                  {timerState === 'finished' ? 'RESET' : 'FINISH'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePause}
                style={[
                  styles.button,
                  styles.secondaryButton,
                  styles.pauseButton,
                ]}
                activeOpacity={0.8}
                disabled={timerState === 'finished' || timerState === 'idle'}
              >
                <Text style={styles.buttonText}>PAUSE</Text>
              </TouchableOpacity>
            </View>
            {timerState === 'idle' && <KeepAwake />}
          </View>

          {timerState === 'idle' && (
            <TimerDurationRadioButtonGroup
              setRestDurationInSeconds={setRestDurationInSeconds}
              restDurationInSeconds={restDurationInSeconds}
            />
          )}
        </View>
      </View>
    </BackdropProvider>
  )
}
