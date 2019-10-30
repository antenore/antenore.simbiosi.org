---
title: "Z shell vs Bash"
description: "A comparison between Z shell (Zsh) and Bash"
layout: post
date: 2019-10-26 16:00
author: antenore
permalink: /zsh-vs-bash/
category: blog
tags:
  - shell
  - Zsh
  - bash
  - unix
---

This article is meant to show the main differences and advantages of the [Z shell](en.wikipedia.org/wiki/Z_shell)(Zsh) over the [Bourne-again shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell))(aka Bash).

For the inpatients, the main advantages of using Zsh are:

- Programmable command-line completion that can help the user type both options and arguments for most used commands, with out-of-the-box support for several hundred commands
- Sharing of command history among all running shells
- Extended file globbing allows file specification without needing to run an external program such as find
- Improved variable/array handling
- Editing of multi-line commands in a single buffer
- Spelling correction
- Various compatibility modes, e.g. Zsh can pretend to be a Bourne shell when run as /bin/sh
- Themeable prompts, including the ability to put prompt information on the right side of the screen and have it auto-hide when typing a long command
- Loadable modules, providing among other things: full TCP and Unix domain socket controls, an FTP client, and extended math functions.
- The built-in where command. Works like the which command but shows all locations of the target command in the directories specified in $PATH rather than only the one that will be used.
- Named directories. This allows the user to set up shortcuts such as ~mydir, which then behave the way ~ and ~user do.

These apply only to the interactive shell, when writing scripts or programs in shell scripting, except if you won't care about portability, it's better to conform to the POSIX standard.

Zsh comes with a builtin compiler (zcompile) with which is possible to compile scripts or functions. The advantage of having a compiled version of a script or function is mainly speed. It support floating point calculations (Bash not) and has a reach math function library.

Finally Zsh support all the functionalities of Bash, so you can reuse any Bash script without changing anything.

## An in-depth view

