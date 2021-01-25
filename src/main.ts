import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    core.info('Write something beautiful ...')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
