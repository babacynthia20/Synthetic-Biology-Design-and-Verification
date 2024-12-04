;; Lab Integration Contract

(define-map experiments
  { experiment-id: uint }
  {
    construct-id: uint,
    lab-address: principal,
    status: (string-ascii 20),
    result-hash: (optional (buff 32))
  }
)

(define-data-var last-experiment-id uint u0)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))

(define-public (register-lab (lab-address principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)

(define-public (submit-experiment (construct-id uint) (lab-address principal))
  (let
    (
      (new-experiment-id (+ (var-get last-experiment-id) u1))
    )
    (map-set experiments
      { experiment-id: new-experiment-id }
      {
        construct-id: construct-id,
        lab-address: lab-address,
        status: "submitted",
        result-hash: none
      }
    )
    (var-set last-experiment-id new-experiment-id)
    (ok new-experiment-id)
  )
)

(define-public (update-experiment-status (experiment-id uint) (new-status (string-ascii 20)))
  (let
    (
      (experiment (unwrap! (map-get? experiments { experiment-id: experiment-id }) err-not-found))
    )
    (asserts! (is-eq tx-sender (get lab-address experiment)) err-unauthorized)
    (map-set experiments
      { experiment-id: experiment-id }
      (merge experiment { status: new-status })
    )
    (ok true)
  )
)

(define-public (submit-experiment-result (experiment-id uint) (result-hash (buff 32)))
  (let
    (
      (experiment (unwrap! (map-get? experiments { experiment-id: experiment-id }) err-not-found))
    )
    (asserts! (is-eq tx-sender (get lab-address experiment)) err-unauthorized)
    (map-set experiments
      { experiment-id: experiment-id }
      (merge experiment { status: "completed", result-hash: (some result-hash) })
    )
    (ok true)
  )
)

(define-read-only (get-experiment (experiment-id uint))
  (map-get? experiments { experiment-id: experiment-id })
)

