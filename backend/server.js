// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Models
import User from './models/User.js';
import Destination from './models/Destination.js';
import Message from './models/Message.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Travel Blog API" });
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/travel_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully!"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Seed Destinations (only if empty)
async function initializeDestinations() {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      const destinations = [
        { title: 'Kashmir', description: 'Experience the Himalayas...', imgSrc: 'images/kashmir.jpg', isPopular: true },
        { title: 'Varanasi', description: 'Explore Kashi...', imgSrc: 'images/varanasi.jpg', isPopular: false },
        { title: 'Manali', description: 'Explore this trending destination...', imgSrc: 'images/manali.jpg', isPopular: false },
        { title: 'Vrindavan', description: 'Divine love...', imgSrc: 'images/mero_vrindavan.jpg', isPopular: false },
        { title: 'Spiti Valley', description: 'High-altitude desert in Himachal Pradesh, known for monasteries and stunning landscapes.', imgSrc: 'images/spiti.jpg', isPopular: false },
        { title: 'Landour', description: 'A serene hill station near Mussoorie, known for its colonial charm.', imgSrc: 'images/landour.jpg', isPopular: false },
        { title: 'Mussoorie', description: 'Known as the Queen of Hills, Mussoorie offers breathtaking Himalayan views.', imgSrc: 'images/mussoorie.jpg', isPopular: true },
        { title: 'Chopta', description: "Often called the 'Mini Switzerland of India', Chopta is the base for trekking and nature walks.", imgSrc: 'images/chopta.jpg', isPopular: true },
        { title: 'Nainital', description: 'A popular lake town surrounded by hills, offering boating, ropeway rides, and markets.', imgSrc: 'images/nainital.jpg', isPopular: true },
        { title: 'Ranikhet', description: 'A peaceful hill station known for apple orchards, pine forests, and panoramic views.', imgSrc: 'images/ranikhet.jpg', isPopular: false },
        { title: 'Udaipur', description: 'City of lakes, palaces, and romantic boat rides.', imgSrc: 'images/udaipur.jpg', isPopular: true },
        { title: 'Mysore', description: 'Famous for its palaces, gardens, and rich culture.', imgSrc: 'images/mysore.jpg', isPopular: false },
        { title: 'Darjeeling', description: 'Hill station in West Bengal with tea gardens and mountains.', imgSrc: 'images/darjeeling.jpg', isPopular: true },
        { title: 'Jaipur', description: 'The Pink City of Rajasthan with forts and palaces.', imgSrc: 'images/jaipur.jpg', isPopular: true },
        { title: 'Goa', description: 'Famous for beaches, nightlife, and water sports.', imgSrc: 'images/goa.jpg', isPopular: true },
        { title: 'Rishikesh', description: 'Known for yoga, adventure sports, and the Ganges.', imgSrc: 'images/rishikesh.jpg', isPopular: false },
        { title: 'Andaman Islands', description: 'Tropical paradise with pristine beaches and coral reefs.', imgSrc: 'images/AndamanIslands.jpg', isPopular: true },
        { title: 'Hampi', description: 'UNESCO World Heritage site with ancient ruins and boulders.', imgSrc: 'images/hampi.jpg', isPopular: false },
        { title: 'Shimla', description: 'Popular hill station in Himachal Pradesh with colonial charm.', imgSrc: 'images/shimla.jpg', isPopular: true },
        { title: 'Leh-Ladakh', description: 'Adventure destination with breathtaking mountains and monasteries.', imgSrc: 'images/leh.jpg', isPopular: true },
        { title: 'Kerala Backwaters', description: 'Relax in houseboats amidst palm-fringed lagoons and canals.', imgSrc: 'images/kerala.jpg', isPopular: true },
        { title: 'Shillong', description: 'Scotland of the East, known for waterfalls, music, and vibrant culture.', imgSrc: 'images/shillong.jpg', isPopular: false },
        { title: 'Ranthambore', description: 'National park in Rajasthan, best known for tiger safaris.', imgSrc: 'images/ranthambore.jpg', isPopular: true },
        { title: 'Pondicherry', description: 'French colonial town with beaches, cafes, and Auroville.', imgSrc: 'images/pondicherry.jpg', isPopular: false },
        { title: 'Coorg', description: 'Coffee capital of India, lush green hills, waterfalls, and trekking.', imgSrc: 'images/coorg.jpg', isPopular: true },
        { title: 'Agra', description: 'Home to the Taj Mahal, one of the Seven Wonders of the World.', imgSrc: 'images/agra.jpg', isPopular: true },
        { title: 'Cherrapunji', description: 'One of the wettest places on Earth, famous for living root bridges and waterfalls.', imgSrc: 'images/cherrapunji.jpg', isPopular: false },
        { title: 'Daman and Diu', description: 'Coastal union territory known for Portuguese forts, beaches, and churches.', imgSrc: 'images/daman.jpg', isPopular: false },
        { title: 'Ziro Valley', description: 'Beautiful valley in Arunachal Pradesh, home to the Apatani tribe and scenic landscapes.', imgSrc: 'images/ziro.jpg', isPopular: false },
      ];
      await Destination.insertMany(destinations);
      console.log('🌱 Destinations seeded successfully!');
    }
  } catch (error) {
    console.error('Error initializing destinations:', error);
  }
}
mongoose.connection.once('open', initializeDestinations);

// ====================
// Destination Routes
// ====================

// Get all destinations (optional filter by popular)
app.get('/api/destinations', async (req, res) => {
  const { type } = req.query;
  try {
    const filter = type === 'popular' ? { isPopular: true } : {};
    const destinations = await Destination.find(filter);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Get single destination
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// ====================
// User Routes (strict schema compatible)
// ====================

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', username: newUser.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================
// Message Routes
// ====================

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add message
app.post('/api/messages', async (req, res) => {
  try {
    const { username, content } = req.body;
    const newMessage = new Message({ username, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================
// Server
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
