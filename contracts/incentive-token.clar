;; Incentive Token Contract

(define-fungible-token synbio-token)

(define-data-var token-uri (string-utf8 256) u"")

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-insufficient-balance (err u101))

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? synbio-token amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-insufficient-balance)
    (ft-transfer? synbio-token amount sender recipient)
  )
)

(define-read-only (get-balance (account principal))
  (ft-get-balance synbio-token account)
)

(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri new-uri)
    (ok true)
  )
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)
