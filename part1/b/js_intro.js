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
