package com.example.mobilebanking.model

import com.example.mobilebanking.utils.decryptData
import com.example.mobilebanking.utils.encryptData
import com.example.mobilebanking.utils.getSecretKey

data class UserData(
    val userName: String? = "",
    val password: String? = "",
    val email: String? = "",
    val firstName: String? = "",
    val lastName: String? = "",
    val birthDate: String? = "",
    val cnp: String? = "",
    val address: String? = "",
    val iban: String? = "",
    val balance: Map<String, Double> = mapOf("RON" to 0.0),
    val cards: Map<String, CreditCard> = mapOf(),
    val transactions: List<Map<String, Map<String, Double>>> = listOf( mapOf("Default" to mapOf("RON" to 0.0))),
    val friendList: Map<String, Boolean> = mapOf("Default" to false),
    val friendsTransactions: List<Map<String, Map<String, Double>>> = listOf( mapOf("Default" to mapOf("RON" to 0.0))),
    val needConfirmation: String? = "false"
) {
    fun encrypt(keyStoreKey: String): UserData {
        val key = getSecretKey(keyStoreKey)
        return copy(
            firstName = encryptData(firstName!!, key),
            lastName = encryptData(lastName!!, key),
            cnp = encryptData(cnp!!, key),
            birthDate = encryptData(birthDate!!, key),
            address = encryptData(address!!, key),
        )
    }

    fun decrypt(keyStoreKey: String): UserData {
        val key = getSecretKey(keyStoreKey)
        return copy(
            firstName = decryptData(firstName!!, key),
            lastName = decryptData(lastName!!, key),
            cnp = decryptData(cnp!!, key),
            birthDate = decryptData(birthDate!!, key),
            address = encryptData(address!!, key),
        )
    }
}
