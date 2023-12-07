
let jokesToShow = 3; //NUmber of Jokes to Display
let totalJokes; //Number of total jokes from the API
let resultArray; //Array to store all the jokes

//Get Text Input
let userInput = document.getElementById('searchInput');

//Listen for keydown event on the input field 
//(Note to myself: In order to be used, userInput should be outside the getJokes function and the userInputValue should be inside)
userInput.addEventListener('keydown', function (event) {
    //Checked if the pressed key is Enter
    if (event.key === 'Enter') {
        //The following line prevents the default behavior associated with the Enter key, which is often to submit a form. 
        event.preventDefault();
        //Call the getJokes function 
        getJokes();
    }
});

// Get Jokes from API
async function getJokes() {
    //Get text input value
    let userInputValue = userInput.value;
    //Construct the Query Parameter
    let encodedInput = encodeURIComponent(userInputValue);

    try {
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        let apiUrl = 'https://api.chucknorris.io/jokes/';
        let fullUrl = apiUrl + 'search?query=' + encodedInput;

        const response = await fetch(fullUrl);

        if (!response.ok) {
            console.error('Error fetching jokes: ', response.status);
            return;
        }

        const data = await response.json();
        //Access the result array
        resultArray = data['result'];

        //Display only the first 'jokesToShow' jokes
        displayJokes(resultArray.slice(0, jokesToShow));

    } catch (error) {
        return ('Whoops, something went wrong.', error);
    }
}

// Function to display the jokes on the left side panel
function displayJokes(jokes) {
    // Display results on the page
    const apiResultContainer = document.getElementById('joke-text');
    //Clear previous results
    apiResultContainer.innerHTML = '';

    jokes.forEach(joke => {

        // Create a container for each joke and button
        const singleJokeContainer = document.createElement('div');
        singleJokeContainer.classList.add('single-joke-container');

        // Create a paragraph for the joke
        const jokeElement = document.createElement('p');
        jokeElement.textContent = joke.value;
        jokeElement.classList.add('joke');

        //Create the Like button
        const likeBtn = document.createElement('button');
        likeBtn.classList.add('like-joke');
        likeBtn.title = 'Add to your favorites!';
        likeBtn.innerHTML = '<i class="fas fa-thumbs-up fa-lg"></i>';

        //Attach a click event to 'Like' button
        likeBtn.addEventListener('click', function () {
            //Call a function to handle the like action and save it to local storage
            handleLike(joke);
            //Call a function to update the jokes on the right panel
            updateLikedJokes();
        });

        //Append everything to the container
        singleJokeContainer.appendChild(jokeElement);
        singleJokeContainer.appendChild(likeBtn);
        apiResultContainer.appendChild(singleJokeContainer);

    });
}

//Function that handles the Like button
function handleLike(joke) {
    //Retrieve the existing liked jokes in the local storage
    let likedJokes = JSON.parse(localStorage.getItem('likedJokes')) || [];

    if (!likedJokes.find(likedJoke => likedJoke.id === joke.id)) {
        //Add the liked joke in the array
        likedJokes.push({ id: joke.id, value: joke.value });

        //Save the updated array to local storage
        localStorage.setItem('likedJokes', JSON.stringify(likedJokes));
    }
}

function updateLikedJokes() {
    //Retrieve the existing liked jokes in the local storage
    let likedJokes = JSON.parse(localStorage.getItem('likedJokes')) || [];

    //Display liked jokes on the right panel
    const likedJokesContainer = document.getElementById('liked-joke-content');
    likedJokesContainer.innerHTML = '';

    likedJokes.forEach(likedJoke => {
        const likedJokeContainer = document.createElement('div');
        likedJokeContainer.classList.add('liked-joke-container');

        const likedJokeElement = document.createElement('p');
        likedJokeElement.textContent = likedJoke.value;


        //Create the Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-joke');
        deleteBtn.title = 'Delete from your favorites.';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash fa-lg"></i>';

        //Attach a click event to the Delete button
        deleteBtn.addEventListener('click', function () {
            //Call a function to handle the removal of the liked joke.
            handleDelete(likedJoke.id);
            //Call a function to update the liked jokes on the right panel
            updateLikedJokes();
        });

        //Append everything to the container
        likedJokesContainer.appendChild(likedJokeElement);
        likedJokesContainer.appendChild(likedJokeContainer);
        likedJokesContainer.appendChild(deleteBtn);
    });
}

function handleDelete(likedJokeId) {
    // Retrieve the existing liked jokes from local storage
    let likedJokes = JSON.parse(localStorage.getItem('likedJokes')) || [];

    //Filter out the specified joke with the specified ID
    likedJokes = likedJokes.filter(likedJoke => likedJoke.id !== likedJokeId);

    //Save the updated array back to local storage
    localStorage.setItem('likedJokes', JSON.stringify(likedJokes));
}



//Search Button to Get Jokes
const getJokeBtn = document.querySelector('.get-jokes');
getJokeBtn.addEventListener('click', getJokes);
//Call the updateLikedJokes function when the page loads to show existing liked jokes
document.addEventListener('DOMContentLoaded', updateLikedJokes);




