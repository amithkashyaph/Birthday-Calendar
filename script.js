// Maps the integer to a corresponding day
var days = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Hashmap to keep track of total number of birthdays on a given day
var birthdayCountPerDay = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

/*
    Listen for an onclick event and call the parse function
    If there are multiple click then refresh the day-card before rendering
 */
const button = document.querySelector("button");
button.addEventListener("click", () => {
  let grid = document.querySelectorAll(".day__person");
  grid.forEach((element) => (element.innerHTML = ""));

  let error = document.querySelectorAll(".error-message");
  error.forEach((element) => (element.innerHTML = ""));
  parseJsonDataFromTextArea();
});

/*
    Read the JSON data in the text area and parse it to generate a JSON object
    Read the year value from the input field
 */
const parseJsonDataFromTextArea = () => {
  const textArea = document.querySelector("textarea");

  const data = JSON.parse(textArea.value);
  const year = document.querySelector("input").value;

  sortPersonByDate(data, year);
};

/*
    Handles the creation and insertion of birthday-card into the day-card
    Read the year value from the input field
 */
const addBirthdayCard = (userInitials, dayBorn, gridSize) => {
  const container = document.querySelector(`#${dayBorn}`);

  //Restrict the grid size if it is greater than 9
  if (gridSize > 9) {
    gridSize = 9;
  }
  const birthdayCard = createBirthdayCard(userInitials);

  container.appendChild(birthdayCard);

  container.style.setProperty("--grid-cols", gridSize);
};

/*
    Creates a birthday-card with the user's initials and a random background color
 */
const createBirthdayCard = (userInitials) => {
  const birthdayCard = document.createElement("div");

  const h4 = document.createElement("h4");
  birthdayCard.appendChild(h4);
  h4.classList.add("initials");

  h4.innerText = userInitials;
  h4.style.margin = "auto";

  birthdayCard.classList.add("birthday");
  birthdayCard.style.backgroundColor = getRandomColor();
  return birthdayCard;
};

/*
    Calculates the required grid-column number to accomodate 
    the birthday squares inside the day-card
 */
function calculateGridSize(noOfBirthdaysInAGivenDay) {
  return Math.ceil(Math.sqrt(noOfBirthdaysInAGivenDay));
}

/*
    Generates a random color in hex format to fill the birthday-card
 */

function getRandomColor() {
  let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  if (randomColor.length === 6) {
    randomColor += "0";
  }

  return randomColor;
}

/*
    Generates an empty card with sad face to fill the day-cards 
    without any birthday-cards inside it
 */

function createEmptyCard() {
  const emptyCard = document.createElement("div");
  emptyCard.classList.add("empty-card");

  const h1 = document.createElement("h1");
  h1.innerText = ". .";
  h1.style.fontSize = "50px";

  const h2 = document.createElement("h1");
  h2.innerText = "~";
  h2.style.fontSize = "80px";
  emptyCard.appendChild(h1);
  emptyCard.appendChild(h2);

  return emptyCard;
}

/*
    Called at the end of rendering all the birthday-cards to see
    if there are any day-cards without any birthday. If found then
    an empty-card with a sad face is generated  
    
 */
function clearUpDays() {
  for (let day in birthdayCountPerDay) {
    if (!birthdayCountPerDay[day].length) {
      const container = document.querySelector(`#${day}`);
      const emptyCard = createEmptyCard();
      container.appendChild(emptyCard);
      container.style.setProperty("--grid-cols", 1);
    }
  }
}

/*
    Creates an error-message using a message parameter
 */
function createErrorMessage(message) {
  const errorBody = document.querySelector(".error");
  const errorElement = document.createElement("div");
  errorElement.innerHTML = `<strong>* ${message}</strong>`;
  errorElement.classList.add("error-message");
  errorBody.appendChild(errorElement);
}

/*
   Resets the birthdayCountPerDay hashmap
 */

function resetbirthdayCountPerDay() {
  Object.keys(birthdayCountPerDay).forEach((key) => {
    birthdayCountPerDay[key].length = 0;
  });
}

/*
    Sorts the textarea data of users based on their age and
    maps each user to a specific day-card using Hashmap.
    Also validates to check for valid input
    On every submit it resets the birthdayCountPerDay hashmap by clearing it 
 */
function sortPersonByDate(data, year) {
  var errorCount = 0;
  resetbirthdayCountPerDay();

  let sortedPersons = data.sort((person1, person2) => {
    return new Date(person2.birthday) - new Date(person1.birthday);
  });

  //   Create a HashMap of day : [Array of Persons born on that day which will be sorted]
  sortedPersons.forEach((person) => {
    let dateString = person.birthday.split("/");

    console.log(dateString.length);

    // Valid for the date
    if (
      !dateString[0] ||
      !dateString[1] ||
      !dateString[2] ||
      dateString.length !== 3 ||
      dateString[0] > 12 ||
      dateString[0] <= 0 ||
      dateString[1] > 31 ||
      dateString[0] <= 0 ||
      dateString[2] < 1900 ||
      dateString[2] > 2099
    ) {
      createErrorMessage(`Error: "${person.name}'s" birth date is not valid`);
      errorCount++;
    } else {
      let date = new Date(`${dateString[0]} ${dateString[1]}, ${year}`);
      let day = days[date.getDay()];
      dateString[2] = year;

      birthdayCountPerDay[day].push(person);
    }
  });

  if (errorCount > 0) {
    // console.log("Faulty Birthday Input Count", errorCount);
  }

  printBirthdayCard();
}

/*
   Prints birthday-card based on the Hashmap of days and users' birthdays 
   Also restricts the number of birthdays per day-card to be 81
 */

function printBirthdayCard() {
  Object.keys(birthdayCountPerDay).forEach((key) => {
    let personsBornOnParticularDay = birthdayCountPerDay[key];
    let counter = 0;
    if (personsBornOnParticularDay.length) {
      if (personsBornOnParticularDay.length > 81) {
        createErrorMessage("Birthdays display per day is restricted to 81");
      }
      let gridSize = calculateGridSize(personsBornOnParticularDay.length);
      personsBornOnParticularDay.forEach((person) => {
        counter++;
        let initial = "";
        let nameString = person.name.split(" ");
        if (nameString.length > 1) {
          initial = nameString[0][0] + nameString[1][0];
        } else if (nameString.length === 1) {
          initial = nameString[0];
        }

        if (initial === "") {
          initial = "NA";
        }
        if (counter <= 81) {
          addBirthdayCard(initial, key, gridSize);
        }
      });
    }
  });

  clearUpDays();
}
