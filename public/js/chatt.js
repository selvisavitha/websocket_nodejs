const socket = io()

/*socket.on('countUpdated', (count) => {
    console.log('The count has been updated', count)
})


document.querySelector("#incButton").addEventListener('click', () => {
    console.log('Clicked')
    socket.emit('increment')
})*/

/*socket.on('message', (message) => {
    console.log(message)
})*/



const $message_form = document.querySelector('#message-form')
const $messageForm_input = $message_form.querySelector('input')
const $messageForm_button = $message_form.querySelector('button')
const $sendLocationButton = document.querySelector('#send_location')
const $messages = document.querySelector('#messages')

// Templates
const message_template = document.querySelector('#message-template').innerHTML
const location_template = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of message container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}
socket.on('messageFromServer', (message) => {
    console.log(message.text)
    const html = Mustache.render(message_template, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message.url)
    const user = getUser(socket.id)
    const html = Mustache.render(location_template, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoScroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$message_form.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageForm_button.setAttribute('disabled', 'disabled')
    // console.log(inputData.value)
    const inputData = e.target.elements.message.value
    socket.emit('sendMessage', inputData,(error) => {
        $messageForm_button.removeAttribute('disabled')
        $messageForm_input.value = ''
        $messageForm_input.focus()
        console.log(error)
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (message) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('The message was delivered', message)
        })
    })
})

socket.emit('join', { username, room} , (error) => {
    console.log('message', error)
    if(error) {
        console.log('testing now')
        alert(error.error)
        location.href = '/'
    }        
     

})