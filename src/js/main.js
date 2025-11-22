import Alert from "./Alert.mjs";
import { loadHeaderFooter } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Function to generate an alert on the home page
const alert = new Alert();
alert.createAlerts();

//Newsletter Sign-Up
//Add event listener so the modal will pop up when submit is clicked
const newsletterDialog = document.querySelector("#newsletter-modal");

document.querySelector("#newsletter-submit").addEventListener("click", (event) => {
    event.preventDefault(); //prevents page refresh
    const newsletterForm = document.querySelector('#newsletter-form');
    const chk_status = newsletterForm.checkValidity();
    newsletterForm.reportValidity();
    if (chk_status) {
        //Save name and email to local storage
        const firstName = newsletterForm.fname.value;
        const lastName = newsletterForm.lname.value;
        const email = newsletterForm.userEmail.value;

        addSubscriber(firstName, lastName, email);

        //Show modal
        newsletterDialog.showModal();

        //Clear form
        newsletterForm.reset();
    }
});

//Add event listener to close the modal
const newsletterModalClose = document.querySelector("#close-modal");
newsletterModalClose.addEventListener("click", () => {
    newsletterDialog.close();
})

//Function to save subscriber to local Storage
function addSubscriber(firstName, lastName, email) {
    //Pull subscribers array from local storage
    const newsletterSubscribers = JSON.parse(localStorage.getItem("newsletterSubscribers")) || [];

    //Add new subscriber
    const newSubscriber = { firstName, lastName, email };

    //Add new subscriber to array
    newsletterSubscribers.push(newSubscriber);

    //Save updated array back to localStorage
    localStorage.setItem("newsletterSubscribers", JSON.stringify(newsletterSubscribers));
}