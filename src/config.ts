import * as core from '@actions/core'
import * as github from '@actions/github'

const defaultCloseComment = `
Thanks for your submission.

It appears that you've created a pull request using one of our repository's branches. Since this is
almost always a mistake, we're going to go ahead and close this. If it was intentional, please
let us know what you were intending and we can see about reopening it.

Thanks again!
`

interface Repo {
  owner: string
  repo: string
}

/**
 * Reads, interprets, and encapsulates the configuration for the current run of the Action.
 */
export default class Config {
  closeComment: string | undefined

  labelColor: string | undefined

  labelName: string

  /** Repository to operate on. */
  repo: Repo

  /** GitHub token to use when performing API operations. */
  token: string

  constructor() {
    this.closeComment = this.valueOrDefault(core.getInput('closeComment'), defaultCloseComment)

    if (this.closeComment === 'false') {
      this.closeComment = undefined
    }

    this.labelColor = this.valueOrDefault(core.getInput('labelColor'), 'e6e6e6')

    this.labelName = this.valueOrDefault(core.getInput('labelName'), 'invalid')

    this.repo = github.context.repo

    this.token = core.getInput('token', { required: true })
  }

  valueOrDefault(value: string, defaultValue: string): string {
    return value !== '' ? value : defaultValue
  }
}
