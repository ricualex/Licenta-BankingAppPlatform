package com.example.mobilebanking.ui.screens

import android.app.Activity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.mobilebanking.ViewModelProvider
import com.example.mobilebanking.components.AppBar
import com.example.mobilebanking.model.UserData
import com.example.mobilebanking.model.UserProfile
import com.example.mobilebanking.ui.screens.cards.CardsScreen
import com.example.mobilebanking.ui.screens.drawer.DrawerScreen
import com.example.mobilebanking.ui.screens.exchange.CurrencyExchangeScreen
import com.example.mobilebanking.ui.screens.help.HelpScreen
import com.example.mobilebanking.ui.screens.help.HelpViewModel
import com.example.mobilebanking.ui.screens.home.ApiViewModel
import com.example.mobilebanking.ui.screens.home.HomeScreen
import com.example.mobilebanking.ui.screens.home.UserViewModel
import com.example.mobilebanking.ui.screens.transfer.TransferScreen
import com.example.mobilebanking.ui.screens.transfer.TransferViewModel
import kotlinx.coroutines.launch


enum class BankingAppScreen(val title: String) {
    Home("Home"),
    Cards("Credit Cards"),
    Exchange("Currency exchange"),
    Atms("Atms"),
    Transfer("Transfer")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BankingApp(
    activity: Activity,
    userProfile: UserProfile,
    userId: String,
    onLogOutClicked: () -> Unit
) {
    val userViewModel: UserViewModel = viewModel(factory = ViewModelProvider.Factory)
    val apiViewModel: ApiViewModel = viewModel(factory = ViewModelProvider.Factory)
    val helpViewModel: HelpViewModel = viewModel(factory = ViewModelProvider.Factory)
    val transferViewModel: TransferViewModel = viewModel(factory = ViewModelProvider.Factory)

    userViewModel.updateUserId(userId)
    apiViewModel.updateUserId(userId)
    transferViewModel.updateUserId(userId)

    val userData = userViewModel.userState.collectAsState(
        UserData()
    )

    val scrollBehavior = TopAppBarDefaults.enterAlwaysScrollBehavior()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val navController = rememberNavController()
    val coroutineScope = rememberCoroutineScope()

    val backStackEntry by navController.currentBackStackEntryAsState()
    val crtScreen = BankingAppScreen.valueOf(
        backStackEntry?.destination?.route ?: BankingAppScreen.Home.name
    )
    val exchangeData = apiViewModel.exchangeRateDataState.value

    Scaffold(
        modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
        topBar = {
            AppBar(crtScreen = crtScreen) {
                coroutineScope.launch {
                    if (drawerState.isOpen) {
                        drawerState.close()
                    } else {
                        drawerState.open();
                    }
                }
            }
        }
    ) {
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(it)
        ) {
            DrawerScreen(
                drawerState = drawerState,
                userProfile = userProfile,
                onCardsClicked = {
                    navController.navigate(BankingAppScreen.Cards.name)
                    // TODO: this can be done better
                    coroutineScope.launch {
                        drawerState.close()
                    }
                },
                onHomeClicked = {
                    navController.navigate(BankingAppScreen.Home.name)
                    coroutineScope.launch {
                        drawerState.close()
                    }
                },
                onExchangeClicked = {
                    navController.navigate(BankingAppScreen.Exchange.name)
                    coroutineScope.launch {
                        drawerState.close()
                    }
                },
                onHelpClicked = {
                    navController.navigate(BankingAppScreen.Atms.name)
                    coroutineScope.launch {
                        drawerState.close()
                    }
                },
                onTransferClicked = {
                    navController.navigate(BankingAppScreen.Transfer.name)
                    coroutineScope.launch {
                        drawerState.close()
                    }
                },
                onLogOutClicked = onLogOutClicked
            ) {
                NavHost(
                    navController = navController,
                    startDestination = BankingAppScreen.Home.name
                ) {
                    composable(route = BankingAppScreen.Home.name) {
                        HomeScreen(userProfile = userProfile, dataModel = userData.value, exchangeData = exchangeData, userViewModel = userViewModel)
                    }
                    composable(route = BankingAppScreen.Cards.name) {
                        CardsScreen(
                            activity = activity,
                            cards = userData.value.cards.toList(),
                            onCardAdded = userViewModel::addCard,
                            onCardDeleted = userViewModel::deleteCard,
                            onCardSetDefault = userViewModel::setDefaultCard
                        )
                    }
                    composable(route = BankingAppScreen.Exchange.name) {
                        CurrencyExchangeScreen(exchangeDataViewModel = apiViewModel, dataModel = userData.value)
                    }
                    composable(route = BankingAppScreen.Atms.name) {
                        HelpScreen(helpViewModel = helpViewModel)
                    }
                    composable(route = BankingAppScreen.Transfer.name) {
                        TransferScreen(transferViewModel = transferViewModel)
                    }
                }
            }
        }
    }
}