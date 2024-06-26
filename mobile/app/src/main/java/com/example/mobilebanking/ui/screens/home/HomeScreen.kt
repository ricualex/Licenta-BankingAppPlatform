package com.example.mobilebanking.ui.screens.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.core.text.isDigitsOnly
import com.example.mobilebanking.components.AppFonts
import com.example.mobilebanking.components.RoundGreyButton
import com.example.mobilebanking.model.ExchangeRateResponse
import com.example.mobilebanking.model.UserData
import com.example.mobilebanking.model.UserProfile
import com.example.mobilebanking.R

@Composable
fun HomeScreen(
    userProfile: UserProfile,
    dataModel: UserData,
    exchangeData: ExchangeRateResponse,
    userViewModel: UserViewModel
) {
    var needToCompleteRegisterDialog by remember { mutableStateOf(true) }
    var userName by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var cnp by remember { mutableStateOf("") }
    var birthDate by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        dataModel.takeIf {
            it.firstName.isNullOrEmpty() ||
                    it.cnp.isNullOrEmpty() ||
                    it.lastName.isNullOrEmpty() ||
                    it.birthDate.isNullOrEmpty()

        }?.let {
            if (needToCompleteRegisterDialog) {
                Dialog(onDismissRequest = {
                    needToCompleteRegisterDialog = false
                }) {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        item { Text(text = "Before using our app, we need to finalize your registration.") }
                        item { Text(text = "Please provide us the following informations. All data will be kept in privacy") }
                        item {
                            RegisterTextField(labelText = "Username", text = userName) {
                                userName = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            RegisterTextField(labelText = "Password", text = password) {
                                password = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            RegisterTextField(labelText = "FirstName", text = firstName) {
                                firstName = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            RegisterTextField(labelText = "LastName", text = lastName) {
                                lastName = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            RegisterTextField(labelText = "CNP", text = cnp) {
                                cnp = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            RegisterTextField(labelText = "BirthDate", text = birthDate) {
                                birthDate = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            RegisterTextField(labelText = "Address", text = address) {
                                address = it
                            }
                        }
                        item { Spacer(modifier = Modifier.height(30.dp)) }
                        item {
                            val key = stringResource(id = R.string.key_alias)
                            RoundGreyButton(value = "Confirm", onButtonClick = {
                                needToCompleteRegisterDialog = false
                                userViewModel.submitRegister(
                                    userName = userName,
                                    password = password,
                                    email = userProfile.username!!,
                                    firstName = firstName,
                                    lastName = lastName,
                                    cnp = cnp,
                                    birthDate = birthDate,
                                    address = address,
                                    keyStoreKey = key
                                )
                            })
                        }
                    }

                }
            }
        }
        dataModel.takeIf {
            it.needConfirmation == "true"
        }?.let {
            Dialog(onDismissRequest = {
            }) {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    item { Text(text = "Confirm login") }
                    item { RoundGreyButton(value = "Confirm", onButtonClick = {
                        userViewModel.confirmLogin()
                    }) }
                }
            }
        }

        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            WelcomeBox(userProfile, dataModel)
            Spacer(modifier = Modifier.padding(top = 20.dp))
            Box(
                modifier = Modifier
            ) {
                RoundGreyButton(value = "Make a payment", onButtonClick = {
                    println(exchangeData)
                })
            }
            Spacer(modifier = Modifier.height(20.dp))
            ApiBox(apiExchangeRateData = exchangeData)
        }
    }
}

@Composable
fun WelcomeBox(userProfile: UserProfile, firebaseDataState: UserData) {
    Column {
        Spacer(modifier = Modifier.height(30.dp))
        Card(
            modifier = Modifier
                .width(250.dp)
                .height(100.dp),
            content = {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Welcome, ${userProfile.username?.split(" ")?.first()}",
                        style = AppFonts.TitleFontStyle
                    )
                    firebaseDataState.balance.entries.firstOrNull()?.let {
                        Text(
                            text = "Current balance:",
                            style = AppFonts.TitleFontStyle
                        )
                        Text(
                            text = "${String.format("%.2f", it.value)} ${it.key}",
                            style = AppFonts.TitleFontStyle
                        )
                    }
                }
            }
        )
    }
}

@Composable
fun ApiBox(apiExchangeRateData: ExchangeRateResponse) {
    var currencyFrom by remember { mutableStateOf("0") }
    var currencyTo by remember { mutableStateOf("0") }
    val usdPainter = painterResource(id = R.drawable.usd)
    val euroPainter = painterResource(id = R.drawable.euro)

    CurrencyRow(
        currency = "EUR",
        data = apiExchangeRateData,
        imagePainter = euroPainter,
        color = Color.Green,
        text = currencyFrom,
        onValueChange = {
            try {
                val convertedValue = it.toDouble() * apiExchangeRateData.rates["USD"]!!
                currencyFrom = it
                currencyTo = convertedValue.toString()
            } catch (e: Exception) {
                e.printStackTrace()
                currencyTo = "0"
                currencyFrom = "0"
            }
        }
    )

    CurrencyRow(
        currency = "USD",
        data = apiExchangeRateData,
        imagePainter = usdPainter,
        color = Color.Red,
        text = currencyTo,
        onValueChange = {
            try {
                val convertedValue = it.toDouble() / apiExchangeRateData.rates["USD"]!!
                currencyTo = it
                currencyFrom = convertedValue.toString()
            } catch (e: Exception) {
                e.printStackTrace()
                currencyTo = "0"
                currencyFrom = "0"
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ApiTextField(
    currency: String,
    color: Color,
    text: String,
    onValueChange: (String) -> Unit
) {
    TextField(
        value = text,
        onValueChange = {
            if (it.isDigitsOnly()) {
                onValueChange(it)
            }
        },
        label = { Text(text = currency, style = TextStyle(fontSize = 30.sp)) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
        textStyle = TextStyle(fontSize = 30.sp, color = color),
        singleLine = true
    )
}

@Composable
fun CurrencyRow(
    currency: String,
    data: ExchangeRateResponse,
    imagePainter: Painter,
    color: Color,
    text: String,
    onValueChange: (String) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = imagePainter,
            contentDescription = null,
            modifier = Modifier
                .clip(MaterialTheme.shapes.medium)
                .padding(16.dp)
                .width(70.dp)
                .height(70.dp)
        )

        ApiTextField(currency, color, text) {
            onValueChange(it)
        }
    }
}

@Composable
fun RegisterTextField(
    labelText: String,
    text: String,
    onValueChange: (String) -> Unit
) {
    TextField(
        value = text,
        onValueChange = {
            onValueChange(it)
        },
        label = { Text(text = labelText, style = TextStyle(fontSize = 20.sp)) },
//        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
        textStyle = TextStyle(fontSize = 20.sp, color = Color.White),
        singleLine = true
    )
}
