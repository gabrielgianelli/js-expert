const Tax = require('../entities/tax');
const Transaction = require('../entities/transaction');
const BaseRepository = require('../repository/base/baseRepository');

class CarService {
    constructor({ cars }) {
        this.carRepository = new BaseRepository({ file: cars });
        this.taxesBasedOnAge = Tax.taxesBasedOnAge;
        this.currencyFormat = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    getRandomPositionFromArray(list) {
        return Math.floor(Math.random() * list.length);
    }

    chooseRandomCar(carCategory) {
        const carIndex = this.getRandomPositionFromArray(carCategory.carIds);
        return carCategory.carIds[carIndex];
    }

    async getAvailableCar(carCategory) {
        const carId = this.chooseRandomCar(carCategory);
        return await this.carRepository.find(carId);  
    }

    calculateFinalPrice(customer, carCategory, numberOfDays) {
        const { then: tax } = this.taxesBasedOnAge.find(tax => 
            customer.age >= tax.from && customer.age <= tax.to
        );
        const price = tax * carCategory.price * numberOfDays;
        return this.currencyFormat.format(price);
    }

    async rent(customer, carCategory, numberOfDays) {
        const car = await this.getAvailableCar(carCategory);
        const price = this.calculateFinalPrice(customer, carCategory, numberOfDays);
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + numberOfDays)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDueDate = dueDate.toLocaleDateString('pt-br', options);
        return new Transaction({
            customer, 
            car,
            dueDate: formattedDueDate,
            amount: price
        });
    }
}
module.exports = CarService;