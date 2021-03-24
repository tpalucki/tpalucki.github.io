---
title: "How this blog is built"
date: 2020-05-10T13:52:37+02:00
draft: true
---

I haven't had any experience in building a blog yet but as an engineer I had some vision and principles I wanted to follow. 
Some of them:

- Simplicity and minimalism
- Readability
- Ease of configuration
- Themes available - because I want to deliver fast to stay in the fun zone
- Possibility to extend later

The easiest way would be to setup blog on a Wordpress powered hosting  but it doesn't sound like fun to me ;)
I've done some research and found out that static site generator would be the perfect solution here. Light, simple configuration, fast delivery and huge field for modifications - sounds perfect to me!

A moment of googling and I found several of-the-shelve solutions, where Jekyll and Hugo seemed to be the most popular.
Finally I have picked Hugo due to simple configuration, nice docs and support - and here it is!

I also needed a theme so I went through https://themes.gohugo.io/ and picked [Lekh](https://themes.gohugo.io/lekh/). Lekh is clean, readable, responsive and minimalistic with dark mode - pretty all I wanted for the beginning.
I think I will fork it later and extend it somehow - I have already done some customizations due to problems with newer Hugo version I use.

## Google Analytics update

I thought it would be nice to have traffic analysis for my page to see what is going on. To achieve that I registered and generated proper tags through Google Analytics service and created Hugo Partial providing these tags to the Lekh theme. I think it could be built in into the theme itself so I have idea and working solution for my fork.

There is also [a very nice guide](https://bash-prompt.net/guides/custom-html-jugo/) on how to add Google Analytics to your Hugo based page.
