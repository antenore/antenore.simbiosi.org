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

Some years ago, moved by an impelling need for change, I started to use the [Z shell](en.wikipedia.org/wiki/Z_shell)(Zsh). Coming from the [Bourne-again shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell))(aka bash) and the [KornShell](https://en.wikipedia.org/wiki/KornShell)(ksh), I was at first quite lost, lost as you would be if you start using a vanilla bash without any prompt customization, aliases, colors, custom functions and so forth. In my quest to find quickly the bit of information to setup Zsh for my needs, I discovered [Oh My Zsh](https://ohmyz.sh/), an open source framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins and themes. Easy Peasy, I got my Zsh setup in a lightning bolt and forgot about my good intentions of learning the deepest secrets and niceties of Zsh. I'll come back to Oh My Zsh later, but keep in mind that using a framework, while it's extremely useful, it'll hide all the subtle and interesting details.

This article is meant to show the main differences and advantages of the Z shell over the Bourne-again shell.

## General characteristics

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

Contrary to what many people think, the Z shell is as old as Bash, notable features, not available (by default) in Bash, are:

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

As highlighted in the below table, with an additional plugin, Zsh has mouse support for basic actions, like text selection, copy and pasting. Functionality that usually is provided by the terminal itself.

## Interactive features


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

In the following terminal recording (made with [termtosvg](https://nbedos.github.io/termtosvg/) you can see some of the main advantages of the Zsh completions and auto-corrections functionalities.

![](/assets/images/zsh-auto-suggestion.svg)

While with additional plugins and scripts you can obtain almost the same functionalities with bash, Zsh provides these out of the box.
