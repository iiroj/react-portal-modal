import '@babel/register';
import { configure } from '@storybook/react';

const requireAll = requireContext => requireContext.keys().map(requireContext);
const loadStories = () =>
  requireAll(require.context('../stories', true, /\.tsx?$/));

configure(loadStories, module);
