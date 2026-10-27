# Archery Test: local reference integration

Publication update: on 27 October 2026 the project owner confirmed permission to publish these game files on GitHub Pages. Earlier local-only statements below record the original integration scope.

Original game: Archery Master, SUN.STUDIO. Source: https://www.crazygames.com/game/archery-master . Observed build path /archery-master/9/, page release identifier 65; no semantic version is inferred.

Native code, artwork, models, animation, music/sound and original names retain their owners' rights. No redistribution license has been supplied. The native resource files and vendor bundles are ignored by Git and retained only for the requested local integration. Do not publish these files or imply endorsement.

The original game.bundle.js, engine.bundle.js and vendors.bundle.js remain unchanged. Authored index/local-platform files provide a local platform interface, account-and-game save namespaces, lifecycle, audio and portrait viewport configuration. Local player identity is a device-only identifier, not a platform account. Ad rewards, online challenges, purchases, sharing and leaderboards are unavailable; no rewarded impression is fabricated. Native local level/equipment progression is game-owned.

The manifest records file identity and one explicit rendering fallback: EnvironmentA's original 1024 terrain is missing at the source, so the exact available 512 terrain is used for that path. No gameplay logic or level record is substituted. The original numbered level table contains 1,000 records; a full playthrough of all records is not claimed.
