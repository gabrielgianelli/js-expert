const BaseRepository = require('../repository/base/baseRepository');

class CarService {
    constructor({ cars }) {
        this.carRepository = new BaseRepository({ file: cars });
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
}
module.exports = CarService;