Some years ago, moved by an impelling need for change, I started using the Z shell. Coming from Bash and the [KornShell](https://en.wikipedia.org/wiki/KornShell)(ksh), I was at first quite lost, lost as you would be if you start using a vanilla bash without any prompt customization, aliases, colors, custom functions and so forth. In my quest to find quickly the bit of information to setup Zsh for my needs, I discovered [Oh My Zsh](https://ohmyz.sh/), an open source framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins and themes. Easy Peasy, I got my Zsh setup in a lightning bolt and forgot about my good intentions of learning the deepest secrets and niceties of Zsh. I'll come back to Oh My Zsh later, but keep in mind that using a framework, while it's extremely useful, it'll hide all the subtle and interesting details.

### General characteristics

|                          | Zsh                                                              | Bash                                                              |
| ------------------------ | ---                                                              | ----                                                              |
| Usual environment        | POSIX                                                            | POSIX                                                             |
| Usually invoked          | zsh                                                              | bash, sh                                                          |
| Introduced               | 1990                                                             | 1989                                                              |
| Platform-independent     | Yes                                                              | Yes                                                               |
| Default login shell in   | Deepin, GoboLinux, Grml, macOS 10.15+                            | GNU, Linux (default for root), macOS 10.3–10.14                   |
| Default script shell in  | Grml, macOS 10.15+                                               | GNU, Linux, Haiku, macOS 10.3–10.14                               |
| License                  | MIT-style                                                        | GPL                                                               |
| Mouse support            | via additional code                                              | No                                                                |
| Configurability          | Yes (via variables, options, functions, styles, etc.)            | Yes (via variables and options)                                   |
| Startup/shutdown scripts | Yes (system and user's zshenv, zprofile, zshrc, zlogin, zlogout) | Yes (/etc/profile, .bash_profile, .bash_login, .profile, .bashrc) |

As highlighted in the above table, with an additional plugin, Zsh has mouse support for basic actions, like text selection, copy and pasting. Functionality that usually is provided by the terminal itself.

### Interactive features

|                                              | Zsh                                  | Bash         |
| ------------------------                     | ---                                  | ----         |
| Command name completion                      | Yes                                  | Yes          |
| Path completion                              | Yes                                  | Yes          |
| Command argument completion                  | when defined                         | when defined |
| Wildcard completion                          | Yes                                  | Yes          |
| Command history                              | Yes                                  | Yes          |
| Automatic suggestions                        | Yes (via predict-on or user-defined) | No           |
| Colored directory listings                   | Yes                                  | Yes          |
| Text highlighting                            | Yes                                  | Yes          |
| Syntax highlighting                          | Third-party extension                | No           |
| Directory history, stack or similar features | Yes                                  | Yes          |
| Implicit directory change                    | optional                             | optional     |
| Auto­correction                              | Yes                                  | No           |
| Snippets                                     | when defined (as ZLE widgets)        | No           |
| Value prompt                                 | Yes                                  | Yes          |
| Menu/options prompt                          | Yes                                  | Yes          |
| Context sensitive help                       | Yes                                  | No           |

In the following terminal recording (made with [termtosvg](https://nbedos.github.io/termtosvg/)) you can see some of the main advantages of the Zsh completions and auto-corrections functionalities.

![](/assets/images/zsh-auto-suggestion.svg)

While with additional plugins and scripts you can obtain almost the same functionalities with bash, Zsh provides these out-of-the-box.

#### Some examples

* Recursive globbing

{% highlight sh %}
$ echo **/*\.sass
_sass/base/general.sass _sass/base/helpers.sass _sass/base/syntax.sass _sass/base/variables.sass _sass/components/author.sass _sass/components/disqus.sass _sass/components/footer.sass _sass/components/header.sass _sass/components/nav.sass _sass/components/others.sass _sass/components/pagination.sass _sass/components/related.sass _sass/components/share.sass _sass/components/side-by-side.sass _sass/components/social-links.sass _sass/components/spoiler.sass _sass/pages/home-blog-projects.sass _sass/pages/page.sass _sass/pages/post.sass _sass/pages/tags.sass
{% endhighlight %}

* Suffix aliases

{% highlight sh %}
$ alias -s markdown=vim
$ ./_posts/2018-06-14-vim-safe.markdown
{% endhighlight %}

When "executing" a .markdown file, it will be opened directly with vim.


### Programming

|                                            | Zsh                                | Bash                   |
| ------------------------                   | ---                                | ----                   |
| Functions                                  | Yes                                | Yes                    |
| Exception handling                         | Yes                                | Yes (via trap)         |
| Search & replace on variable substitutions | Yes (via ${:s//} and ${//} syntax) | Yes (via ${//} syntax) |
| Arithmetic                                 | Yes                                | Yes                    |
| Floating point                             | Yes                                | No                     |
| Math function library                      | Yes (zsh/mathfunc module)          | No                     |
| Linear arrays or lists                     | Yes                                | Yes                    |
| Associative arrays                         | Yes                                | Yes                    |
| eval function                              | Yes                                | Yes                    |
| Pseudo­random number generation            | Yes ($RANDOM)                      | Yes ($RANDOM)          |
| Bytecode                                   | Yes (built-in zcompile command)    | No                     |

As said, from a programming point of view, Bash and Zsh are quite the same, the most interesting difference are the math functions and the floating point support in Zsh.

{% highlight sh %}
# Zsh
$ echo $((0.5 / 0.2))
2.5
{% endhighlight %}

{% highlight sh %}
# Zsh
bash-5.0$ echo $((0.5 / 0.2))
bash: 0.5 / 0.2: syntax error: invalid arithmetic operator (error token is ".5 / 0.2")
bash-5.0$ echo $((5 / 2))
2
{% endhighlight %}

{% highlight sh %}
$ zcalc -e "sqrt(2)"
1.41421
{% endhighlight %}

{% highlight sh %}
$ print $(( [#_] sqrt(1e7) ))
3_162.277_660_168_379_5
{% endhighlight %}

## Setting up Zsh



## Disclaimer

Some of the content has been taken form [Wikipedia](https://en.wikipedia.org).

























