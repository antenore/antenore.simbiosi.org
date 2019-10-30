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

* Print files modified some days ago

{% highlight sh %}
$ ls -tld *(m+100)
-rw-rw-r-- 1 antenore antenore   117 Jun 16  2018 _config-dev.yml
-rw-rw-r-- 1 antenore antenore   212 Jun 16  2018 Rakefile
drwxrwxr-x 5 antenore antenore  4096 Jun 16  2018 _sass
drwxrwxr-x 2 antenore antenore  4096 Jun 12  2018 blog
-rwxrwxr-x 1 antenore antenore    33 Jun 12  2018 index.html
-rw-rw-r-- 1 antenore antenore   603 Jun 12  2018 projects.html
-rw-rw-r-- 1 antenore antenore    24 Jun 12  2018 robots.txt
-rw-rw-r-- 1 antenore antenore  1451 Jun 12  2018 tags.html
-rw-rw-r-- 1 antenore antenore   144 Jun 12  2018 travis.sh
drwxrwxr-x 3 antenore antenore  4096 Jun 12  2018 assets
-rw-rw-r-- 1 antenore antenore 34466 Jun 12  2018 LICENSE
-rwxrwxr-x 1 antenore antenore     1 Jun 12  2018 README.md
-rw-rw-r-- 1 antenore antenore   722 Jun 12  2018 FAQ.md
{% endhighlight %}

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

On Bash you are quite on your own to configure your environment, on the contrary, if not deactivated by the OS distributor, or by your system administrator, in Zsh there's a function that is called if you don't have the rc files in your home (i.e. .zshrc).

The function, zsh-newuser-install, will interactively help you to setup most of the default behaviour.
It can be called by hand if it has been disabled or if you wish to start from scratch:

{% highlight sh %}
$ autoload -Uz zsh-newuser-install
$ zsh-newuser-install -f
Please pick one of the following options:

(1)  Configure settings for history, i.e. command lines remembered
     and saved by the shell.  (Recommended.)

(2)  Configure the new completion system.  (Recommended.)

(3)  Configure how keys behave when editing command lines.  (Recommended.)

(4)  Pick some of the more common shell options.  These are simple "on"
     or "off" switches controlling the shell's features.

(0)  Exit, leaving the existing ~/.zshrc alone.

(a)  Abort all settings and start from scratch.  Note this will overwrite
     any settings from zsh-newuser-install already in the startup file.
     It will not alter any of your other settings, however.

(q)  Quit and do nothing else.
--- Type one of the keys in parentheses ---
{% endhighlight %}

This method is easier than setting everything by hand, but still a hurdle for those that do not know yet the basic Zsh builtin and functions.

To alleviate the problem there are some different framework that hide all the difficulties and easy the setup.
The one I use and know is [Oh My Zsh](https://ohmyz.sh), it features a quite huge quantity of plugins, themes and functions, and, most importantly, it's very easy to setup.

Just follow the installation instructions on their site, but do not forgot, afterwards, to read `man zshall` ;-)

## Resources

* [ZSH-LOVERS](https://grml.org/zsh/zsh-lovers.html)
* [Primary site](http://www.zsh.org/)
* [Project-page](http://sourceforge.net/projects/zsh/)
* [Z shell page at sunsite.dk](http://zsh.sunsite.dk/)
* [From Bash to Z Shell: Conquering the Command Line - the book](http://www.bash2zsh.com/)
* [Mailinglistarchive](http://www.zsh.org/mla/)
* [ZSH-FAQ](http://zsh.dotsrc.org/FAQ/)
* [Userguide](http://zsh.sunsite.dk/Guide/)
* [ZSH-Wiki](http://zshwiki.org/home/)
* [A short introduction from BYU](http://docs.cs.byu.edu/linux/advanced/zsh.html)
* [Mouse-Support ;)](http://stchaz.free.fr/mouse.zsh)
* [Curtains up: introducing the Z shell](http://www-128.ibm.com/developerworks/linux/library/l-z.html?dwzone=linux)
* [ZSH Prompt introduction](http://aperiodic.net/phil/prompt/)
* [ft’s zsh configuration](http://ft.bewatermyfriend.org/comp/zsh.html)
* [Adam’s ZSH page](http://www.adamspiers.org/computing/zsh/)
* [Zzappers Best of ZSH Tips](http://www.rayninfo.co.uk/tips/zshtips.html)
* [Zsh Webpage by Christian Schneider](http://www.strcat.de/zsh/)
* [The zsh-lovers webpage](http://grml.org/zsh/)
* [IRC channel](#zsh at irc.freenode.org)
* [The Z shell reference-card (included in the zsh-lovers debian-package)](http://www.bash2zsh.com/zsh_refcard/refcard.pdf)

## Disclaimer

Some of the content has been taken form [Wikipedia](https://en.wikipedia.org).

























