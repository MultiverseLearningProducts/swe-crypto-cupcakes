# SWE Crypto Cupcakes

Welcome to SWE Crypto Cupcakes! The feature branches in this repo represent the evolution of a sample app. Each week we can demo a new branch, look at what has changed and why:

1. `cupcakes-api`
2. `security`
3. `jwt`
4. `oauth`

The `main` branch is the same as the finished `oauth` project branch after the 4 weeks of delivery, so get started at the first branch to see the app from the very beginning.

This branch adds a very basic mocking to the 'oauth' branch.

The mocked oauth requiresAuth() middleware passes HTTP requests as authorized. This mocking is suitable for testing how the APIs work, but it is not suitable for testing the Unauthorized pathway.

If we were to add creator/owner security to crypto cupcakes, we would also need to update requiresAuth to set the req.user in order to test APIs that behave differently depending on the user.
