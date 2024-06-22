*** Settings ***
Library  Browser


*** Variables ***
${TEST_PASSWORD}  testPassword
${EMPTY_PASSWORD}  ${EMPTY}

*** Test Cases ***
Check Server Status
    Open Browser  http://localhost:3000/
    Get Element States    text=Welcome to Easy Vault  *=  attached


Successful Login
    Open Browser  http://localhost:3000/login
    Fill Text    id=usernameInput    ricu
    Fill Secret  id=passwordInput    $password
    Click  id=loginButton

Login With Empty Username
    Open Browser  http://localhost:3000/login
    Fill Text    id=usernameInput    ${EMPTY}
    Fill Secret  id=passwordInput    $TEST_PASSWORD
    Click  id=loginButton
    ${is_login_required}=  Get Property    id=usernameInput    required
    Should Be Equal As Strings    ${is_login_required}    True

Login With Empty Password
    Open Browser  http://localhost:3000/login
    Fill Text    id=usernameInput    testuser
    Fill Secret  id=passwordInput    $EMPTY_PASSWORD
    Click  id=loginButton
    ${is_login_required}=  Get Property    id=passwordInput    required
    Should Be Equal As Strings    ${is_login_required}    True

Login With Remember Me Checked
    Open Browser  http://localhost:3000/login


Test Internet Banking
    Open Browser  http://localhost:3000/login
    Fill Text    id=usernameInput    ricu
    Fill Secret  id=passwordInput    testPassword

