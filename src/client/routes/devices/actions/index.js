import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'react-toastify'

import { DEVICE_SOURCES } from '/store/globalReducers/actions'
import { SELECT_DEVICE } from '/store/constants'
import { updateAsyncState, updateDeviceActivity, setAsyncState } from '/store/globalReducers/ui'

export const MULTISELECT_DEVICE = 'MULTISELECT_DEVICE'
export const MULTISELECT_DEVICES = 'MULTISELECT_DEVICES'
export const MULTISELECT_ACTION = 'MULTISELECT_ACTION' // type of action to perfom on selected devices // TODO fix naming
export const MULTISELECT_ACTION_CLEAR = 'MULTISELECT_ACTION_CLEAR'

export const APPLY_FILTER = 'APPLY_FILTER'

export const DEVICE_STATE = 'DEVICE_STATE'
export const DEVICES_STATE = 'DEVICES_STATE'
export const DEVICES_BATCH_STATE = 'DEVICES_BATCH_STATE'
export const DEVICE_STATUS = 'DEVICE_STATUS'
export const DEVICES_STATUS = 'DEVICES_STATUS'
export const REFRESH_STATE = 'REFRESH_STATE'
export const REBOOT = 'REBOOT'

export const REMOVE_CONTAINER = 'REMOVE_CONTAINER'
export const RESTART_CONTAINER = 'RESTART_CONTAINER'
export const GET_CONTAINER_LOGS = 'GET_CONTAINER_LOGS'
export const CONTAINER_LOGS = 'CONTAINER_LOGS'

export const REMOVE_IMAGE = 'REMOVE_IMAGE'

export const STORE_GROUPS = 'STORE_GROUPS'
export const REMOVE_GROUP = 'REMOVE_DEVICE_GROUP'

export const CLEAN_LOGS = 'CLEAN_LOGS'
export const DEVICE_LOGS = 'DEVICE_LOGS'

export const PAGINATE = 'PAGINATE'
export const ITEMS_PER_PAGE = 'ITEMS_PER_PAGE'
export const RESET_PAGINATION = 'RESET_PAGINATION'

export function paginateTo ({ selected }) {
	return {
		type:    PAGINATE,
		payload: selected,
	}
}

export function setItemsPerPage (payload) {
	return {
		type: ITEMS_PER_PAGE,
		payload,
	}
}

export function resetPagination () {
	return {
		type: RESET_PAGINATION,
	}
}

export function multiSelectDevice (payload) {
	return {
		type: MULTISELECT_DEVICE,
		payload,
	}
}

export function multiSelectDevices (payload) {
	return {
		type: MULTISELECT_DEVICES,
		payload,
	}
}

export function multiSelectAction (payload) {
	return {
		type: MULTISELECT_ACTION,
		payload,
	}
}

export function clearMultiSelect () {
	return {
		type: MULTISELECT_ACTION_CLEAR,
	}
}

export function selectDevice (deviceId) {
	return {
		type:    SELECT_DEVICE,
		payload: deviceId,
	}
}

export function cleanLogs (payload) {
	return {
		type: CLEAN_LOGS,
		payload,
	}
}

export function asyncStoreGroups (device, groups) {
	return async dispatch => {
		dispatch(updateDeviceActivity('isStoringGroups', device, true))

		await axios.post('/api/v1/administration/group/devices', {
			operation: 'store',
			target:    [device],
			groups,
		})

		dispatch(updateDeviceActivity('isStoringGroups', device, false))
	}
}

export function asyncRemoveGroup (device, group) {
	return async dispatch => {
		dispatch(updateDeviceActivity('isRemovingGroups', device, true))

		await axios.post('/api/v1/administration/group/devices', {
			operation: 'remove',
			target:    [device],
			groups:    [group],
		})

		dispatch(updateDeviceActivity('isRemovingGroups', device, false))
	}
}

export function asyncMultiStoreGroup (devices, group) {
	return async dispatch => {
		dispatch(updateAsyncState('isStoringMultiGroups', true))

		await axios.post('/api/v1/administration/group/devices', {
			operation: 'store',
			target:    devices,
			groups:    [group],
		})

		toast.success(`${devices.length} devices updated`)
		dispatch(updateAsyncState('isStoringMultiGroups', false))
	}
}

export function asyncMultiRemoveGroup (devices, group) {
	return async dispatch => {
		dispatch(updateAsyncState('isRemovingMultiGroups', true))

		await axios.post('/api/v1/administration/group/devices', {
			operation: 'remove',
			target:    devices,
			groups:    [group],
		})

		toast.success(`${devices.length} devices updated`)
		dispatch(updateAsyncState('isRemovingMultiGroups', false))
	}
}

export function asyncRestartApplication (deviceId, application) {
	return async dispatch => {
		dispatch(setAsyncState(['isRestartingApplication', deviceId, application], true))

		try {
			const { data } = await axios.put(`/api/devices/${deviceId}/restart/${application}`)

			toast.success(data.message)
		} catch ({ response }) {
			toast.error(response.data.message)
		} finally {
			dispatch(setAsyncState(['isRestartingApplication', deviceId, application], false))
		}
	}
}

export function asyncRemoveApplication (deviceId, application) {
	return async dispatch => {
		dispatch(setAsyncState(['isRemovingApplication', deviceId, application], true))

		try {
			const { data } = await axios.delete(`/api/devices/${deviceId}/${application}`)

			toast.success(data.message)
		} catch ({ response }) {
			toast.error(response.data.message)
		} finally {
			dispatch(setAsyncState(['isRemovingApplication', deviceId, application], false))
		}
	}
}

export function asyncRefreshState (deviceId) {
	return async dispatch => {
		dispatch(setAsyncState(['isRefreshingState', deviceId], true))

		try {
			const { data } = await axios.put(`/api/devices/${deviceId}/state`)

			toast.success(data.message)
		} catch ({ response }) {
			toast.error(response.data.message)
		} finally {
			dispatch(setAsyncState(['isRefreshingState', deviceId], false))
		}
	}
}

export function fetchApplicationLogs (deviceId, application) {
	return async dispatch => {
		dispatch(setAsyncState(['isFetchingLogs', deviceId, application], true))

		try {
			const { data } = await axios.get(`/api/devices/${deviceId}/logs/${application}`)

			dispatch({
				type:    CONTAINER_LOGS,
				payload: data.data,
				meta:    {
					deviceId: deviceId,
					name:     application,
				},
			})

			toast.success(data.message)
		} catch ({ response }) {
			toast.error(response.data.message)
		} finally {
			dispatch(setAsyncState(['isFetchingLogs', deviceId, application], false))
		}
	}
}

export function fetchDevices () {
	return async dispatch => {
		dispatch(setAsyncState('isFetchingDevices', true))

		dispatch({
			type:    DEVICES_STATE,
			payload: get(await axios.get('/api/devices'), 'data.data'),
		})

		dispatch(setAsyncState('isFetchingDevices', false))
	}
}

export function fetchSources () {
	return async dispatch => {
		dispatch(setAsyncState('isFetchingSources', true))
		dispatch({
			type:    DEVICE_SOURCES,
			payload: get(await axios.get('/api/v1/administration/sources'), 'data.data'),
		})
		dispatch(setAsyncState('isFetchingSources', false))
	}
}