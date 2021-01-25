import { promises as fsp } from 'fs'
import path from 'path'

import * as core from '@actions/core'
import * as github from '@actions/github'

import { GitHub as OctokitInstance } from '@actions/github/lib/utils'

import Config from './config'
import { Label } from './interfaces'

/* eslint-disable @typescript-eslint/no-explicit-any */
type GraphQlVariables = Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */

type Octokit = InstanceType<typeof OctokitInstance>

interface MutationCreateLabelData {
  createLabel: {
    label: {
      name: string
    }
  }
}

interface QueryMatchingLabelsData {
  repository: {
    id: string
    labels: {
      nodes: Label[]
    }
  }
}

async function executeGraphql<T>(
  octokit: Octokit,
  filename: string,
  variables: GraphQlVariables
): Promise<T> {
  const graphql = await graphqlText(filename)

  return await octokit.graphql(graphql, variables)
}

async function graphqlText(filename: string): Promise<string> {
  const filepath = path.join(__dirname, 'graphql', `${filename}.graphql`)
  const text = (await fsp.readFile(filepath, { encoding: 'utf8' })).toString()

  return text
}

export default class GitHub {
  config: Config
  octokit: Octokit

  constructor(config: Config) {
    this.config = config
    this.octokit = github.getOctokit(this.config.token, {
      userAgent: 'lee-dohm/no-response',
      accept: 'application/vnd.github.bane-preview+json'
    })
  }

  async ensureLabelExists(label: Label): Promise<void> {
    const { exists, repoId } = await this.checkLabel(label)

    if (!exists) {
      await this.createLabel(label, repoId)
    }
  }

  async checkLabel(label: Label): Promise<{ exists: boolean; repoId: string }> {
    const queryResults = await executeGraphql<QueryMatchingLabelsData>(
      this.octokit,
      'query-matching-labels',
      {
        ...this.config.repo,
        q: label.name
      }
    )

    const repoId = queryResults.repository.id

    const exists = queryResults.repository.labels.nodes
      .map((l: Label) => {
        return l.name
      })
      .includes(label.name)

    return { exists, repoId }
  }

  async createLabel(label: Label, repoId: string): Promise<void> {
    const mutationResults = await executeGraphql<MutationCreateLabelData>(
      this.octokit,
      'mutation-create-label',
      {
        ...label,
        repositoryId: repoId
      }
    )

    if (mutationResults.createLabel.label.name !== label.name) {
      throw new Error(`Could not create label: ${label.name}`)
    }
  }
}
