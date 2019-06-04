import * as constants from '../constants/reports';
import * as types from './Types'
import reportStore from '../stores/report-store';
import { store } from '../stores'

export const openModal = (modalType) => ({
  type: constants.OPEN_MODAL,
  modalType
})

export const closeModal = () => ({
  type: constants.CLOSE_MODAL
})

export const closeSearch = () => ({
  type: constants.CLOSE_SEARCH
})

export const editModal = (modalType) => ({
  type: constants.EDIT_RANGE,
  modalType
})

export const getJumperName = (jumperName) => ({
  type: constants.JUMPER_NAME,
  jumperName
})

export const rangeSubmit = (payload) => ({
  type: constants.DATE_SUBMIT,
  payload
})

export function GetInvoiceCategory(userData) {
  return
}

export const getLoadHistory = (data) => ({
  type: types.GET_LOAD_HISTORY,
  payload: data
})

export const completedLoadJumperChangeConfirmModal = (data) => ({
  type: "completedLoadJumperChangeConfirmModal",
  payload: data
})

export const updateLoadHistory = (data) => {
  console.log("data from action ", data)
   store.dispatch({
    type: types.UPDATE_LOAD_HISTORY,
    payload: data
  })
}
