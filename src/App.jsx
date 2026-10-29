import React, { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import SummaryCards from './components/SummaryCards'
import ApprenticeList from './components/ApprenticeList'
import ProgressDetail from './components/ProgressDetail'
import SubmitModal from './components/SubmitModal'
import ReviewModal from './components/ReviewModal'
import {
  fetchApprentices,
  submitMilestone,
  approveMilestone,
  returnMilestone,
} from './services/api'

export default function App() {
  const [apprentices, setApprentices] = useState([])
  const [selectedApprentice, setSelectedApprentice] = useState(null)
  const [currentRole, setCurrentRole] = useState('apprentice')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitTarget, setSubmitTarget] = useState(null)
  const [reviewTarget, setReviewTarget] = useState(null)

  const loadApprentices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApprentices()
      setApprentices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApprentices()
  }, [loadApprentices])

  useEffect(() => {
    if (!selectedApprentice) return
    const fresh = apprentices.find((a) => a.id === selectedApprentice.id)
    if (fresh) setSelectedApprentice(fresh)
  }, [apprentices]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoleToggle = () => {
    setCurrentRole((r) => (r === 'apprentice' ? 'mentor' : 'apprentice'))
    setSubmitTarget(null)
    setReviewTarget(null)
  }

  const handleSelectApprentice = (apprentice) => setSelectedApprentice(apprentice)
  const handleBack = () => setSelectedApprentice(null)

  const handleOpenSubmit = (milestone) => setSubmitTarget(milestone)
  const handleCloseSubmit = () => setSubmitTarget(null)

  const handleConfirmSubmit = async (notes) => {
    await submitMilestone(submitTarget.id, { notes })
    handleCloseSubmit()
    await loadApprentices()
  }

  const handleOpenReview = (milestone) => setReviewTarget(milestone)
  const handleCloseReview = () => setReviewTarget(null)

  const handleApprove = async (payload) => {
    await approveMilestone(reviewTarget.id, payload)
    handleCloseReview()
    await loadApprentices()
  }

  const handleReturn = async (payload) => {
    await returnMilestone(reviewTarget.id, payload)
    handleCloseReview()
    await loadApprentices()
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar currentRole={currentRole} onRoleToggle={handleRoleToggle} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
            <svg className="animate-spin h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm">Loading apprentices...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center space-y-3">
            <p className="font-semibold">Failed to load data</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={loadApprentices}
              className="mt-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <SummaryCards apprentices={apprentices} />

            {selectedApprentice ? (
              <ProgressDetail
                apprentice={selectedApprentice}
                currentRole={currentRole}
                onBack={handleBack}
                onSubmit={handleOpenSubmit}
                onReview={handleOpenReview}
              />
            ) : (
              <ApprenticeList
                apprentices={apprentices}
                onSelectApprentice={handleSelectApprentice}
              />
            )}
          </>
        )}
      </main>

      {submitTarget && (
        <SubmitModal
          milestone={submitTarget}
          onConfirm={handleConfirmSubmit}
          onClose={handleCloseSubmit}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          milestone={reviewTarget}
          onApprove={handleApprove}
          onReturn={handleReturn}
          onClose={handleCloseReview}
        />
      )}
    </div>
  )
}
