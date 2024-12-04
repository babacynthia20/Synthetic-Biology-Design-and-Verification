;; Collaboration Manager Contract

(define-map collaborations
  { collaboration-id: uint }
  {
    project-lead: principal,
    collaborators: (list 10 principal),
    construct-id: uint,
    status: (string-ascii 20)
  }
)

(define-data-var last-collaboration-id uint u0)

(define-constant err-not-found (err u100))
(define-constant err-unauthorized (err u101))
(define-constant err-collaborator-limit (err u102))

(define-public (create-collaboration (construct-id uint))
  (let
    (
      (new-collaboration-id (+ (var-get last-collaboration-id) u1))
    )
    (map-set collaborations
      { collaboration-id: new-collaboration-id }
      {
        project-lead: tx-sender,
        collaborators: (list tx-sender),
        construct-id: construct-id,
        status: "active"
      }
    )
    (var-set last-collaboration-id new-collaboration-id)
    (ok new-collaboration-id)
  )
)

(define-public (join-collaboration (collaboration-id uint))
  (let
    (
      (collaboration (unwrap! (map-get? collaborations { collaboration-id: collaboration-id }) err-not-found))
      (current-collaborators (get collaborators collaboration))
    )
    (asserts! (< (len current-collaborators) u10) err-collaborator-limit)
    (map-set collaborations
      { collaboration-id: collaboration-id }
      (merge collaboration
        { collaborators: (unwrap! (as-max-len? (append current-collaborators tx-sender) u10) err-collaborator-limit) }
      )
    )
    (ok true)
  )
)

(define-public (update-collaboration-status (collaboration-id uint) (new-status (string-ascii 20)))
  (let
    (
      (collaboration (unwrap! (map-get? collaborations { collaboration-id: collaboration-id }) err-not-found))
    )
    (asserts! (is-eq tx-sender (get project-lead collaboration)) err-unauthorized)
    (map-set collaborations
      { collaboration-id: collaboration-id }
      (merge collaboration { status: new-status })
    )
    (ok true)
  )
)

(define-read-only (get-collaboration (collaboration-id uint))
  (map-get? collaborations { collaboration-id: collaboration-id })
)

