console.log('Hello World')

const HelloWorldBox = document.getElementById('hello-world')

$.ajax({
    type: 'GET',
    url: '/hello-world/',
    success: function(response){
        console.log('success', response.text)
        HelloWorldBox.textContent = response.text
    },

    error: function(error){
        console.log('error', error)
    }
})