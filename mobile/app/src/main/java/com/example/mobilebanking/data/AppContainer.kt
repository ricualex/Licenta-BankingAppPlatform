package com.example.mobilebanking.data

import android.content.Context
import com.google.android.gms.auth.api.identity.Identity

interface AppContainer {
    val googleAuthRepository: GoogleAuthRepository
    val firebaseRepository: FirebaseRepository
    val retrofitRepository : RetrofitRepository
}

class DefaultAppContainer(ctx: Context) : AppContainer {
    private val serverClientId =
        "230587628808-0i4h9robikngjebl1s3rgdmvfjgn5il2.apps.googleusercontent.com"
    override val googleAuthRepository by lazy {
        NetworkGoogleAuthRepository(serverClientId, Identity.getSignInClient(ctx))
    }

    override val firebaseRepository: FirebaseRepository by lazy {
        NetworkFirebaseRepository()
    }

    override val retrofitRepository: RetrofitRepository by lazy {
        NetworkRetrofitRepository()
    }
}