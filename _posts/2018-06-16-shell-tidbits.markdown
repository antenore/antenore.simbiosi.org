---
title: "Shell tidbits"
layout: post
date: 2016-02-24 22:48
image: /assets/images/markdown.jpg
image: /assets/images/shell-symbolic.svg
headerImage: true
tag:
- shell
- unix
category: blog
author: antenore
description: "Less unknown shell tricks"
externalLink: false
---

## Summary:

This is the first of a long (maybe) series of blog posts with some less known shell
features. Unless otherwise specified, bash is the shell of reference.

#### Index
- [Variable is defined](#variable-is-defined)
- [Poorman basename](#poorman-basename)
- [Poorman dirname](#poorman-dirname)
- [Poorman encryption](#poorman-encryption)

## Variable is defined

One less unknown way to do it, instead of using
{% highlight sh %}
[ -f "$VARNAME" ]
{% endhighlight %}

is to use typeset.

{% highlight sh %}
typeset -p VARNAME
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

## Poorman encryption

Calling this encryption is a bit unpolite, but let's do it, we don't care right?

From wikipedia:

    ROT13 ("rotate by 13 places", sometimes hyphenated ROT-13) is a simple letter substitution cipher that replaces a letter with the 13th letter after it, in the alphabet.

I use this, sometimes, just to make things a bit arcane for those n00bs not looking
enough far.

To ROT13 a string

{% highlight sh %}
rot13 () {
	[[ $# -eq 0 ]] && return
	# TODO: Add input validation and sanitizing ([:alnum:] [:space:])
	local _input_text
	local _rot13_text

	_input_text="$*"
	_rot13_text="$($TR a-zA-Z n-za-mN-ZA-M <<<"$_input_text")"

	printf "%s" "$_rot13_text"
}	# ----------  end of function rot13  ----------
{% endhighlight %}

The way back to unROT13 it's to use again the same function


