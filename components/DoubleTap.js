import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'

const DoubleTap = ({ onDoubleTap, delay, children }) => {
  let lastTap = null

  const handleDoubleTap = () => {
    const now = Date.now()
    if (lastTap && now - lastTap < delay) {
      onDoubleTap()
    } else {
      lastTap = now
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      {children}
    </TouchableWithoutFeedback>
  )
}

export default DoubleTap
