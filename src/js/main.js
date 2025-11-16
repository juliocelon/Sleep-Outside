import Alert from "./Alert.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load the header and footer
loadHeaderFooter();

const alert = new Alert();
alert.createAlerts();