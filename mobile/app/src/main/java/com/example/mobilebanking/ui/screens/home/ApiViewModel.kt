package com.example.mobilebanking.ui.screens.home

import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.example.mobilebanking.data.FirebaseRepository
import com.example.mobilebanking.data.RetrofitRepository
import com.example.mobilebanking.model.ExchangeRateResponse
import com.example.mobilebanking.model.UserData
import kotlinx.coroutines.flow.Flow

class ApiViewModel (
    private val retrofitRepository: RetrofitRepository,
    private val firebaseRepository: FirebaseRepository
) : ViewModel() {
    val toastMessage= mutableStateOf("")
    private var userId = mutableStateOf("")
    private lateinit var userState: Flow<UserData>
    val exchangeRateDataState: MutableState<ExchangeRateResponse> = try {
            retrofitRepository.fetchExchangeRates()
        }
        catch (e:Exception) {
            e.printStackTrace()
            throw e
        }
    fun updateUserId(userId: String) {
        this.userId.value = userId
        userState = firebaseRepository.getUserData(userId)
    }
    fun getConversionAmount(amountFrom: Double, currencyFrom: String, currencyTo: String) : Double {
        val ratesFrom = exchangeRateDataState.value.rates[currencyFrom]
        val ratesTo = exchangeRateDataState.value.rates[currencyTo]
        if (ratesTo != null && ratesFrom != null) {
            return (amountFrom*ratesTo/ratesFrom)
        }
        else return -1.0
    }

    fun getConversionAmount(currencyFrom: String, currencyTo: String) : Double {
        val ratesFrom = exchangeRateDataState.value.rates[currencyFrom]
        val ratesTo = exchangeRateDataState.value.rates[currencyTo]
        if (ratesTo != null && ratesFrom != null) {
            return (ratesTo/ratesFrom)
        }
        else return -1.0
    }

    fun submitExchange(dataModel: UserData, amount: Double, currencyFrom: String, currencyTo: String) : Int {
        dataModel.balance[currencyFrom].let {
            if (it != null && it > amount) {
                val resultAmount = getConversionAmount(amount, currencyFrom, currencyTo)
                val remainingBalance = it - amount
                val destinationBalance = dataModel.balance[currencyTo]!! + resultAmount
                firebaseRepository.updateBalance(currencyFrom, currencyTo, remainingBalance, destinationBalance)
                return 1
            }
        }
        return 0
    }
}