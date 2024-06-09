package com.example.mobilebanking.model

data class ExchangeRateResponse(
    val base: String = "",
    val rates: Map<String, Double> = mapOf()
)