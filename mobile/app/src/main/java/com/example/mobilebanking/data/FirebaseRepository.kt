package com.example.mobilebanking.data

import android.util.Log
import androidx.compose.runtime.mutableStateOf
import com.example.mobilebanking.model.CreditCard
import com.example.mobilebanking.model.UserData
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface FirebaseRepository {
    fun getUserData(userId: String): Flow<UserData>
    fun addUser(userData: UserData)
    fun addCard(card: CreditCard, keyStoreKey: String)
    fun deleteCard(cardId: String)
    fun setDefaultCard(cardId: String, prevCardId: String? = null)
    fun updateBalance(currencyFrom: String, currencyTo: String, amountFrom: Double, amountTo: Double)
    fun registerUser(userProfile: UserData)
    fun confirmLogin(userId: String)

}

class NetworkFirebaseRepository : FirebaseRepository {

    private val database = FirebaseDatabase.getInstance().reference.child("users")

    override fun getUserData(userId: String): Flow<UserData> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onCancelled(p0: DatabaseError) {
                Log.e("FirebaseDbStore", "getUserData:", p0.toException())
            }

            override fun onDataChange(dataSnapshot: DataSnapshot) {
                val nodeState = mutableStateOf(UserData())

                if (dataSnapshot.key != null && dataSnapshot.value != null) {
                    val nodeValue = dataSnapshot.getValue(UserData::class.java)
                    if (nodeValue != null) {
                        nodeState.value = nodeValue
                    }
                }
                trySend(nodeState.value)
            }
        }
        val users = database.child(userId)
        users.addValueEventListener(listener)
        awaitClose { users.removeEventListener(listener) }
    }

    override fun addUser(userData: UserData) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        val userId = FirebaseAuth.getInstance().currentUser?.uid
        databaseRef.child(userId!!).setValue(userData)
    }

    override fun registerUser(userData: UserData) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        val userId = FirebaseAuth.getInstance().currentUser?.uid
        databaseRef.child(userId!!).setValue(userData)
    }

    override fun addCard(card: CreditCard, keystoreKey: String) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        val userId = FirebaseAuth.getInstance().currentUser?.uid
        databaseRef.child(userId!!).child("cards").push().setValue(card.encrypt(keystoreKey))
    }

    override fun deleteCard(cardId: String) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        val userId = FirebaseAuth.getInstance().currentUser?.uid
        databaseRef.child(userId!!).child("cards").child(cardId).removeValue()
    }


    override fun setDefaultCard(cardId: String, prevCardId: String?) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        val userId = FirebaseAuth.getInstance().currentUser?.uid
        val cards = databaseRef.child(userId!!).child("cards")
        prevCardId?.run {
            cards.child(this).child("default").setValue(false)
                .onSuccessTask { cards.child(cardId).child("default").setValue(true) }
        } ?: cards.child(cardId).child("default").setValue(true)
    }

    override fun updateBalance(currencyFrom: String, currencyTo: String, amountFrom: Double, amountTo: Double) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        val userId = FirebaseAuth.getInstance().currentUser?.uid
        val databaseUserData = getUserData(userId!!)
        databaseRef.child(userId).child("balance").child(currencyFrom).setValue(amountFrom)
        databaseRef.child(userId).child("balance").child(currencyTo).setValue(amountTo)
    }

    override fun confirmLogin(userId: String) {
        val database: FirebaseDatabase = FirebaseDatabase.getInstance()
        val databaseRef: DatabaseReference = database.getReference("users")
        databaseRef.child(userId).child("needConfirmation").setValue("false");
        databaseRef.child(userId).child("loginToken").setValue(createSession());
    }

    private fun generateToken(length: Int = 10): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        return (1..length)
            .map { chars.random() }
            .joinToString("")
    }
    private fun createSession(): Map<String, String> {
        val currentDateTime = LocalDateTime.now()
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val formattedDateTime = currentDateTime.format(formatter)

        return mapOf(generateToken() to formattedDateTime)
    }

}
