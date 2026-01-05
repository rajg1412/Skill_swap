const Session = require('../models/Session');
const User = require('../models/User');

exports.bookSession = async (req, res) => {
    try {
        const { teacherId, skill, scheduledTime } = req.body;
        const learnerId = req.user;

        // Check if learner has enough credits
        const learner = await User.findById(learnerId);
        if (learner.credits < 1) {
            return res.status(400).json({ message: 'Insufficient credits to book a session.' });
        }

        const newSession = new Session({
            teacher: teacherId,
            learner: learnerId,
            skill,
            scheduledTime,
            status: 'pending'
        });

        const savedSession = await newSession.save();

        // Deduct credit from learner
        learner.credits -= 1;
        await learner.save();

        res.json(savedSession);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ teacher: req.user }, { learner: req.user }]
        }).populate('teacher learner', 'name email');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);

        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.status === 'completed') return res.status(400).json({ message: 'Session already completed' });

        session.status = 'completed';
        await session.save();

        // Award credit to teacher
        const teacher = await User.findById(session.teacher);
        teacher.credits += 1;
        await teacher.save();

        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.cancelSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);

        if (!session) return res.status(404).json({ message: 'Session not found' });

        session.status = 'cancelled';
        await session.save();

        // Refund credit to learner
        const learner = await User.findById(session.learner);
        learner.credits += 1;
        await learner.save();

        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
