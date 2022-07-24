// START_SUBSCRIPTION 05-02-2022
// ADD_SUBSCRIPTION MUSIC PERSONAL
// ADD_SUBSCRIPTION VIDEO PREMIUM
// ADD_SUBSCRIPTION PODCAST FREE
// ADD_TOPUP FOUR_DEVICE 2
// PRINT_RENEWAL_DETAILS


const fs = require("fs");
const filename = "sampleInput/input1.txt";
const moment = require('moment')

let input = fs.readFileSync(filename, "utf-8")

let allPlans = {
    MUSIC: {
        FREE: { amount: 0, month: 1 },
        PERSONAL: { amount: 100, month: 1 },
        PREMIUM: { amount: 250, month: 3 }
    },
    VIDEO: {
        FREE: { amount: 0, month: 1 },
        PERSONAL: { amount: 200, month: 1 },
        PREMIUM: { amount: 500, month: 3 }
    },
    PODCAST: {
        FREE: { amount: 0, month: 1 },
        PERSONAL: { amount: 100, month: 1 },
        PREMIUM: { amount: 300, month: 3 }
    }
};

let topUp = {
    FOUR_DEVICE: { amount: 50, device: 4 },
    TEN_DEVICE: { amount: 100, device: 10 }
};


class DoremiProject {
    constructor() {
        this.totalSubscription = []
        this.subscriptionPlan = {}
        this.topUp = {}
        this.totalPrice = 0
    }


    addDate(date) {
        const regex = /^((0)[1-9]|[1-2][0-9]|(3)[0-1])(-)(((0)[1-9])|((1)[0-2]))(-)\d{4}$/
        if (!regex.test(date)) {
            return console.log('Please Enter A Valid Date , (Example : dd-mm-yyyy)');
        }
        this.subscriptionPlan.purchasedAt = date;
    }


    subscription(type, plan) {

        let planType = allPlans[type];
        let month = planType[plan].month;
        let amount = planType[plan].amount;

        if (!this.subscriptionPlan.purchasedAt) {
            return console.log(`You Can't add a subscription, Because Date is not valid`);
        }

        let date = moment(this.subscriptionPlan.purchasedAt, "DD-MM-YYYY").add(month, 'M').format('DD-MM-YYYY');


        this.subscriptionPlan.type = type;
        this.subscriptionPlan.plan = plan;
        this.subscriptionPlan.endDate = date;
        this.subscriptionPlan.amountPaid = amount

        let subPlan = { ...this.subscriptionPlan }
        this.totalSubscription.push(subPlan)

        let sum = 0;
        for (let i = 0; i < this.totalSubscription.length; i++) {
            sum += this.totalSubscription[i].amountPaid
        }
        this.totalPrice = sum + (this.topUp.amount || 0)
    }


    addTopUp(device, num) {
        if (this.totalSubscription.length == 0) {
            return console.log(`You can't add top-up, Because atfirst You have to add subscription.`)
        }

        this.topUp.plan = device;
        this.topUp.amount = topUp[device].amount * num;
        this.topUp.purchasedAt = this.subscriptionPlan.purchasedAt
        this.totalPrice = this.totalPrice + this.topUp.amount;
    }


    printInformation(input) {
        let inputArr = input.split("\r\n");
        if (inputArr.length == 0) {
            return;
        }
        for (let i = 0; i < inputArr.length; i++) {
            let userInput = inputArr[i].split(" ")

            if (userInput[0] == 'START_SUBSCRIPTION') {
                this.addDate(userInput[1])
            }
            if (userInput[0] == 'ADD_SUBSCRIPTION') {
                this.subscription(userInput[1], userInput[2])
            }
            if (userInput[0] == 'ADD_TOPUP') {
                this.addTopUp(userInput[1], userInput[2])
            }
            if (userInput[0] == 'PRINT_RENEWAL_DETAILS') {
                let output = {
                    subscriptionPlans: this.totalSubscription,
                    topUp: this.topUp,
                    totalPrice: this.totalPrice
                }
                return console.log(output)
            }
        }
    }
}

let doremiProject = new DoremiProject()
let Output = doremiProject.printInformation(input)

module.exports = {
    Output
}
