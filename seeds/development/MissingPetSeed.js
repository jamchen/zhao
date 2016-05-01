var faker = require('faker');

//function to be evaluated to obtain data
module.exports = function(done) {
	faker.locale = 'zh_TW';
    var data = [];
    for (var i = 0; i < 10; i++) {
    	data.push({
    		name: faker.helpers.randomize(['小白', '小黃', '小黑', '小花']),
    		kind: faker.helpers.randomize(['貓', '狗', '小孩']),
    		gender: faker.helpers.randomize(['male', 'female']),
    		color: faker.helpers.randomize(['黑', '黃', '橘', '黑白相間', '玳瑁', '虎斑']),
    		weight: faker.random.number(50),
    		neuter: faker.random.boolean(),
    		hasMicrochip: faker.random.boolean(),
    		hasCollar: faker.random.boolean(),
    		breed: faker.helpers.randomize(['加菲貓', '豹貓', '柯基', '大白熊', '馬爾濟斯']),
    		location: faker.address.city(),
    		missingDate: faker.helpers.randomize([faker.date.past(), faker.date.recent()]),
    		mainPictureUrl: faker.image.cats(),
    		description: faker.lorem.paragraphs(),
    		age: faker.random.number(30),
    		creator: 1,
    	});
    }

    //remember to tell when your are done
    done(null, data);
};