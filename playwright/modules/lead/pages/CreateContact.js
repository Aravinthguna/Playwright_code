const { WebElement } = require("../../../utils/WebElements");
const { test, expect } = require("@playwright/test");
const { getRandomDate } = require("../../../utils/DateUtils");

const webelement = new WebElement();

class CreateContact {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }

  async createContact(count = 1) {
    const {
      createContactButton,
      FirstName,
      LastName,
      contactemail,
      phoneNumber,
      saveContactButton,
    } = webelement.pageElement(this.page);

    const firstNames = [
      "Aarav", "Rohan", "Priya", "Neha", "Amit", "Rahul", "Sneha", "Vikram",
      "Karan", "Anjali", "Suresh", "Vijay", "Aditya", "Riya", "Kiran", "Deepak",
      "Pooja", "Manish", "Sunita", "Rajesh", "Kavita", "Sanjay", "Meera", "Arjun"
    ];
    const lastNames = [
      "Sharma", "Verma", "Kumar", "Singh", "Gupta", "Patel", "Mehta", "Joshi",
      "Das", "Nair", "Reddy", "Rao", "Iyer", "Choudhury", "Sen", "Pillai", "Bose"
    ];

    for (let i = 0; i < count; i++) {
      await this.page.waitForTimeout(500);
      await createContactButton.click();
      await this.page.waitForTimeout(300);

      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${randomSuffix}@gmail.com`;

      // 10-digit mobile number starting with 6, 7, 8, or 9
      const startingDigits = ["9", "8", "7", "6"];
      const startDigit = startingDigits[Math.floor(Math.random() * startingDigits.length)];
      const randomPhone = startDigit + Math.floor(100000000 + Math.random() * 900000000).toString();

      console.log(`Linked Contact [${i + 1}/${count}]: ${randomFirstName} ${randomLastName}, Email: ${randomEmail}, Mobile: ${randomPhone}`);

      await FirstName.fill(randomFirstName);
      await expect(FirstName).toHaveValue(randomFirstName);

      await LastName.fill(randomLastName);
      await expect(LastName).toHaveValue(randomLastName);

      await contactemail.fill(randomEmail);
      await expect(contactemail).toHaveValue(randomEmail);

      await phoneNumber.fill(randomPhone);
      await expect(phoneNumber).toHaveValue(randomPhone);

      await saveContactButton.click();
      await this.page.waitForTimeout(1000);
    }
  }
}

module.exports = { CreateContact };
