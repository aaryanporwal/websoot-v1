---
title: "No Collision Guarantee 🔒"
date: 2022-01-28T17:49:17+05:30
draft: false
tags:
  - "Problem-Solving"
  - "System-Design"
---

# Designing No Collision Guarantee System.

So for the past few days, I've been trying to build a _distributed highly scalable, no collision guaranteed URL shortening service_.

## The Architecture

So if you pass in a long url called `https://longurl.com`, the backend will send you a short url that would be unique to each request, and the structure of the url would look something like: `https://shorturl.com/[slug]`.

The slug is our main component, it should always be unique.

Some things to note:

- The length of the slug depends on how many entries will there be.
- So for 5 digit alphanumeric (also called Base-62) slug:

  Possible combinations: 26 (small alphabets) + 26 (capital alphabets) + 10 (numbers) => 62.

  So, for 5 digit base62 -> 62^5 ~about 900 million possibilities.

## What choices do we have to ensure uniqueness of the slug?

- Random slug

  -> This can be any random alphanumeric characters.

  -> The problem here is that for a request, there can be two same random characters, which will eventually result in collisions.

- Using MD5

  -> Collisions are possible here as well (although very rare, but we want no collision guarantee).

- Time Stamp

  -> You can store time stamp of every request and encode it with base62, but this still can result in collisions.

  -> Just to give an example, if you generate 10 ids a second with a granularity of milliseconds, the probability of a collision is 1 in 23. On average, you'll have a collision every 23 seconds. But it's worse than that. The assumption in this math is that every possible birthday is equally likely. That's not true for birthdays, more people on born in the spring. It's also not going to be true for your timestamps. You are going to get much heavier on certain times of the day than others <sup>[1](https://softwareengineering.stackexchange.com/questions/305904/how-likely-are-collisions-of-timestamp-based-identifiers)</sup>.

- UUIDs

  -> UUID is part of the Distributed Computing Environment (DCE), standardized by the Open Software Foundation (OSF).

  -> How UUID is made:
  ![UUID architecture](https://i.stack.imgur.com/goiPw.png)

  -> Also check out this amazing blog about collisions in UUIDs [here](https://www.scaleyourapp.com/uuid-guid-oversimplified-are-they-really-unique/).

- Using a <u>**Counter**</u>

  -> Counters are the only thing that can **guarantee** no collisions. This is true if we only use a single database, which is bad for scaling. For multiple distributed database, we again have a problem!

# The problem with counter

For a no collision guarantee URL shortening system (single database), our unique id i.e our slug will be a counter.

For example:

- our first slug will be: 10000 => (2bI)<sub>base62</sub>
- second: 10001
- third: 10002 and so on.

Now the problem is when we want to horizontally scale and talk with multiple databases.

The different approaches with multi database counter will look like:

- One counter for all databases

  -> This will ensure atomicity, but will slow down response time

- Different counter for different databases

  -> This approach will be faster, but the problem is how will we ensure that there are no collisions between two different counters?

## Problem with counter synchronization

The problem with counter synchronization is that there can be two counters with same value.

Here comes our [Apache zookeeper](https://zookeeper.apache.org/).

What zookeeper would do is assign different counter ranges to different databases or servers.

For example:

- DB<sub>1</sub> is assigned counter range from 10000 to 20000
- DB<sub>2</sub> is assigned counter range from 20001 to 30000
- DB<sub>3</sub> is assigned counter range from 30001 to 40000
- DB<sub>4</sub> is assigned counter range from 40001 to 50000 and so on.

And zookeeper will also keep track of the counter usage so that it if a database exceeds the range, it is assigned a new range.

In conclusion, for our distributed no collision guaranteed url shortening service, we can use counters to guarantee no collisions and use apache zookeeper to synchronize the counters across databases.

P.S this article is still in development...
