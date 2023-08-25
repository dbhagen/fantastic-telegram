// routes/main.js
import { Router } from 'express'
import { index, hello } from './default.js'

export { index, hello }

const router = Router()

router.get('/', index)
router.get('/hello/:name', hello)

export default router
