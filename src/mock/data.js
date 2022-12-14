const points = [{
  type: 'taxi',
  destination: 1,
  offers: [1, 2],
  start: new Date(2019, 10, 26, 16, 0),
  end: new Date(2019, 10, 26, 18, 0),
  price: 1000
}, {
  type: 'bus',
  destination: 2,
  offers: [1],
  start: new Date(2019, 11, 26, 16, 0),
  end: new Date(2019, 11, 26, 19, 0),
  price: 2000
}, {
  type: 'drive',
  destination: 3,
  offers: [2],
  start: new Date(2019, 12, 26, 16, 0),
  end: new Date(2019, 12, 26, 20, 0),
  price: 3000
}
];

const destinations = [{
  'id': 1,
  'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
  'name': 'Chamonix',
  'pictures': [
    {
      'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
      'description': 'Chamonix parliament building'
    }
  ]
},
{
  'id': 2,
  'description': 'Amsterdam, is a excellent city, a true european pearl, with crowded streets.',
  'name': 'Amsterdam',
  'pictures': [
    {
      'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
      'description': 'Amsterdam goverment building'
    }
  ]
}, {
  'id': 3,
  'description': 'Washington, is a excellent city, a true american pearl, with crowded streets.',
  'name': 'Washington',
  'pictures': [
    {
      'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
      'description': 'Capitoll hill'
    }
  ]
}];

const offersByTaxi = [{
  'id': 1,
  'title': 'Upgrade to a business class',
  'price': 120

}, {
  'id': 2,
  'title': 'Upgrade to a business-premium class',
  'price': 140

}];
const offersByBus = [{
  'id': 1,
  'title': 'Upgrade to a comfort class',
  'price': 200

}, {
  'id': 2,
  'title': 'Lunch',
  'price': 150

}];
const offersByDrive = [{
  'id': 1,
  'title': 'Gasoline',
  'price': 160

}, {
  'id': 2,
  'title': 'Dinner',
  'price': 180

}];

const offers = [{
  type: 'bus',
  offers: offersByBus
},
{
  type: 'taxi',
  offers: offersByTaxi
},
{
  type: 'drive',
  offers: offersByDrive
}];

export { points, offers, destinations };

