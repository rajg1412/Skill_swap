const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('./models/Skill');

dotenv.config();

const skills = [
    {
        name: 'Web Development',
        category: 'Technology',
        description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.'
    },
    {
        name: 'Python Programming',
        category: 'Technology',
        description: 'Master Python for data science, automation, and web development.'
    },
    {
        name: 'Graphic Design',
        category: 'Design',
        description: 'Learn to use Adobe Photoshop and Illustrator to create stunning visuals.'
    },
    {
        name: 'Digital Marketing',
        category: 'Business',
        description: 'Understand SEO, social media marketing, and content strategy.'
    },
    {
        name: 'Guitar for Beginners',
        category: 'Music',
        description: 'Start your musical journey by learning basic chords and strumming patterns.'
    },
    {
        name: 'Cooking - Italian Cuisine',
        category: 'Lifestyle',
        description: 'Master the art of making fresh pasta and authentic Italian sauces.'
    },
    {
        name: 'Photography Basics',
        category: 'Photography',
        description: 'Learn about exposure, composition, and lighting to take better photos.'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillswap');
        console.log('Connected to MongoDB');

        // Clear existing skills
        await Skill.deleteMany({});
        console.log('Cleared existing skills');

        // Add new skills
        await Skill.insertMany(skills);
        console.log('Database seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
