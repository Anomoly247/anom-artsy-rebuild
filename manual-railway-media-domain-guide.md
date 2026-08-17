# Manual Railway, Media, and Domain Guide

## 1. Deploy commit b99afa2 manually

Open the existing Railway production service `anom-universe-production` and select the `production` environment. Do not change DNS or variables first.

In **Settings → Source**, confirm the current source. It must be:

```text
Repository: Anomoly247/anom-artsy-rebuild
Branch: main
Commit: b99afa2
Auto deploy: enabled
```

The screenshot previously showed `Anomoly247/anom-artsy-replicate`; that is the source mismatch that prevents commits from `anom-artsy-rebuild` from reaching production. Use the repository edit control, select `Anomoly247/anom-artsy-rebuild`, choose `main`, and save. If Railway offers a root directory, leave it at the repository root unless the service’s build settings explicitly require `app/`.

Open **Deployments**, select the deployment for commit `b99afa2`, and choose **Redeploy** or **Deploy latest**. Wait for the build and health checks to finish. Do not remove the existing service or database.

After deployment, confirm:

```text
https://universe.anomartsy.xyz/
https://universe.anomartsy.xyz/admin
https://universe.anomartsy.xyz/api/auth/google
```

The homepage must still be the approved AO homepage, `/admin` must load its protected shell, and the OAuth endpoint must begin the provider redirect. View the homepage source or response and confirm the analytics placeholder is gone.

## 2. Add the first Anom’s Corner asset

The first localized asset is:

```text
app/client/public/media/anoms-corner/moonberry-1920x1080.webp
```

It originated from the reviewed Moonberry Farm loading pack and has checksum:

```text
sha256:8fe4db7f839bf0418de5af3cf174be6eed7d098407072ebb57ed742abe42b606
```

The additive manifest record is in:

```text
app/client/src/data/aoMediaManifest.ts
```

The record maps the asset to `worlds/pixel-dot/spaces/anoms-corner/` and `/moonberry-farm`, identifies Anom Originals as the author, and keeps `guardianStatus` as `pending`. That pending state is intentional until the review decision is recorded through the protected Guardian workflow.

The review sequence is:

1. Open the local asset review surface and confirm the image matches the authored Moonberry Farm artwork.
2. Confirm there are no visible people, private documents, or third-party marks.
3. Confirm the source ID, checksum, route, local path, caption, privacy state, and authorship fields.
4. Approve the record in the Guardian panel only after the owner review is complete.
5. Render it through a review-gated media component. Pending or rejected records must not render publicly.
6. Re-run the route, keyboard, contrast, mobile, and production build checks.

## 3. Configure anomartsy.lol as a separate Railway domain

Keep `anomartsy.xyz` and `universe.anomartsy.xyz` unchanged. Use `anomartsy.lol` as a separate preview or alternate production hostname only after the existing service is stable.

In Railway, open the same service’s **Networking** section and choose **Add Custom Domain**. Enter:

```text
anomartsy.lol
```

Railway will display the exact DNS target for the service. Do not guess the target from another project. Copy the target exactly.

Because `anomartsy.lol` currently does not resolve publicly, add the record in the Manus domain manager:

- For a subdomain, create a CNAME using Railway’s displayed target.
- For the apex domain, use the registrar’s ALIAS/ANAME/apex-CNAME option if available, or follow the exact Railway apex instructions.
- Do not create a second conflicting A, AAAA, or CNAME record.
- Leave existing `anomartsy.xyz` records untouched.

Wait for DNS propagation and Railway certificate issuance. Then verify:

```text
https://anomartsy.lol/
https://anomartsy.lol/anoms-corner
https://anomartsy.lol/admin
```

Use the `.lol` hostname for preview validation first. Only designate it as an additional production domain after the homepage, OAuth callback URL, cookies, custom-domain certificate, and route smoke checks all pass. If it becomes an OAuth origin, add the exact `.lol` callback URL to the provider configuration; do not replace the existing `.xyz` callback until the alternate domain is proven stable.
