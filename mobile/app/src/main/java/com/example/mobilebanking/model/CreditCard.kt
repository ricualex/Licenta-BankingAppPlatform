package com.example.mobilebanking.model

import androidx.annotation.DrawableRes
import com.example.mobilebanking.R
import com.example.mobilebanking.utils.decryptData
import com.example.mobilebanking.utils.encryptData
import com.example.mobilebanking.utils.getSecretKey

enum class CardIssuer(@DrawableRes val issuerIcon: Int) {
    MasterCard(R.drawable.mc),
    Visa(R.drawable.visa),
    Unknown(R.drawable.default_icon)
}

data class CreditCard(
    val holderName: String = "",
    val panNumber: String = "",
    val expirationDate: String = "",
    val cvv: String = "",
    val issuer: CardIssuer = CardIssuer.Unknown,
    val default: Boolean = false
) {

    fun encrypt(keyStoreKey: String): CreditCard {
        val key = getSecretKey(keyStoreKey)
        return copy(
            holderName = encryptData(holderName, key),
            panNumber = encryptData(panNumber, key),
            cvv = encryptData(cvv, key)
        )
    }

    fun decrypt(keyStoreKey: String): CreditCard {
        val key = getSecretKey(keyStoreKey)
        return copy(
            holderName = decryptData(holderName, key),
            panNumber = decryptData(panNumber, key),
            cvv = decryptData(cvv, key)
        )
    }
}
