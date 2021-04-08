<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [Incident Log](#incident-log)
  - [Fixed: (28th July 2020 - 12th August 2020) Incident 1: Searches and Users not working because of Jikan getting reCAPTCHAs](#fixed-28th-july-2020---12th-august-2020-incident-1-searches-and-users-not-working-because-of-jikan-getting-recaptchas)
    - [I'm seeing some error codes on Mirai. What's that about?](#im-seeing-some-error-codes-on-mirai-whats-that-about)
    - [Wait, why don't you just use MAL's official API? Surely that would be better?](#wait-why-dont-you-just-use-mals-official-api-surely-that-would-be-better)
    - [TL,DR; What does this mean for Mirai?](#tldr-what-does-this-mean-for-mirai)
    - [Fixed](#fixed)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Incident Log

This is where I will try my best to log all of the incidents of Mirai, such as downtimes and maintenance. It will be accessible from the [GitHub repo](https://github.com/Jabster28/mirai/blob/master/INCIDENTS.md#incident-log) and the official. The incidents will be listed chronologically with newer ones closest to the top and later ones further down. All incidents will have a TL,DR; (a summary) if you want a simple rundown on what has happened.

## Fixed: (28th July 2020 - 12th August 2020) Incident 1: Searches and Users not working because of Jikan getting reCAPTCHAs

### I'm seeing some error codes on Mirai. What's that about?

[Jikan](https://jikan.moe) (the API that Mirai uses for getting the data from MyAnimeList) is currently returning 403s for some endpoints, because the way it gets it's data comes from directly asking MAL's servers, and MAL has started sending reCAPTCHAs to some requests. As Jikan is a public API, there's not much they can do aside from using locally cached data for now (that's why some searches work in Mirai still and animes too), and waiting for an official response from MAL.

### Wait, why don't you just use MAL's official API? Surely that would be better?

In theory it would, but MyAnimeList's DNS goes down very frequently compared to Jikan's ~100% uptime. Plus, Jikan seems to care more about developers' experience than MAL which is why I originally opted to use them. Their API has also been around for longer.

### TL,DR; What does this mean for Mirai?

We'll have to wait and see - for now, some of Mirai's pages (users, user search, anime lists etc.) won't work, so I'll have a quick explanation there, but otherwise I'll just have to see what happens. If Jikan resolves this somehow, everything should be fine. If that's not the case, I'll have to rewrite all of the API requests using MAL's API. Which means that Mirai won't function if MAL is down, and that's why I'm hoping MAL can sort something out with the people behind Jikan.

But for now, you'll have to use MAL's website (if it's even up when you're reading this :P) and wait for them to say something about the problem. If you want to keep up with their progress, you can join Jikan's [Discord Server](http://discord.jikan.moe) and keep an eye on the **#status** channel.

### Fixed

Jikan has talked to MAL about this, and they have come to some sort of conclusion which means it will continue working for the foreseeable future.
