module.exports = (admin) => {
    const db = admin.database();
    
    async function getUserByUserName(userName) {
      const usersRef = db.ref('users');
      const snapshot = await usersRef.once('value');
  
      let userData = null;
      snapshot.forEach(childSnapshot => {
        const childData = childSnapshot.val();
        if (childData.userName === userName) {
          userData = { id: childSnapshot.key, userName: childData.userName };
        }
      });
      return userData;
    }

    async function loginUsingFirebase(username, password) {
      const usersRef = db.ref('users');
      const snapshot = await usersRef.once('value');
    
      let userId = null;
      snapshot.forEach(childSnapshot => {
        const childData = childSnapshot.val();
        if (childData.userName === username) {
          userId = childSnapshot.key;
        }
      });
    
      if (userId) {
        await db.ref(`users/${userId}`).update({ needConfirmation: "true" });
    
        return new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
            const userSnapshot = await db.ref(`users/${userId}`).once('value');
            const userData = userSnapshot.val();
            if (userData.needConfirmation === "false") {
              clearInterval(interval);
              resolve({ success: true, message: "Login successful", user: userData });
            }
          }, 1000);
    
          setTimeout(() => {
            clearInterval(interval);
            reject({ success: false, message: "Login failed. Confirmation time expired!" });
          }, 180000);
        });
      } else {
        return { success: false, message: "User not found" };
      }
    }
    return {
      getUserByUserName,
      loginUsingFirebase
    };
  };
  