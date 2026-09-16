---
name: GitHub publishing
description: Publishing workspace files to a completely empty GitHub repository through the connected GitHub integration.
---

When a GitHub repository is completely empty, initialize it with one starter file through the Contents API before using the Git Data API for bulk tree/commit uploads. GitHub returns 409 for ref and blob operations until the repository has an initial commit.

**Why:** GitHub's Git Data endpoints reject refs and blob creation on an empty repository, even when the repository exists and the caller has push permission.

**How to apply:** Create a starter commit from an existing project file, then create the full tree as a child commit and update the default branch without force-pushing.