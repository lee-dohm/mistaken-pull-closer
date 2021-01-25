# Mistaken Pull Closer

An action to automatically close PRs that were opened by people without push access who use a branch that pre-exists in the repository itself.

## What PRs does this app close?

This Probot app closes PRs where **all** of the following are true:

- Created using a branch that exists in the repo, not a fork
- Created by someone who does not have push access to the repo
- Not created by an app or bot

Because the PR author doesn't have push access to the branch the PR is built on, they can't even submit changes to their own PR. This is why it is generally considered to be a mistake.

GitHub recently added a feature where it will not allow PRs like the above to be created if and only if the PR body is empty. For repositories using PR templates, this is never the case, hence the continuing need for this app.

## License

[MIT](LICENSE.md)
