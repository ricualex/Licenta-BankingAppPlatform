package com.example.mobilebanking

import android.app.Application
import com.example.mobilebanking.data.AppContainer
import com.example.mobilebanking.data.DefaultAppContainer

class BankingApplication : Application() {
    lateinit var container: AppContainer
    override fun onCreate() {
        super.onCreate()
        container = DefaultAppContainer(applicationContext)
    }
}