let cards;
let attributes;
let uniqueAttributes;

let currentCard;
let currentAttribute;

async function loadData() {
    console.log("run")
    let response = await fetch("./data.json");
    let json = await response.json();
    
    attributes = json.attributes;
    cards = json.cards;

    //Check that all objects has all neccessary attributes
    outerLoop:
    for (const card of cards) {
        for (const attribute of attributes) {
            if(!card[attribute]) {
                alert(`Not all objects have the required attributes: ${attribute}`);
                break outerLoop;
            }
        }
    }

    //Find all unique values for each attribute
    uniqueAttributes = {};

    for (const attribute of attributes) {
        const uniques = new Set();
        for (const card of cards) {
            uniques.add(card[attribute]);
        }
        uniqueAttributes[attribute] = Array.from(uniques);
    }

    displayNextCard();
}

function buttonPress(buttonIndex) {
    let button = document.getElementById(`button${buttonIndex}`);
    let answer = button.innerHTML;

    if(answer === cards[currentCard][currentAttribute]) {
        button.style.background = "green";
        setTimeout(displayNextCard, 500);
    }
    else {
        button.style.background = "red";
    }
}

function displayNextCard() {
    let cardIndex = random(0, cards.length);
    let attribIndex = random(0, attributes.length);

    currentCard = cardIndex;
    currentAttribute = attributes[attribIndex];

    displayCard(cardIndex, attribIndex);
}

function displayCard(cardIndex, attribIndex) {
    let card = cards[cardIndex];

    //Image section
    document.getElementById("image").src = card.image;
    
    //Text section
    let list = []

    for (const i in attributes) {
        let attribute = attributes[i];
        let p = document.createElement("p");

        if(i == attribIndex)
            p.innerHTML = `${attribute}: ???`;
        else
            p.innerHTML = `${attribute}: ${card[attribute]}`

        list.push(p);
    }
    document.getElementById("text_section").replaceChildren(...list);

    //Button section
    let options = createOptions(cardIndex, attribIndex);

    for(let i = 0; i < 3; i++) {
        let button = document.getElementById(`button${i}`);
        button.innerHTML = options[i];
        button.style.background = "";
    }
}

function createOptions(dataIndex, attribIndex) {
    let options = [];
    let attribute = attributes[attribIndex];

    //TODO: Better picking algo

    options.push(cards[dataIndex][attribute]);
    options.push(uniqueAttributes[attribute][random(0, uniqueAttributes[attribute].length)]);
    options.push(uniqueAttributes[attribute][random(0, uniqueAttributes[attribute].length)]);

    //Mini shuffle
    for(let i = random(0, 3); i > 0; i--) {
        options.push(options.shift());
    }

    return options;
}

function random(start, end) {
    return start + Math.floor(Math.random() * (end-start))
}