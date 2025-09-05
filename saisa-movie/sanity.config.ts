import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SA IS A MOVIE Studio',

  projectId: 'fxocdfoz',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  // Studio configuration
  studio: {
    components: {
      // You can customize the studio appearance here
    }
  }
})
