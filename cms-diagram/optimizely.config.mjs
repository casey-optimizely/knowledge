/** @type {import('@optimizely/cms-cli').OptimizelyCmsCliConfig} */
export default {
  // Glob patterns pointing to all files that contain contentType() definitions.
  // The CLI walks these files, finds every registered content type, and syncs
  // them to your Optimizely SaaS CMS instance.
  components: ['./cms/**/*.ts'],
};
