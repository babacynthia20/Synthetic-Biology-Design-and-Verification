;; Genetic Construct NFT Contract

(define-non-fungible-token genetic-construct uint)

(define-data-var last-token-id uint u0)

(define-map construct-data
  { construct-id: uint }
  {
    designer: principal,
    metadata: (string-utf8 256),
    verified: bool
  }
)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-verified (err u102))

(define-public (mint-construct (metadata (string-utf8 256)))
  (let
    (
      (new-construct-id (+ (var-get last-token-id) u1))
    )
    (try! (nft-mint? genetic-construct new-construct-id tx-sender))
    (map-set construct-data
      { construct-id: new-construct-id }
      {
        designer: tx-sender,
        metadata: metadata,
        verified: false
      }
    )
    (var-set last-token-id new-construct-id)
    (ok new-construct-id)
  )
)

(define-public (transfer-construct (construct-id uint) (recipient principal))
  (begin
    (try! (nft-transfer? genetic-construct construct-id tx-sender recipient))
    (ok true)
  )
)

(define-public (verify-construct (construct-id uint))
  (let
    (
      (construct (unwrap! (map-get? construct-data { construct-id: construct-id }) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (not (get verified construct)) err-already-verified)
    (map-set construct-data
      { construct-id: construct-id }
      (merge construct { verified: true })
    )
    (ok true)
  )
)

(define-read-only (get-construct-data (construct-id uint))
  (map-get? construct-data { construct-id: construct-id })
)

(define-read-only (get-construct-owner (construct-id uint))
  (nft-get-owner? genetic-construct construct-id)
)

