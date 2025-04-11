const postBox = document.getElementById('post-box')
const alertBox = document.getElementById('alert-box')

const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

const url = window.location.href + "data/"
const updateurl = window.location.href + "update/"
const deleteurl = window.location.href + "delete/"

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')


const spinnerBox = document.getElementById('spinner-box')

const titleInput = document.getElementById("id_title")
const bodyInput = document.getElementById("id_body")

const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkIcon = document.getElementById('dark-icon');

// Load from localStorage on page load
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkIcon.classList.replace('bi-moon', 'bi-brightness-high');
}

darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);

    // Toggle icon
    if (isDark) {
        darkIcon.classList.replace('bi-moon', 'bi-brightness-high');
    } else {
        darkIcon.classList.replace('bi-brightness-high', 'bi-moon');
    }
});


const csrf = document.getElementsByName('csrfmiddlewaretoken')


//backBtn.addEventListener('click', ()=>{
  //  history.back()
//})

$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        const data = response.data

        if (data.logged_in == data.author){
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }
        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class', 'mt-1')
        titleEl.setAttribute('id', 'title')

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class', 'mt-1')
        bodyEl.setAttribute('id', 'body')

        const authorEl = document.createElement('b')
        authorEl.setAttribute('class', 'mt-1')
        authorEl.setAttribute('id', 'author')

        titleEl.textContent = data.title
        bodyEl.textContent = data.body
        authorEl.textContent = data.author

        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)
        postBox.appendChild(authorEl)
        

        titleInput.value = data.title
        bodyInput.value = data.body
        //authorInput.value = data.author

        spinnerBox.classList.add('not-visible')
    },
    error: function(response){
        console.log(response)
    }
})

updateForm.addEventListener('submit', e=>{
    e.preventDefault()
    const title = document.getElementById('title')
    const body = document.getElementById('body')


    $.ajax({
        type: 'POST',
        url: updateurl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value,
        },
        success: function(response){
            console.log(response)
            handleAlerts('success', 'Posts has been updated')
            title.textContent = response.title
            body.textContent = response.body
        },
        error: function(response){
            console.log(response)
        }
    })
})


deleteForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteurl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function(response){
            window.location.href = window.location.origin
            localStorage.setItem('title', titleInput.value)
        },
        error: function(response){
            console.log(response)
        }
    })
})