import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    icon: '🦁',
    description: 'Wild, domestic, and exotic creatures from around the world',
    words: [
      'Tiger', 'Lion', 'Elephant', 'Dog', 'Cat', 'Giraffe', 'Monkey', 'Bear',
      'Horse', 'Zebra', 'Wolf', 'Kangaroo', 'Panda', 'Cheetah', 'Dolphin',
      'Whale', 'Leopard', 'Koala', 'Hippopotamus', 'Rhinoceros', 'Fox',
      'Rabbit', 'Deer', 'Squirrel', 'Camel', 'Crocodile', 'Gorilla',
      'Chimpanzee', 'Hedgehog', 'Otter', 'Jaguar', 'Hyena'
    ]
  },
  {
    id: 'birds',
    name: 'Birds',
    icon: '🦚',
    description: 'Feathered fliers, songbirds, and majestic birds of prey',
    words: [
      'Peacock', 'Parrot', 'Eagle', 'Sparrow', 'Crow', 'Pigeon', 'Owl',
      'Flamingo', 'Kingfisher', 'Penguin', 'Swan', 'Woodpecker', 'Vulture',
      'Hummingbird', 'Seagull', 'Ostrich', 'Pelican', 'Falcon', 'Toucan',
      'Robin', 'Hornbill', 'Cuckoo', 'Canary', 'Albatross', 'Duck',
      'Hawk', 'Stork', 'Crane', 'Swallow', 'Cockatoo'
    ]
  },
  {
    id: 'shapes',
    name: 'Shapes',
    icon: '🔷',
    description: 'Geometric 2D and 3D figures, polygons, and spatial patterns',
    words: [
      'Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Oval',
      'Hexagon', 'Diamond', 'Pentagon', 'Octagon', 'Crescent', 'Trapezoid',
      'Rhombus', 'Cylinder', 'Cone', 'Sphere', 'Cube', 'Heart',
      'Parallelogram', 'Semicircle', 'Heptagon', 'Spiral', 'Pyramid',
      'Torus', 'Prism', 'Cross', 'Arrow', 'Polygon'
    ]
  },
  {
    id: 'colors',
    name: 'Colors',
    icon: '🎨',
    description: 'Vibrant hues, shades, pastels, and metallic tones',
    words: [
      'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink',
      'Black', 'White', 'Cyan', 'Magenta', 'Maroon', 'Teal', 'Navy Blue',
      'Turquoise', 'Violet', 'Indigo', 'Gold', 'Silver', 'Beige',
      'Lavender', 'Crimson', 'Olive', 'Coral', 'Bronze', 'Emerald',
      'Amber', 'Charcoal', 'Ruby', 'Sapphire'
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌋',
    description: 'Landforms, bodies of water, and wonders of Mother Earth',
    words: [
      'Mountain', 'Waterfall', 'River', 'Ocean', 'Forest', 'Rainbow',
      'Volcano', 'Desert', 'Cloud', 'Glacier', 'Cave', 'Canyon', 'Island',
      'Valley', 'Beach', 'Jungle', 'Geyser', 'Lightning', 'Meadow',
      'Sunrise', 'Sunset', 'Lagoon', 'Coral Reef', 'Swamp', 'Tornado',
      'Oasis', 'Volcanic Crater', 'Sand Dune', 'Thunderstorm', 'Cliff'
    ]
  },
  {
    id: 'placesIndia',
    name: 'Popular Places in India',
    icon: '🕌',
    description: 'Iconic heritage monuments, scenic destinations, and bustling cities',
    words: [
      'Taj Mahal', 'Gateway of India', 'Goa', 'Jaipur', 'Mumbai',
      'Delhi', 'Kerala', 'Manali', 'Kashmir', 'Varanasi', 'Golden Temple',
      'Qutub Minar', 'Hampi', 'Mysore Palace', 'Red Fort', 'Rishikesh',
      'Udaipur', 'Ooty', 'Darjeeling', 'Leh Ladakh', 'Charminar',
      'Ajanta Caves', 'Meenakshi Temple', 'Andaman Islands', 'Shimla',
      'Konark Sun Temple', 'Sundarbans', 'Jaisalmer', 'Gokarna', 'Pondicherry'
    ]
  },
  {
    id: 'indianMovies',
    name: 'Popular Indian Movies',
    icon: '🎬',
    description: 'Blockbuster cinematic masterpieces and timeless classics',
    words: [
      '3 Idiots', 'Dangal', 'Jawan', 'Pathaan', 'Sholay', 'Lagaan',
      'Kantara', 'RRR', 'Baahubali', 'KGF', 'DDLJ',
      'Taare Zameen Par', 'Zindagi Na Milegi Dobara', 'PK',
      'Bajrangi Bhaijaan', 'Gangs of Wasseypur', 'Swades', 'Drishyam',
      'Vikram', 'Pushpa', 'Stree', 'Chak De India', 'Munna Bhai MBBS',
      'Hera Pheri', 'Barfi', 'Gadar', 'Lage Raho Munna Bhai', 'Queen'
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    icon: '🥭',
    description: 'Sweet, tropical, juicy, and delicious fruits of the world',
    words: [
      'Mango', 'Apple', 'Banana', 'Orange', 'Watermelon', 'Grapes',
      'Pineapple', 'Strawberry', 'Papaya', 'Guava', 'Pomegranate',
      'Lychee', 'Kiwi', 'Peach', 'Plum', 'Cherry', 'Blueberry',
      'Coconut', 'Fig', 'Apricot', 'Custard Apple', 'Dragonfruit',
      'Jackfruit', 'Pear', 'Blackberry', 'Raspberry', 'Avocado',
      'Passion Fruit', 'Cantaloupe', 'Mulberry'
    ]
  },
  {
    id: 'electronicDevices',
    name: 'Electronic Devices',
    icon: '📱',
    description: 'Everyday gadgets, tech accessories, and computing equipment',
    words: [
      'Smartphone', 'Laptop', 'Television', 'Headphones', 'Tablet',
      'Smartwatch', 'Camera', 'Keyboard', 'Gaming Console', 'Smart Speaker',
      'Drone', 'Computer Mouse', 'Projector', 'Wireless Earbuds',
      'VR Headset', 'Power Bank', 'Microphone', 'Smart Band', 'Monitor',
      'Wi-Fi Router', 'Printer', 'Flash Drive', 'E-Reader', 'Fitness Tracker',
      'Bluetooth Speaker', 'Hard Drive', 'Webcam', 'Action Camera'
    ]
  },
  {
    id: 'onlineGamesIndia',
    name: 'Online Games Popular in India',
    icon: '🎮',
    description: 'Multiplayer battle royales, sandbox worlds, and party games',
    words: [
      'BGMI', 'Free Fire', 'Minecraft', 'Roblox', 'Valorant',
      'GTA Online', 'Call of Duty', 'Among Us', 'Clash of Clans',
      'PUBG New State', 'FIFA Mobile', 'Asphalt 9', 'Ludo King',
      'Genshin Impact', 'Subway Surfers', 'Temple Run', 'Candy Crush',
      'Apex Legends', 'League of Legends', 'Mobile Legends',
      'Brawl Stars', 'Chess.com', 'Pokemon GO', 'Clash Royale', 'Rocket League'
    ]
  }
];

// Helper to look up a category by id or name
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase());
}
