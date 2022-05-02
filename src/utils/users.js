let users = []

// Add user, Remove user, get user, get users in a room
const addUser = (id, username, room) => {
   // check if user 
   console.log('user name', username)
   username = username.trim().toLowerCase()
   room = room.trim().toLowerCase()

   if(!username || !room) {
       return {
           error: 'Username and room are required'
       }
   }
   // Check for existing user in the same room
   const existinguser = users.find((user) => user.username === username && user.room === room)

   if(existinguser) {
        return {
            error: 'Username is in use!'
        }
   }

   let userToAdd = {
       id, username, room
   }
   users.push(userToAdd)
   console.log('user added', userToAdd)
   return userToAdd
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) { //users existing 
        return users.splice(index, 1) [0]
    }
}

const getUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  console.log('index', index)
  if (index !== -1) {
      return users[index]
  } else{
      return { error: 'User not available!'}
  }
}

const getUsersInRoom = (room) => {
    const usersInARoom = users.filter((user) => user.room === room.trim().toLowerCase())
    if (usersInARoom.count == 0) {
        return { error: 'No users right now!'}
    }
    return usersInARoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
/*const addedUser = addUser(20, ' Selvi ', ' Test Room ')
const addedUser1 = addUser(22, ' Savitha ', ' Test Room ')
const addedUser2 = addUser(23, ' Loshini ', ' different Room ')
console.log(users)

const getUserInfo = getUser(23)
console.log(getUserInfo)

const usersInRoom = getUsersInRoom('different room') 
console.log(usersInRoom)*/
