const BASE_URL = "http://localhost:8000/api"

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export function getAccessToken() {
  return localStorage.getItem("access_token")
}

export function setTokens({ access_token, refresh_token }) {
  localStorage.setItem("access_token", access_token)
  localStorage.setItem("refresh_token", refresh_token)
}

export function clearTokens() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// Attaches Bearer token when present.
// Throws a descriptive Error on non-2xx responses.
// ---------------------------------------------------------------------------

async function request(path, options = {}) {
  const token = getAccessToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
    ...options.headers,
  }

  const res = await fetch(BASE_URL + path, { ...options, headers })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(payload.detail || "An unexpected error occurred.")
  }

  if (res.status === 204) return null
  return res.json()
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

/** Register a new employer. */
export const registerEmployer = (body) =>
  request("/employer/register", { method: "POST", body: JSON.stringify(body) })

/** Register a new admin. */
export const registerAdmin = (body) =>
  request("/admin/register", { method: "POST", body: JSON.stringify(body) })

/** Register a new apprentice. */
export const registerApprentice = (body) =>
  request("/apprentice/register", { method: "POST", body: JSON.stringify(body) })

/**
 * Employer login.
 * Returns { access_token, refresh_token, user, token_type }.
 */
export const loginEmployer = (body) =>
  request("/employer/login", { method: "POST", body: JSON.stringify(body) })

/** Admin login. */
export const loginAdmin = (body) =>
  request("/admin/login", { method: "POST", body: JSON.stringify(body) })

/** Apprentice login. */
export const loginApprentice = (body) =>
  request("/apprentice/login", { method: "POST", body: JSON.stringify(body) })

// ---------------------------------------------------------------------------
// Apprenticeships
// ---------------------------------------------------------------------------

/**
 * Create a new apprenticeship (employer / admin).
 * Auto-creates 4 milestones + payments on the backend.
 */
export const createApprenticeship = (body) =>
  request("/apprenticeships", { method: "POST", body: JSON.stringify(body) })

/**
 * List apprenticeships (paginated).
 * @param {{ status?: string, page?: number, per_page?: number }} params
 */
export const fetchApprenticeships = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
  ).toString()
  return request("/apprenticeships" + (qs ? "?" + qs : ""))
}

/** Get a single apprenticeship by ID. */
export const fetchApprenticeship = (id) =>
  request("/apprenticeships/" + id)

/** Update an apprenticeship (status, end_date). */
export const updateApprenticeship = (id, body) =>
  request("/apprenticeships/" + id, { method: "PATCH", body: JSON.stringify(body) })

/** Delete an apprenticeship (admin only). */
export const deleteApprenticeship = (id) =>
  request("/apprenticeships/" + id, { method: "DELETE" })

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

/**
 * Create a custom milestone (admin only).
 * Standard milestones are auto-created with the apprenticeship.
 */
export const createMilestone = (body) =>
  request("/milestones", { method: "POST", body: JSON.stringify(body) })

/**
 * List milestones.
 * @param {{ apprenticeship_id?: string, status?: string }} params
 * NOTE: /api/milestones/overdue is called via fetchOverdueMilestones()
 * and must be routed before any /milestones/<id> call.
 */
export const fetchMilestones = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
  ).toString()
  return request("/milestones" + (qs ? "?" + qs : ""))
}

/** List all overdue milestones (employer / admin). */
export const fetchOverdueMilestones = () =>
  request("/milestones/overdue")

/** Get a single milestone by ID (includes overdue flag). */
export const fetchMilestone = (id) =>
  request("/milestones/" + id)

/** Update a milestone — title, description, due_date, status. */
export const updateMilestone = (id, body) =>
  request("/milestones/" + id, { method: "PATCH", body: JSON.stringify(body) })

/** Delete a milestone (admin only). */
export const deleteMilestone = (id) =>
  request("/milestones/" + id, { method: "DELETE" })

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

/** Apprentice submits work for a milestone. */
export const createSubmission = (milestoneId, body) =>
  request("/milestones/" + milestoneId + "/submissions", {
    method: "POST",
    body: JSON.stringify(body),
  })

/** List all submissions for a milestone. */
export const fetchSubmissions = (milestoneId) =>
  request("/milestones/" + milestoneId + "/submissions")

/** Get a single submission by ID. */
export const fetchSubmission = (submissionId) =>
  request("/submissions/" + submissionId)

/** Apprentice edits a pending submission. */
export const updateSubmission = (submissionId, body) =>
  request("/submissions/" + submissionId, {
    method: "PATCH",
    body: JSON.stringify(body),
  })

/** Apprentice resubmits after changes were requested. */
export const resubmitSubmission = (submissionId, body) =>
  request("/submissions/" + submissionId + "/resubmit", {
    method: "POST",
    body: JSON.stringify(body),
  })

/** Delete a submission (admin only). */
export const deleteSubmission = (submissionId) =>
  request("/submissions/" + submissionId, { method: "DELETE" })

// ---------------------------------------------------------------------------
// Mentor Feedback / Reviews
// ---------------------------------------------------------------------------

/**
 * Employer / admin reviews a submission.
 * Body should include: { rating, comment, action: "approve" | "request_changes" }
 */
export const createReview = (submissionId, body) =>
  request("/submissions/" + submissionId + "/reviews", {
    method: "POST",
    body: JSON.stringify(body),
  })

/** List all reviews for a submission. */
export const fetchReviews = (submissionId) =>
  request("/submissions/" + submissionId + "/reviews")

/** Get a single feedback record. */
export const fetchFeedback = (feedbackId) =>
  request("/feedback/" + feedbackId)

/** Update a feedback record — rating, comment (admin only). */
export const updateFeedback = (feedbackId, body) =>
  request("/feedback/" + feedbackId, {
    method: "PATCH",
    body: JSON.stringify(body),
  })

/** Delete a feedback record (admin only). */
export const deleteFeedback = (feedbackId) =>
  request("/feedback/" + feedbackId, { method: "DELETE" })

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

/**
 * List payments.
 * @param {{ status?: "not_yet_due" | "due" | "paid" }} params
 */
export const fetchPayments = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
  ).toString()
  return request("/payments" + (qs ? "?" + qs : ""))
}

/** Get a single payment by ID. */
export const fetchPayment = (paymentId) =>
  request("/payments/" + paymentId)

/** Mark a payment as paid (employer / admin). */
export const markPaymentPaid = (paymentId) =>
  request("/payments/" + paymentId + "/mark-paid", { method: "POST" })

/** Update payment amount (admin only). */
export const updatePayment = (paymentId, body) =>
  request("/payments/" + paymentId, {
    method: "PATCH",
    body: JSON.stringify(body),
  })

// ---------------------------------------------------------------------------
// Dashboard & Progress
// ---------------------------------------------------------------------------

/** Summary stats per apprenticeship — milestones and payments. */
export const fetchDashboard = () =>
  request("/dashboard")

/**
 * Detailed progress for a single apprenticeship.
 * @param {string} apprenticeshipId
 */
export const fetchProgress = (apprenticeshipId) =>
  request("/apprenticeships/" + apprenticeshipId + "/progress")

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** API health check — no auth required. */
export const healthCheck = () =>
  fetch("http://localhost:8000/health").then((r) => r.json())
