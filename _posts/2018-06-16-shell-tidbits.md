---
title: "Shell tidbits"
layout: post
image: /assets/images/shell-symbolic.svg
headerImage: true
tags:
- shell
- unix
category: blog
author: antenore
description: "Less unknown shell tricks"
---

## Summary:

This is the first of a long (maybe) series of blog posts with some less known shell
features. Unless otherwise specified, bash is the shell of reference.

#### Index
- [Poorman encryption](#poorman-encryption)
- [Redefine a command](#redefine-a-command)
- [Variable is defined](#variable-is-defined)
- [Poorman basename](#poorman-basename)
- [Poorman dirname](#poorman-dirname)

## Poorman encryption

Calling this encryption is a bit unpolite, but let's do it, we don't care right?

From [wikipedia](https://en.wikipedia.org/wiki/ROT13):

    ROT13 ("rotate by 13 places", sometimes hyphenated ROT-13) is a simple letter substitution cipher
    that replaces a letter with the 13th letter after it, in the alphabet.

I use this, sometimes, just to make things a bit arcane for those n00bs not looking
enough far, and to pass sensible, obfuscated data from one script to another.

To ROT13 a string we can use tr (translate or delete characters), so I wrote a simple
function that take a string as input and output its ROT13 permutation.

{% highlight sh %}
rot13 () {
        [[ $# -eq 0 ]] && return
        tr a-zA-Z n-za-mN-ZA-M
}	# ----------  end of function rot13  ----------
{% endhighlight %}

For example, let's ROT13 and back an "Hello World"

    [tmow@Ade ~]$ echo "$(rot13 "Hello World")"
    Uryyb Jbeyq
    [tmow@Ade ~]$ echo "$(rot13 "Uryyb Jbeyq")"
    Hello World
    [tmow@Ade ~]$

Don't use this to store passwords as it's not safe at all (exept against idiots).

## Redefine a command

What if you need to execute a script on different unixes with different implementations of, let's say, awk and sed?

Aliases cannot be easily used inside a script, so often people set an *AWK* and *SED* variable and than use that varbiale inside the script, instead of calling
directly the awk/sed variant.

I really don't like "executing" variables and I don't like to ignore [shellcheck](https://www.shellcheck.net/) exceptions.

So, the most elegant way I've found is to redefine a command with a function.

{% highlight sh %}
case "$(uname -s)" in
    SunOS)
        awk () {
            # Add some code here to log somewhere that you are using nawk for
            # debugging purpose
            /usr/bin/nawk "$@"
        }
        # in bash we can export a function with -f
        export -f awk
        ;;
    *)
        ;;
esac
{% endhighlight %}

Functions are interepted before programs in the PATH environment variable, therefore
if you are on SunOS, when you will call awk, bash will call the function awk and not the awk command.

## Variable is defined

Since bash v4.2, we can test if a variable is set with

{% highlight sh %}
[[ -v VARNAME ]]
{% endhighlight %}

Before these days and on Unices where bash >4.2 it's a dream, we can use typeset (or declare).

{% highlight sh %}
typeset -p VARNAME
{% endhighlight %}

I normally use this in a function that I use every time I need to test if a variable is defined.

{% highlight sh %}
varisdefined () {
	typeset -p ${1:-} >/dev/null 2>&1
} # varisdefined
{% endhighlight %}

That I can use this way:

{% highlight sh %}
if ! varisdefined foo; then
    # die is another funcion of mine, that I use to log and exit cleanly from a script.
    die "foo is not defined" 5
fi
{% endhighlight %}

## Poorman basename

On some Posix unix, there is not yet basename, you can obtain the same result with
just a printf and a the bash strings operations.

{% highlight sh %}
_mypath="/usr/bin/bash"
printf "%s\n" "${_mypath##*/}"
{% endhighlight %}

## Poorman dirname

Same as basename...

{% highlight sh %}
_mypath="/usr/bin/bash"
printf "%s\n" "${_mypath%/*}"
{% endhighlight %}
