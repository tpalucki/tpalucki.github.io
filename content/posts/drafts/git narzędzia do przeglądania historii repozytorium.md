---
title: "Gitk"
date: 2021-04-18T19:23:59+02:00
draft: true
---

To maintain the mental repo map in my mind i can use following git tools:

>   git log --graph
Wyświetla w pokolorowanej postaci graficznej drzewko commitów dla obecnej gałęzi

>   git log --graph --all
j.w. tylko dla całego repozytorium,

>   gitk 
graficzne narzędzie do przeglądania, dla obecnej gałęzi

>   gitk --all
j.w. tylko dla całego repozytorium

>   git log --graph --full-history --all --color --pretty=format:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s"
takie narzędzie znalazłem na stackoverflow

>   git log --graph --full-history --all --pretty=format:"%h%x09%d%x20%s"
lub takie, bardzo podobne, mniej kolorów

>   git log --graph --oneline
takie jest proste do zapamiętania i szybko się piszę. Można wykorzystywać do logowania na remote machine.


TIP:    aby utworzyć alias dla wybranej komendy należy edytować plik .gitconfig:
[alias]
  gr = log --graph --full-history --all --color --pretty=tformat:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s%x20%x1b[33m(%an)%x1b[0m"