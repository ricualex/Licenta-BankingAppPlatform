package com.example.mobilebanking.ui.screens.transfer

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.example.mobilebanking.data.FirebaseRepository
import com.example.mobilebanking.data.RetrofitRepository
import com.example.mobilebanking.model.TransferRequest
import com.example.mobilebanking.model.TransferServerResponse
import com.example.mobilebanking.model.UserData
import kotlinx.coroutines.flow.Flow

class TransferViewModel(
    private val retrofitRepository: RetrofitRepository,
    private val firebaseRepository: FirebaseRepository
) : ViewModel() {

    private var userId = mutableStateOf("")
    private lateinit var userState: Flow<UserData>
    private val serverResponse = mutableStateOf(TransferServerResponse())

    fun updateUserId(userId: String) {
        this.userId.value = userId
        userState = firebaseRepository.getUserData(userId)
    }

    fun doTransfer(userTo: String, amount: Int): Int {
        val transferRequest = TransferRequest(userFrom = userId.value, userTo = userTo, amount = amount)
        retrofitRepository.transferMoney(transferRequest) {
                serverResponse.value = it
        }
        serverResponse.value.message?.isNotEmpty().let {
            if (serverResponse.value.code == 200) {
                return 1
            }
            else return 0
        }
    }
}