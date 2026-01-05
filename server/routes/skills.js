const router = require('express').Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');

router.post('/', auth, skillController.createSkill);
router.get('/', skillController.getSkills);

module.exports = router;
