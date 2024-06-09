package com.example.mobilebanking.ui.screens.signin

import android.content.Intent
import android.content.IntentSender
import androidx.lifecycle.ViewModel
import com.example.mobilebanking.data.GoogleAuthRepository
import com.example.mobilebanking.model.SignInResult
import com.example.mobilebanking.model.UserProfile
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class SignInViewModel(val googleAuthRepository: GoogleAuthRepository) : ViewModel() {
    private val _state = MutableStateFlow(SignInState())
    val state = _state.asStateFlow()

    fun onSignInResult(result: SignInResult) {
        _state.update {
            it.copy(
                isSignInSuccesful = result.data != null,
                signInError = result.errorMessage
            )
        }
    }

    fun resetState() {
        _state.update {
            SignInState()
        }
    }


    suspend fun signIn(): IntentSender? = googleAuthRepository.signIn()

    suspend fun signInWithIntent(intent: Intent): SignInResult =
        googleAuthRepository.signInWithIntent(intent)

    suspend fun signOut() = googleAuthRepository.signOut()
    fun getSignedInUser(): UserProfile? = googleAuthRepository.getSignedInUser()
}