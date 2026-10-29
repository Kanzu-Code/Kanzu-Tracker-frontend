const BASE_URL = 'http://localhost:8000/api'

/**
 * Generic fetch wrapper with error handling.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail || 'An unexpected error occurred.')
  }

  // 204 No Content — nothing to parse
  if (res.status === 204) return null
  return res.json()
}

// ── Apprentices ──────────────────────────────────────────────────────────────

/** Fetch all apprentices with their milestones. */
export const fetchApprentices = () => request('/apprentices')

/** Fetch a single apprentice by ID. */
export const fetchApprentice = (id) => request(`/apprentices/${id}`)

// ── Milestones ────────────────────────────────────────────────────────────────

/**
 * Apprentice submits work for a milestone.
 * @param {number} milestoneId
 * @param {{ notes: string }} payload
 */
export const submitMilestone = (milestoneId, payload) =>
  request(`/milestones/${milestoneId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

/**
 * Mentor approves a milestone (marks Complete, unlocks payment).
 * @param {number} milestoneId
 * @param {{ rating: number, comment: string }} payload
 */
export const approveMilestone = (milestoneId, payload) =>
  request(`/milestones/${milestoneId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

/**
 * Mentor returns a milestone for changes.
 * @param {number} milestoneId
 * @param {{ rating: number, comment: string }} payload
 */
export const returnMilestone = (milestoneId, payload) =>
  request(`/milestones/${milestoneId}/return`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
