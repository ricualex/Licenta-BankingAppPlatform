package com.example.mobilebanking.ui.screens.home

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.example.mobilebanking.data.FirebaseRepository
import com.example.mobilebanking.model.CreditCard
import com.example.mobilebanking.model.UserData
import kotlinx.coroutines.flow.Flow


class UserViewModel(private val firebaseRepo: FirebaseRepository) : ViewModel() {
    private var userId = mutableStateOf("")
    lateinit var userState: Flow<UserData>
    lateinit var registrationData: UserData

    fun resetState() {
        registrationData = UserData()
    }

    fun generateIBan(length: Int = 18): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        return (1..length)
            .map { chars.random() }
            .joinToString("")
    }

    fun submitRegister(userName:String, password: String, email: String, firstName: String, lastName: String, cnp: String, birthDate: String, address: String, keyStoreKey: String) {
        registrationData = UserData(
            userName = userName,
            password = password,
            email = email,
            firstName = firstName,
            lastName = lastName,
            iban = "ROEB" + generateIBan(),
            cnp = cnp,
            birthDate = birthDate,
            address = address,
            balance = mapOf("RON" to 0.0),
            needConfirmation = "false"
        )
        firebaseRepo.registerUser(registrationData.encrypt(keyStoreKey))
    }

    fun confirmLogin() {
        firebaseRepo.confirmLogin(userId.value)
    }

    fun updateUserId(userId: String) {
        this.userId.value = userId
        userState = firebaseRepo.getUserData(userId)
    }

    fun addCard(creditCard: CreditCard, keyStoreKey: String) =
        firebaseRepo.addCard(creditCard, keyStoreKey)

    fun deleteCard(cardId: String) = firebaseRepo.deleteCard(cardId)

    fun setDefaultCard(cardId: String, prevCardId: String?) =
        firebaseRepo.setDefaultCard(cardId, prevCardId)
}
