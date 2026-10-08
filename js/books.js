// Bundled starter books (days 1–3). Every later day is written by Gemini at the right
// level and saved in the browser. To add your own book, copy one object and append it.
// Fields: q = question, o = 4 options, a = index (0–3) of the right option.
window.BOOKS = [
{
  id: 1, title: "A Morning at the Market", topic: "Food and shopping", level: "Starter",
  story: [
    "Selam wakes up at six o'clock. She washes her face, drinks a cup of coffee, and takes a big basket. Today is Saturday, and she wants to go to the market.",
    "The market is near her house, so she walks. It takes ten minutes. The market is busy. Many people are buying and selling. A man sells red tomatoes. A woman sells yellow bananas. Children run between the tables and laugh.",
    "Selam goes to the vegetable table. \"Good morning! How much are the tomatoes?\" she asks. \"Forty birr for one kilo,\" says the man. \"That is expensive,\" says Selam. \"Can I pay thirty-five?\" The man smiles. \"Okay, for you, thirty-five.\"",
    "She buys one kilo of tomatoes, two onions, and some bread. Then she buys a bag of rice. The bag is heavy, so a young boy helps her carry it. She says, \"Thank you very much.\" He says, \"You are welcome.\"",
    "At nine o'clock, Selam goes home. She is tired but happy. She cooks lunch for her family, and everyone says the food is delicious. Selam thinks, \"A good day starts at the market.\""
  ],
  vocab: [
    { word: "market", meaning: "a place where people buy and sell things like food and clothes", example: "I buy fresh vegetables at the market." },
    { word: "basket", meaning: "a container with a handle that you use to carry things", example: "She put the apples in a basket." },
    { word: "expensive", meaning: "costing a lot of money", example: "This coat is too expensive for me." },
    { word: "heavy", meaning: "weighing a lot, hard to lift", example: "The box is heavy, please help me." },
    { word: "delicious", meaning: "tasting very good", example: "Your coffee is delicious." },
    { word: "tired", meaning: "feeling that you need to rest or sleep", example: "I am tired after a long day." }
  ],
  questions: [
    { q: "What time does Selam wake up?", o: ["Six o'clock", "Seven o'clock", "Five o'clock", "Nine o'clock"], a: 0 },
    { q: "What day is it in the story?", o: ["Sunday", "Saturday", "Monday", "Friday"], a: 1 },
    { q: "How does Selam get to the market?", o: ["By bus", "By taxi", "She walks", "By bicycle"], a: 2 },
    { q: "What does the woman sell?", o: ["Red tomatoes", "Rice", "Bread", "Yellow bananas"], a: 3 },
    { q: "What is the first price of the tomatoes?", o: ["Forty birr for one kilo", "Thirty birr for one kilo", "Thirty-five birr for one kilo", "Fifty birr for one kilo"], a: 0 },
    { q: "How much does Selam pay for one kilo of tomatoes?", o: ["Forty birr", "Thirty-five birr", "Thirty birr", "Forty-five birr"], a: 1 },
    { q: "Which thing does Selam NOT buy?", o: ["Onions", "Bread", "Bananas", "Rice"], a: 2 },
    { q: "Who helps Selam carry the rice?", o: ["The man at the table", "Her husband", "A young boy", "A woman"], a: 2 },
    { q: "What time does Selam go home?", o: ["At six o'clock", "At nine o'clock", "At noon", "At ten o'clock"], a: 1 },
    { q: "What does her family say about the lunch?", o: ["It is too salty", "It is cold", "It is not ready", "It is delicious"], a: 3 }
  ]
},
{
  id: 2, title: "Luna the Cat and Max the Dog", topic: "Animals", level: "Starter",
  story: [
    "Daniel has two pets. One is a small grey cat called Luna. The other is a big brown dog called Max. They live in a little house with a garden.",
    "Every morning, Max wakes up first. He runs to the door and barks loudly. Daniel opens the door, and Max runs into the garden. Luna wakes up later. She stretches, yawns, and walks slowly to her bowl. She likes milk and fish.",
    "Max and Luna are not always friends. Yesterday, Max took Luna's toy mouse. Luna was angry. She jumped on the table and looked at him from above. Max sat down and put his head on the floor. He was sorry.",
    "In the afternoon, Daniel works at his desk. Luna sleeps on the warm chair next to him, and Max lies under the desk. The house is quiet. Daniel says, \"My animals are my best friends.\"",
    "In the evening, Daniel and Max go for a walk in the park. Max runs after the birds, but he never catches one. Luna stays at home. Cats do not like long walks, and she prefers her soft bed."
  ],
  vocab: [
    { word: "pet", meaning: "an animal that you keep at home as a friend", example: "My sister's pet is a rabbit." },
    { word: "bark", meaning: "the loud sound that a dog makes", example: "The dog starts to bark when someone comes." },
    { word: "stretch", meaning: "to make your body long and straight after sleeping", example: "I stretch my arms when I wake up." },
    { word: "angry", meaning: "feeling very upset about something", example: "He is angry because the bus is late." },
    { word: "quiet", meaning: "with very little noise", example: "Please be quiet, the baby is sleeping." },
    { word: "prefer", meaning: "to like one thing more than another thing", example: "I prefer tea to coffee." }
  ],
  questions: [
    { q: "How many pets does Daniel have?", o: ["One", "Three", "Two", "Four"], a: 2 },
    { q: "What colour is Luna?", o: ["Brown", "Grey", "Black", "White"], a: 1 },
    { q: "Who wakes up first in the morning?", o: ["Luna", "Max", "Daniel", "The birds"], a: 1 },
    { q: "What does Luna like?", o: ["Bones", "Grass", "Bread", "Milk and fish"], a: 3 },
    { q: "What did Max take yesterday?", o: ["Luna's toy mouse", "Daniel's shoe", "Luna's bowl", "A bird"], a: 0 },
    { q: "Where did Luna jump when she was angry?", o: ["On the bed", "On the table", "On the chair", "Into the garden"], a: 1 },
    { q: "Where does Luna sleep in the afternoon?", o: ["Under the desk", "In the garden", "On the warm chair", "In the park"], a: 2 },
    { q: "Where does Max lie in the afternoon?", o: ["Under the desk", "On the table", "In his bed", "At the door"], a: 0 },
    { q: "What does Max run after in the park?", o: ["Cats", "Cars", "Children", "Birds"], a: 3 },
    { q: "Why does Luna stay at home in the evening?", o: ["She is sick", "She is afraid of the park", "Cats do not like long walks", "Daniel does not want her"], a: 2 }
  ]
},
{
  id: 3, title: "Omar's New Car", topic: "Cars and logos", level: "Starter",
  story: [
    "Omar is thirty-five years old. He works in an office and takes the bus every day. Last month he saved enough money, and now he wants to buy his first car.",
    "On Sunday, Omar goes to a car shop with his brother. There are many cars: red, white, blue, and black. He sees different logos on the front of the cars. A star inside a circle is the logo of Mercedes. Four rings make the Audi logo. A blue oval is the logo of Ford. Toyota's logo has three ovals.",
    "The salesman shows him a small white Toyota. \"It is cheap, and it uses little petrol,\" he says. Omar opens the door, sits inside, and touches the steering wheel. He checks the seats, the mirrors, and the radio.",
    "\"Can I drive it?\" Omar asks. \"Of course,\" says the salesman. They drive around the block. The engine is quiet, and the brakes work well. Omar smiles. \"I love this car,\" he says.",
    "Omar signs the papers and pays with his bank card. His brother says, \"Be careful on the road, and always wear your seat belt.\" Omar drives home slowly. Tomorrow he will not take the bus."
  ],
  vocab: [
    { word: "logo", meaning: "a small picture or sign that shows the name of a company", example: "The logo on my shirt is a small bird." },
    { word: "salesman", meaning: "a person whose job is to sell things", example: "The salesman showed us three phones." },
    { word: "petrol", meaning: "the liquid that a car uses to move", example: "I need to buy petrol before the trip." },
    { word: "engine", meaning: "the part of a car that makes it move", example: "The engine makes a strange noise." },
    { word: "brakes", meaning: "the parts of a car that make it stop", example: "Use the brakes when the light is red." },
    { word: "seat belt", meaning: "a strap that keeps you safe in a car", example: "Please put on your seat belt." }
  ],
  questions: [
    { q: "How old is Omar?", o: ["Thirty", "Thirty-five", "Forty", "Twenty-five"], a: 1 },
    { q: "How does Omar go to work now?", o: ["By car", "On foot", "By bus", "By bicycle"], a: 2 },
    { q: "Who goes with Omar to the car shop?", o: ["His wife", "His friend", "His father", "His brother"], a: 3 },
    { q: "Which logo is a star inside a circle?", o: ["Mercedes", "Audi", "Ford", "Toyota"], a: 0 },
    { q: "How many rings are in the Audi logo?", o: ["Three", "Four", "Five", "Two"], a: 1 },
    { q: "What colour is the car Omar chooses?", o: ["Red", "Blue", "White", "Black"], a: 2 },
    { q: "Why does the salesman like the car?", o: ["It is very fast", "It is cheap and uses little petrol", "It is very big", "It is new in the shop"], a: 1 },
    { q: "What does Omar do before he buys the car?", o: ["He calls his boss", "He sells his bus ticket", "He washes it", "He drives it around the block"], a: 3 },
    { q: "How does Omar pay?", o: ["With his bank card", "With cash", "With a cheque", "His brother pays"], a: 0 },
    { q: "What does Omar's brother tell him?", o: ["Drive fast", "Buy a bigger car", "Always wear your seat belt", "Take the bus tomorrow"], a: 2 }
  ]
}
];

// Daily-life topics. Gemini cycles through these when it writes day 4 onward.
window.TOPICS = ["Family and home", "Animals", "Cars, roads and transport", "Brands and logos", "Food and cooking", "At the doctor", "At the bank and money", "Shopping for clothes", "Weather and seasons", "Jobs and work", "Phone calls and messages", "Neighbours and friends", "Holidays and celebrations", "Travel and airports", "School and children", "Health and exercise", "Restaurants and cafes", "Time and appointments", "Directions in the city", "Fruits, vegetables and the kitchen"];
