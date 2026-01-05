const router = require('express').Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.post('/book', auth, sessionController.bookSession);
router.get('/', auth, sessionController.getSessions);
router.patch('/complete/:sessionId', auth, sessionController.completeSession);
router.patch('/cancel/:sessionId', auth, sessionController.cancelSession);

module.exports = router;
