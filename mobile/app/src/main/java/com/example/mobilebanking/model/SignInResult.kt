package com.example.mobilebanking.model

data class SignInResult(
    val data: UserProfile?,
    val errorMessage: String?
)