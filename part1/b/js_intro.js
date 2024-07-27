// ARRAYS

const t = [1, 2, 3];
console.log(t);
t.push(5);
t.forEach((i) => console.log(i));

const t2 = t.map((val) => val ** 2);
console.log(t2);

const [first, second, ...rest] = t2;
console.log(first, " - ", second, " - ", rest);

/****************** */
// OBJECTS
/****************** */
const userObj = {
  name: {
    first: "Dan",
    last: "Abramov",
  },
  grades: [2, 3, 5, 3],
  department: "Stanford University",
};
console.log(userObj.name.first);
console.log(userObj["department"]);

userObj.address = "La Tepal";
userObj["secret number"] = 12341;
console.log(userObj);

/****************** */
// FUNCTIONS
/****************** */

// Function Declaration
function product(a, b) {
  return a * b;
}
console.log(product(3, 8));

// Function Expression
const average = function (a, b) {
  return (a + b) / 2;
};
console.log(average(192, 4));

// ARROW Function
const sum = (p1, p2) => p1 + p2;
console.log(sum(3, 4));

/****************** */
// THIS
/****************** */

const name = "Tere";

const arto = {
  name: "Arto Hellas",
  age: 35,
  education: "PhD",
  greet: function () {
    console.log("hello, my name is " + this.name);
  },
  doAddition: function (a, b) {
    console.log(a + b);
  },
};

const referenceToAddition = arto.doAddition;
referenceToAddition(12, 2);
const referenceToGreet = arto.greet;
referenceToGreet(); // ==> hello, my name is undefined
const referenceToGreetBind = arto.greet.bind(arto);
referenceToGreetBind(); // ==> hello, my name is Arto Hellas

/****************** */
// CLASSES
/****************** */

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log("Hello, my name is " + this.name);
  }
}

const adam = new Person("Adam", 20);
adam.greet();
