import Alert from "./Alert.mjs";
import { loadHeaderFooter } from "./utils.mjs";

//Call function to load headers and footers
loadHeaderFooter();

//Function to generate an alert on the home page
const alert = new Alert();
alert.createAlerts();
