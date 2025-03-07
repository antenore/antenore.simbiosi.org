---
title: "No-Comment: Adding GitLab Support to a Static Comments Service"
layout: post
permalink: /no-comment/
tag:
- gitlab
- jekyll
- comments
- opensource
- cloudflare
category: blog
author: antenore
description: "How I added GitLab support to No-Comment, a Cloudflare Worker-based comment system for static sites"
---

## The Quest for a Decent Comment System

For years, I've been running this Jekyll-based blog without a comment system. While this simplified things, it also meant missing out on valuable feedback and discussions. I've always been hesitant to add third-party comment services like Disqus, primarily because of privacy concerns and the external JavaScript dependencies they introduce.

The gold standard for privacy-respecting comments on static sites was Staticman, which stored comments directly in your repository as data files. Unfortunately, Staticman has been effectively abandoned (R.I.P.), leaving a gap in the ecosystem.

## Enter No-Comment

Recently, I discovered [No-Comment](https://github.com/GeoffWilliams/no-comment), a brilliant reimplementation of the Staticman concept by Geoff Williams. No-Comment is a Cloudflare Worker that accepts form submissions and creates pull requests with comment data files to your repository. It's simple, elegant, and avoids the scaling issues that plagued Staticman.

There was just one problem - it only supported GitHub repositories, while this blog (and most of my projects) use GitLab. So I did what any self-respecting open-source contributor would do - I forked the project and added GitLab support.

## The Implementation

Adding GitLab support required several changes to the codebase:

1. Creating a GitLab API implementation in `src/gitlab.ts`
2. Updating the type system to support GitLab-specific environment variables
3. Modifying the main handler to support both GitHub and GitLab providers
4. Adding configuration options in `wrangler.toml`

The most interesting part was implementing the GitLab API client. While GitHub and GitLab have similar concepts (repositories, branches, commits, merge requests), the API details differ significantly. Here's a simplified snippet of how the GitLab implementation works:

```typescript
async function createMergeRequest(
  projectId: string,
  sourceBranch: string,
  targetBranch: string,
  title: string,
  token: string
): Promise<void> {
  const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Private-Token': token
    },
    body: JSON.stringify({
      source_branch: sourceBranch,
      target_branch: targetBranch,
      title: title,
      remove_source_branch: true
    })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create merge request: ${text}`);
  }
}
```

The implementation also needed to account for GitLab's project IDs (which can be either numeric IDs or URL-encoded paths) and its slightly different approach to file operations.

## Security Enhancements

While working on the GitLab implementation, I also noticed an opportunity to improve the redirect handling. The original code accepted any URL for redirection after comment submission, which could potentially lead to open redirect vulnerabilities.

I added a `getSafeRedirectUrl` function that validates redirect URLs:

```typescript
function getSafeRedirectUrl(url: string, allowedDomains: string[]): string {
  try {
    const parsedUrl = new URL(url);
    
    // Check if the domain is in the allowlist
    if (allowedDomains.length > 0 && 
        !allowedDomains.includes(parsedUrl.hostname)) {
      return '/';
    }
    
    return url;
  } catch (e) {
    // If URL parsing fails, return the root path
    return '/';
  }
}
```

This ensures that users can only be redirected to trusted domains, preventing potential phishing attacks.

## The User Experience

With these changes in place, implementing comments on this blog was straightforward. I added a form at the bottom of each post:

```html
{% raw %}
<form method="POST" action="{{ site.no_comment_url }}" id="comment-form">
  <input name="options[redirect]" type="hidden" value="{{ site.no_comment_redirect }}">
  <input name="options[slug]" type="hidden" value="{{ page.slug }}">
  
  <label>Name <input name="fields[name]" type="text" required></label>
  <label>Email <input name="fields[email]" type="email" required></label>
  <label>Message<textarea name="fields[message]" required></textarea></label>
  
  <button type="submit">Post Comment</button>
</form>
{% endraw %}
```

This submits to my Cloudflare Worker, which creates a merge request to add the comment as a data file in my GitLab repository. After I approve and merge the request, the comment appears on the site - no JavaScript required on the client side!

## The Results

The implementation has been working flawlessly. Comments are submitted as data files, which Jekyll then renders alongside the post content:

```html
{% raw %}
{% if site.data.comments[page.slug] %}
  <h2>Comments</h2>
  <div class="comments">
    {% for comment_entry in site.data.comments[page.slug] %}
    {% assign comment = comment_entry[1] %}
      <div class="comment">
        <div class="comment-header">
          {{comment.name | strip_html}}
          <span class="comment-date">
            {{comment.date | date: "%B %d, %Y"}}
          </span>
        </div>
        <div class="comment-content">
          {{comment.message | strip_html | markdownify }}
        </div>
      </div>
    {% endfor %}
  </div>
{% endif %}
{% endraw %}
```

The beauty of this approach is its simplicity and robustness:

1. No JavaScript dependencies or third-party services on the client side
2. Comments are stored in my repository as simple data files
3. I have complete moderation control through the merge request process
4. The entire system is highly cacheable, keeping the site fast

## Open Source Contribution

I've submitted a pull request to the original No-Comment repository, which includes:

1. The GitLab implementation
2. Enhanced URL redirect security
3. Improved documentation

The PR is currently awaiting review, but in the meantime, you can find my fork at [github.com/antenore/no-comment](https://github.com/antenore/no-comment).

## Setting Up Your Own Instance

If you're interested in setting up No-Comment for your own static site:

1. Fork [No-Comment](https://github.com/GeoffWilliams/no-comment) (or use [my fork](https://github.com/antenore/no-comment) if you need GitLab support)
2. Deploy to Cloudflare Workers using Wrangler
3. Configure environment variables for GitHub or GitLab authentication
4. Add the comment form to your site templates
5. Configure your site to render comment data files

The full setup instructions are available in the repository README.

## Conclusion

Adding comment functionality to a static site doesn't have to mean compromising on privacy, performance, or control. By extending No-Comment to support GitLab, I now have a simple, robust comment system that respects user privacy and keeps content under my control.

If you're using a static site generator like Jekyll, Hugo, or 11ty with GitLab for hosting, give No-Comment a try. And if you're already using it with GitHub, the changes in my fork are fully backward compatible.

Happy commenting!