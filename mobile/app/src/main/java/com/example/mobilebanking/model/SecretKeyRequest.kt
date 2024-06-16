package com.example.mobilebanking.model

import javax.crypto.SecretKey

data class SecretKeyRequest(
    val uid: String,
    val key: SecretKey
)