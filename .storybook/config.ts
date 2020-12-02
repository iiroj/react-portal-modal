import { configure } from '@storybook/react'

const req = require.context('../stories', true)

const loadStories = () => void req.keys().forEach(req)

configure(loadStories, module)
