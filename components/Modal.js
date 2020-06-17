import React from 'react'
import { View, Text } from 'react-native'
import { ModalDialog } from 'react-native-propel-kit'
import styles from '../styles'

const Modal = ({
  title,
  message,
  confirmTitle = 'OK',
  onCancel,
  onConfirm = () => {},
  modalRef,
  children,
  modalViewStyles = styles.modalView,
}) => {
  return (
    <ModalDialog
      title={title}
      titleStyle={{ color: '#fff' }}
      message={message}
      messageStyle={{ fontSize: 15, color: '#ccc' }}
      headerStyle={styles.modalBg}
      bodyStyle={styles.modalBg}
      footerStyle={[styles.modalBg, { paddingTop: 40 }]}
      confirmStyle={styles.modalConfirmBtn}
      confirmTitle={confirmTitle}
      cancelStyle={styles.modalCancelBtn}
      ref={modalRef}
      onCancel={onCancel}
      onConfirm={onConfirm}
      animationType="slide"
    >
      <View style={styles.modalViewStyles}>{children}</View>
    </ModalDialog>
  )
}

export default Modal
