---
title: "Z shell vs Bash: Which Shell Reigns Supreme?"
description: "A practical comparison between Z shell (Zsh) and Bash - discover why you might want to switch"
layout: post
author: antenore
permalink: /zsh-vs-bash/
date: 2019-10-26 12:00:00 +0100
last_modified_at: 2025-03-14 12:00:00 +0100
category: blog
tags:
  - shell
  - Zsh
  - bash
  - unix
---

## TL;DR: Why Zsh Might Be Your Next Shell

The [Z shell](https://en.wikipedia.org/wiki/Z_shell) (Zsh) offers several compelling advantages over the traditional [Bourne-again shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) (Bash):

- **Smart autocompletion** for commands, options, and arguments
- **Shared command history** across all running shells
- **Advanced file globbing** without needing external programs like `find`
- **Floating-point arithmetic** support (Bash only handles integers)
- **Spelling correction** for mistyped commands
- **Themeable prompts** with right-side information that auto-hides
- **Named directories** for custom shortcuts like `~mydir`

> 💡 **Pro tip:** For scripting that needs to be portable, stick with POSIX-compliant syntax. Zsh supports all Bash functionality, so your Bash scripts will work without modification.

## A Tale of Two Shells

Some years ago, I switched from Bash to Zsh. At first, I felt lost - just as anyone would when leaving behind years of customized configurations, aliases, and functions. In my search for a quick setup, I discovered [Oh My Zsh](https://ohmyz.sh/), an open source framework that made the transition painless with its pre-built themes and plugins.

### Feature Comparison

| Feature | Zsh | Bash |
|---------|-----|------|
| **First Released** | 1990 | 1989 |
| **Default Shell On** | macOS 10.15+, Deepin, GoboLinux | Most Linux distros, macOS 10.3–10.14 |
| **License** | MIT-style | GPL |
| **Configurability** | Extensive (variables, options, functions, styles) | Basic (variables and options) |
| **Floating Point Math** | ✅ Yes | ❌ No |
| **Auto-correction** | ✅ Yes | ❌ No |
| **Syntax Highlighting** | ✅ Via extensions | ❌ No |

## Zsh in Action

### Smart Completions and Corrections

The following animation demonstrates Zsh's intelligent completion and auto-correction capabilities:

![Zsh auto-suggestions in action](/assets/images/svg/zsh-auto-suggestion.svg)

### Powerful Globbing

Find all Sass files recursively with a simple pattern:

```sh
$ echo **/*\.sass
_sass/base/general.sass _sass/base/helpers.sass _sass/base/syntax.sass _sass/base/variables.sass _sass/components/author.sass _sass/components/disqus.sass _sass/components/footer.sass _sass/components/header.sass _sass/components/nav.sass _sass/components/others.sass _sass/components/pagination.sass _sass/components/related.sass _sass/components/share.sass _sass/components/side-by-side.sass _sass/components/social-links.sass _sass/components/spoiler.sass _sass/pages/home-blog-projects.sass _sass/pages/page.sass _sass/pages/post.sass _sass/pages/tags.sass
```

### Suffix Aliases

Open files directly with associated applications:

```sh
$ alias -s markdown=vim
$ ./_posts/2018-06-14-vim-safe.markdown
# Opens the markdown file directly in vim
```

### Advanced File Filtering

Find files modified more than 100 days ago:

```sh
$ ls -tld *(m+100)
-rw-rw-r-- 1 antenore antenore   117 Jun 16  2018 _config-dev.yml
-rw-rw-r-- 1 antenore antenore   212 Jun 16  2018 Rakefile
# ... more files
```

### Floating-Point Arithmetic

Unlike Bash, Zsh handles floating-point calculations natively:

```sh
$ echo $((0.5 / 0.2))
2.5
```

## Getting Started with Zsh

The easiest way to dive into Zsh is with [Oh My Zsh](https://ohmyz.sh). It provides a rich collection of plugins, themes, and functions with minimal setup effort:

1. Install Zsh (if not already installed)
2. Install Oh My Zsh with their one-line installer
3. Explore the included themes and plugins

> 🔍 **Tip:** After setting up Oh My Zsh, take some time to read `man zshall` to discover Zsh's full potential.

## Essential Resources

### Documentation
- [ZSH-LOVERS Guide](https://grml.org/zsh/zsh-lovers.html) - Comprehensive tips and tricks
- [Official Zsh Website](http://www.zsh.org/) - Primary documentation
- [ZSH-FAQ](http://zsh.dotsrc.org/FAQ/) - Answers to common questions

### Learning
- [From Bash to Z Shell: Conquering the Command Line](http://www.bash2zsh.com/) - Definitive book
- [Zsh Reference Card](http://www.bash2zsh.com/zsh_refcard/refcard.pdf) - Quick reference guide
- [Curtains Up: Introducing the Z Shell](http://www-128.ibm.com/developerworks/linux/library/l-z.html) - IBM's introduction

### Community
- [ZSH-Wiki](http://zshwiki.org/home/) - Community-maintained wiki
- IRC: #zsh at irc.freenode.org - Get help in real-time

## Your Turn

Have you made the switch to Zsh? Share your favorite features or custom configurations in the comments below!

---

*Some content adapted from [Wikipedia](https://en.wikipedia.org).*