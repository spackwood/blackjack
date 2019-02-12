/*----- constants ------*/
var currentPlayer = 0;
var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;
//Values of all cards

function createDeck() {
            deck = new Array();
            for (var i = 0 ; i < values.length; i++)
            {
                for(var x = 0; x < suits.length; x++)
                {
                    var weight = parseInt(values[i]);
                    if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                        weight = 10;
                    if (values[i] == "A")
                        weight = 11;
                    var card = { Value: values[i], Suit: suits[x], Weight: weight };
                    deck.push(card);
                }
            }
        }



/*-----app's state (variables) -----*/
/*----- cashed element ------*/

/*----- event listeners -----*/
//Deal button starts the game and then not responsive until player gives input.
document.querySelector('#startBtn').addEventListener('click', gameStart);
// Hit button that starts the drawCards ()
document.querySelector('#hitBtn').addEventListener('click', hitMe);
//Stand button causes the players turn to end and dealers turn starts.
 document.querySelector('#stayBtn').addEventListener('click', stay);
/*----- functions -------*/

//Player Arrays 
function createPlayers(num) {
    
    players = new Array();
    for(var i = 1; i <= num; i++) {
        var hand = new Array();
        var player = { 
            Name: 'Player ' + i, 
            ID: i, 
            Points: 0, 
            Hand: hand 
        };
            players.push(player);
      }
    
}


//Player UI Created
function createPlayersUI() {
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++)
    {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');
        
        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;
        
        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);

    }
   
}

//Cards are randomized before picked.

function shuffle()
        {
            // for 1000 turns
            // switch the values of two random cards
            for (var i = 0; i < 1000; i++)
            {
                var location1 = Math.floor((Math.random() * deck.length));
                var location2 = Math.floor((Math.random() * deck.length));
                var tmp = deck[location1];

                deck[location1] = deck[location2];
                deck[location2] = tmp;
            }
        }

//Game starts when deal button is pressed
function gameStart() {
    document.getElementById('startBtn').value = 'Deal';
    document.getElementById('status').style.display="none";
    // Deal 2 cards
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

function dealHands() {
    // alternate cards to each player for a total of 2
    for (var i = 0; i < 2; i++)
    {
        for (var x = 0; x < players.length; x++)
        {
            var card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
        }
    }
    
    updateDeck();
}
//Draws a card for player

function renderCard(card, player)
        {
            var hand = document.getElementById('hand_' + player);
            hand.appendChild(getCardUI(card));
        }

        function getCardUI(card)
        {
            var el = document.createElement('div');
            var icon = '';
            if (card.Suit == 'Hearts')
            icon='&hearts;';
            else if (card.Suit == 'Spades')
            icon = '&spades;';
            else if (card.Suit == 'Diamonds')
            icon = '&diams;';
            else
            icon = '&clubs;';
            
            el.className = 'card';
            el.innerHTML = card.Value + '<br/>' + icon;
            return el;
        }
// returns the total of the cards
function getPoints(player) {
    var points = 0;
    for(var i = 0; i < players[player].Hand.length; i++)
        {
        points += players[player].Hand[i].Weight;
        }
            players[player].Points = points;
            return points;
    }
    

function updatePoints() {
    for (var i = 0 ; i < players.length; i++)
    {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

function hitMe() {
    //pop a card from the deck to the current player
    //check if current players new total are over 21
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    check();

}

function check() {
    if (players[currentPlayer].Points > 21) {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' Lost';
        document.getElementById('status').style.display = "inline-block";
        end();
    }
}

//check to see if player goes over 21 if does dealer wins.
//if dealer gets 15 or more stays. If dealer gets 
//less than 14 hits and if card value is over 21 
//then player wins. 


function stay()
    {
        // move on to next player, if any
        if (currentPlayer != players.length-1) {
            document.getElementById('player_' + currentPlayer).classList.remove('active');
            currentPlayer += 1;
            document.getElementById('player_' + currentPlayer).classList.add('active');
        }

        else {
            end();
        }
    }

    function end()
    {
        var winner = -1;
        var score = 0;

        for(var i = 0; i < players.length; i++)
        {
            if (players[i].Points > score && players[i].Points < 22)
            {
                winner = i;
            }

            score = players[i].Points;
        }

        document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
        document.getElementById("status").style.display = "inline-block";
    }

function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length;
}

window.addEventListener('load', function() {
    createDeck();
    shuffle();
    createPlayers(1);
});