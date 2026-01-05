const Skill = require('../models/Skill');

exports.createSkill = async (req, res) => {
    try {
        const { name, category, description } = req.body;
        const newSkill = new Skill({ name, category, description });
        const savedSkill = await newSkill.save();
        res.json(savedSkill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
