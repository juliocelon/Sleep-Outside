export default class Alert {
  constructor() {}

  async createAlerts() {
    const alerts = await this.getAlerts()

    let alertHtml = '<section class="alert-list">\n';
    alerts.forEach(alert => {
      const singleAlertHtml = `<p style="background-color:${alert.backgroundColor}; color:${alert.color};">${alert.message}</p>\n`;
      alertHtml += singleAlertHtml;
    });
    alertHtml += '</section>'

    console.log(alertHtml);

    const main = document.querySelector("main");
    main.insertAdjacentHTML('beforebegin', alertHtml);
  }

  async getAlerts() {
    const fetchedData = await fetch('/public/json/alerts.json');
    return await fetchedData.json();
  }
}
