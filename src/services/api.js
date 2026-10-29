const BASE_URL = "http://localhost:8000/api"

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail || "An unexpected error occurred.")
  }

  if (res.status === 204) return null
  return res.json()
}

// Apprentices
export const fetchApprentices  = () => request("/apprentices")
export const fetchApprentice   = (id) => request("/apprentices/" + id)

// Milestone actions
export const submitMilestone   = (milestoneId, payload) =>
  request("/milestones/" + milestoneId + "/submit",  { method: "POST", body: JSON.stringify(payload) })

export const approveMilestone  = (milestoneId, payload) =>
  request("/milestones/" + milestoneId + "/approve", { method: "POST", body: JSON.stringify(payload) })

export const returnMilestone   = (milestoneId, payload) =>
  request("/milestones/" + milestoneId + "/return",  { method: "POST", body: JSON.stringify(payload) })

export const markMilestonePaid = (milestoneId) =>
  request("/milestones/" + milestoneId + "/pay",     { method: "POST" })
