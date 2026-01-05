const router = require('express').Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:otherUserId', auth, messageController.getMessages);

module.exports = router;
