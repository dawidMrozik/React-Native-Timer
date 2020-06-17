import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262522',
    alignItems: 'center',
  },
  timerWrapper: {
    width: '100%',
    backgroundColor: '#fc9d03',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timerIdle: {
    backgroundColor: '#616161',
  },
  timerRunning: {
    backgroundColor: '#32a852',
  },
  timerRest: {
    backgroundColor: '#ebb242',
  },
  timerCounter: {
    color: 'white',
    fontSize: 80,
  },
  descriptionText: {
    color: 'white',
    fontWeight: '200',
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    padding: 30,
  },
  button: {
    backgroundColor: '#abc',
    borderRadius: 3,
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#c9c9c9',
  },
  buttonAddRest: {
    backgroundColor: '#3277a8',
    borderColor: '#2c6791',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#9c9c9c',
  },
  mainControllers: {},
  mainButton: {
    height: 50,
    backgroundColor: '#32a852',
  },
  keepAwakeContainer: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepAwakeText: {
    color: '#fff',
  },
  timerButtonRest: {
    backgroundColor: '#ebb242',
  },
  secondaryButtons: {
    width: '100%',
    flexDirection: 'row',
  },
  secondaryButton: {
    flex: 1,
    marginTop: 10,
  },
  stopButton: {
    marginRight: 5,
    backgroundColor: '#b03527',
  },
  finishButton: {
    backgroundColor: '#d4672c',
  },
  pauseButton: {
    marginLeft: 5,
    backgroundColor: '#7d7675',
  },
  restTimeContainer: {
    flexDirection: 'row',
  },
  restTimeButton: {
    flex: 1,
    backgroundColor: '#3277a8',
    borderRadius: 0,
  },
  restTimeFirstButton: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderRightWidth: 1,
    borderRightColor: '#2c6791',
  },
  restTimeLastButton: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#2c6791',
  },
  restTimeSelectedButton: {
    backgroundColor: '#1c415c',
    borderWidth: 1,
    borderColor: '#2c6791',
    borderLeftColor: '#2c6791',
    borderRightColor: '#2c6791',
  },
  modalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  resultsModalView: {
    flexDirection: 'column',
  },
  resultsText: {
    color: '#fff',
    marginLeft: 30,
    fontSize: 15,
  },
  modalBg: {
    backgroundColor: '#3277a8',
    color: '#fff',
  },
  modalConfirmBtn: {
    backgroundColor: '#32a852',
    color: '#fff',
    paddingHorizontal: 20,
    height: 40,
  },
  modalCancelBtn: {
    color: '#ccc',
    height: 40,
  },
  timeSeparator: {
    fontSize: 20,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'top',
    color: '#fff',
    marginHorizontal: 5,
    lineHeight: 35,
  },
})

export default styles
