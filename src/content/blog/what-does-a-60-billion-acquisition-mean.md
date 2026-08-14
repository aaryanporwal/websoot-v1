---
title: "So What Does a $60 Billion Acquisition Actually Mean?"
date: 2026-08-12T17:30:00+05:30
draft: false
tags:
  - "AI"
description: "I kept staring at the $60 billion Cursor number until I realised it is not a pile of cash. It is shares."
---

I've been stuck on a number I cannot actually picture: $60 billion. That's the implied value of Cursor in the SpaceX acquisition.<sup>[3](#ref-3)</sup>

My first thought was stupidly simple, but it helped:

> Could SpaceX just... buy Zomato with that?

Turns out that question is a pretty good way to think about what a "valuation" even is. Because $60 billion here is not someone transferring $60 billion into Cursor's bank account. It's ownership.

## What actually happened

On June 16, 2026 SpaceX filed an [8-K with the SEC](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm) for a merger with Anysphere (the company behind Cursor).<sup>[1](#ref-1)</sup>

Some things to note:

- SpaceX made a wholly owned subsidiary called X67
- X67 merges into Cursor
- Cursor is the one that survives, now as a wholly owned subsidiary of SpaceX
- Every outstanding Cursor common and preferred share becomes the right to receive SpaceX Class A common stock

The filing calls this an "implied equity value" of $60 billion. All-stock deal.<sup>[4](#ref-4)</sup> Expected to close in Q3 2026 if the closing conditions and regulatory stuff go through.

## The 100 shares example

This is the part that felt illegal the first time I thought about it.

Say SpaceX has 100 shares. Each share is 1% of the company.

They want Cursor. They don't want to spend cash. So they create new shares and hand those to Cursor's shareholders. Now there are 110 shares. Old shareholders still have their certificates, but each one is a smaller % of SpaceX than it used to be.

That's dilution. SpaceX did not mint $60 billion of cash. They minted new claims on SpaceX. Cursor's people now own a slice of whatever SpaceX becomes.

The share count isn't even "here's $60 billion of stock, printed today." It's tied to SpaceX's Class A price, specifically the volume-weighted average closing price over the 7 trading days before closing. So the framework is agreed, the exact number of shares waits until close.

## Public vs private vs actually buying the company

For a public company this is easy: number of shares × stock price = market cap. That's the market saying "all the ownership is worth this."

Private companies are weirder. If someone buys 1% of a startup for $600 million, people go "ok so it's a $60 billion company." But nobody offered $60 billion for the other 99%. Only 1% moved. The headline number is just that small deal, times 100.

Buying the whole company is a different animal. SpaceX is swapping its own shares for *all* outstanding Cursor shares. So this one is an actual transaction price, not a round extrapolated from a tiny slice.

## Ok but could you buy Zomato

Yes, roughly, and that's what made the number stop being abstract for me.

Eternal (Zomato + Blinkit) has been hanging around a few lakh crore rupees depending on the day. $60 billion is about Rs 5 lakh crore at current-ish FX. So like... two Eternals. A developer tool, priced like buying one of India's biggest consumer internet companies outright. That's the insane part.

## Cursor is not making $60 billion

Before the announcement Cursor had reportedly hit about [$4 billion annualized revenue](https://www.forbes.com/sites/richardnieva/2026/06/08/cursor-4-billion-annualized-revenue/).<sup>[2](#ref-2)</sup> Which is wild for how young the company is.

Annualized just means: if this month's pace kept going for 12 months, you'd land around $4B. It does not mean they pocket $4B. Compute, inference, salaries, sales, infra, research, support... all of that still comes out. And there's no clean public net profit number.

That annoyed me at first. How do you put a $60B sticker on something and not show ordinary investors the P&L?

Then I remembered this isn't an IPO. SpaceX shareholders don't automatically vote on every giant purchase. The board can approve this kind of thing depending on the governing docs / share structure / the actual rules. What you get as an outside investor is whatever securities law calls "material." You do not get Cursor's entire accounting system dumped on the internet.

What you *do* get, because SpaceX is public, is the 8-K. The merger agreement is Exhibit 10.1. Representations, closing conditions, what happens to each class of Cursor stock, how they calculate the consideration, equity awards, termination, restrictions on both sides. You can literally [read the contract](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm).<sup>[1](#ref-1)</sup> I underestimated that.

## Why take stock instead of cash

If someone told me my company was worth $60B I'd want a suitcase. Cash I can use tomorrow. SpaceX stock means I'm now along for the SpaceX ride, which could be much better, or much worse.

Cursor's founders/investors are making that bet: the SpaceX shares will be worth more later than whatever cash they could've extracted today. They don't necessarily leave with a giant pile of cash. They become big owners of the thing that bought them.

For people who already own SpaceX, it's the other side of the same trade. You got diluted. Was Cursor worth more than the slice you gave up? If it is, great. If Cursor just sits there, you overpaid.

There's a second question hiding in "we paid with stock": what does SpaceX think its *own* stock is worth? If they think it's expensive, paying with it is a bargain. If they think it's cheap, they're giving away something they believe is underpriced.

## The thing that finally clicked

I used to treat valuation like a pile of money in a vault. It's more like: you're buying a claim on cash the company might earn later.

Company makes $1B a year. Investors think that can become $10B. They'll pay way more than $1B today, because they're not buying this year's profit, they're buying the next decade. That's how you get a $60B price on a company that is not making $60B. AI just makes the "next decade" assumptions pretty aggressive.

Same move as $4B annualized revenue → $60B price. The market (well, SpaceX) is saying this gets a lot bigger. Maybe! Or maybe not. The price is not proof the future already happened.

## SpaceX is not "the rocket company" anymore

I used to think of SpaceX as the company that launches rockets. That's incomplete.

Biggest revenue engine is Starlink. Q2 2026 they reported ~$7.8B total. Connectivity (mostly Starlink) ~$4.3B. Space segment ~$1B. And they're building an AI business on top of that.

Starlink works because they own the stack. They build the satellites, launch them, run the constellation, *and* sell the internet. A normal sat-internet company is paying someone else for launch. SpaceX is the someone else.

Also it's not 3 giant satellites parked really far away. It's thousands in low Earth orbit, so latency is closer to "usable" than old geostationary internet, and it works in places where digging fibre is a joke. Not just remote houses either. Businesses, governments, militaries, planes, ships.

I assumed all of this was printing money. Q2 2026 they still posted a net loss on that $7.8B. They're spending a lot of it on future stuff: AI infra, launch, Starship, data centers, more satellites. You can be generating billions and still losing money. That's just spend > revenue, not a paradox.

## Sources

1. <span id="ref-1"></span>[SEC filing for the Cursor merger agreement](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm)
2. <span id="ref-2"></span>[Forbes on Cursor reaching $4 billion annualized revenue](https://www.forbes.com/sites/richardnieva/2026/06/08/cursor-4-billion-annualized-revenue/)
3. <span id="ref-3"></span>[TechCrunch on the $60 billion acquisition process](https://techcrunch.com/2026/04/22/how-spacex-preempted-a-2b-fundraise-with-a-60b-buyout-offer/)
4. <span id="ref-4"></span>[Forbes on the announced all-stock acquisition](https://www.forbes.com/sites/rashishrivastava/2026/06/16/spacexs-60-billion-cursor-acquisition-double-20-something-cofounders-net-worths/)
