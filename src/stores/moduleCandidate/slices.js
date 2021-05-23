import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dashboardCandidate: {},
  infoCandidate: {},
  listRecruitmentApply: {},
  listCandidate: {},
  detailCandidate: {},
}

const candidateSlice = createSlice({
  name: 'data master',
  initialState,
  reducers: {
    dispatchFetchDashboardCandidateSuccess: (state, { payload }) => {
      state.dashboardCandidate = payload
    },
    dispatchFetchInfoCandidateSuccess: (state, { payload }) => {
      state.infoCandidate = payload
    },
    dispatchFetchListRecruitmentApplySuccess: (state, { payload }) => {
      state.listRecruitmentApply = payload
    },
    dispatchFetchListCandidateSuccess: (state, { payload }) => {
      state.listCandidate = payload
    },
    dispatchFetchDetailCandidateSuccess: (state, { payload }) => {
      state.detailCandidate = payload
    },

  },
})

export const {
  dispatchFetchDashboardCandidateSuccess,
  dispatchFetchInfoCandidateSuccess,
  dispatchFetchListRecruitmentApplySuccess,
  dispatchFetchListCandidateSuccess,
  dispatchFetchDetailCandidateSuccess,
} = candidateSlice.actions

export default candidateSlice.reducer
