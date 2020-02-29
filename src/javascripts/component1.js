import JsBoom from './jsboom';

const app = new JsBoom({
    title: 'Zilingo funline',
    firstName: 'Amit',
    lastName: 'Singh',
    age: 28,

    fullName() {
        return this.firstName + ' ' + this.lastName;
    },
    shortInfo() {
        return this.firstName + ', ' + this.age;
    }
});

function updateText (property, e) {
    app.data[property] = e.target.value
}

// document.getElementById("firstName").addEventListener("input", (e) => {
//     updateText("firstName", e);
// });
// document.getElementById("age").addEventListener("input", (e) => {
//     updateText("age", e);
// });