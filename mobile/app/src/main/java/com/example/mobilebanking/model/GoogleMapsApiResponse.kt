package com.example.mobilebanking.model

data class GoogleMapsApiResponse(
    val name: String = "",
    val location: List<Map<String, Double>> = listOf()
)
