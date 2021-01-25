import * as core from '@actions/core'

import Config from '../src/config'

describe('Config', () => {
  describe('constructor', () => {
    beforeEach(() => {
      process.env['INPUT_TOKEN'] = '123456789abcdef'
      process.env['GITHUB_REPOSITORY'] = 'test-owner/test-repo'
    })

    it('initializes closeComment to input value', () => {
      process.env['INPUT_CLOSECOMMENT'] = 'foo'
      const config = new Config()

      expect(config.closeComment).toEqual('foo')
    })

    it('initializes closeComment as undefined if "false" is passed in as input', () => {
      process.env['INPUT_CLOSECOMMENT'] = 'false'
      const config = new Config()

      expect(config.closeComment).toBeUndefined()
    })

    it('initializes closeComment with the default otherwise', () => {
      delete process.env.INPUT_CLOSECOMMENT
      const config = new Config()

      expect(config.closeComment).toContain('Thanks for your submission.')
    })

    it('initializes repo with the repository information', () => {
      const config = new Config()

      expect(config.repo.owner).toEqual('test-owner')
      expect(config.repo.repo).toEqual('test-repo')
    })

    it('initializes labelColor with the value of the input', () => {
      process.env['INPUT_LABELCOLOR'] = '000000'
      const config = new Config()

      expect(config.labelColor).toEqual('000000')
    })

    it('initializes labelColor with the default otherwise', () => {
      delete process.env.INPUT_LABELCOLOR
      const config = new Config()

      expect(config.labelColor).toEqual('e6e6e6')
    })

    it('initializes labelName with the value of the input', () => {
      process.env['INPUT_LABELNAME'] = 'label-name'
      const config = new Config()

      expect(config.labelName).toEqual('label-name')
    })

    it('initializes labelName with the default otherwise', () => {
      delete process.env.INPUT_LABELNAME
      const config = new Config()

      expect(config.labelName).toEqual('invalid')
    })

    it('initializes token with the value of the input', () => {
      const config = new Config()

      expect(config.token).toEqual('123456789abcdef')
    })

    it('raises an error if no token is given', () => {
      delete process.env.INPUT_TOKEN

      expect(() => {
        new Config()
      }).toThrow()
    })
  })
})
