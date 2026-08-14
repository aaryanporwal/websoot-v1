---
title: "So What Does a $60 Billion Acquisition Actually Mean?"
date: 2026-08-12T17:30:00+05:30
draft: false
tags:
  - "AI"
description: "I kept staring at the $60 billion Cursor number until I realised it is not a pile of cash. It is shares."
---

So for the past few days, I've been trying to understand the SpaceX / Cursor deal, mainly the $60 billion they put on Cursor.<sup>[3](#ref-3)</sup> I cannot picture that number. At all.

My brain went straight to Zomato. Could SpaceX just buy Zomato with $60 billion? I know that's a stupid question. I still think it's the right one, because I wanted to know if somebody actually paid $60 billion in cash or if this is one of those paper numbers.

## The Architecture

I went and read the [8-K SpaceX filed with the SEC on June 16, 2026](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm).<sup>[1](#ref-1)</sup> They're merging with Anysphere, that's the company behind Cursor.

Some things to note:

- SpaceX created a wholly owned subsidiary called X67
- X67 merges into Cursor
- Cursor survives, now as a wholly owned subsidiary of SpaceX
- Every outstanding Cursor common and preferred share becomes the right to receive SpaceX Class A common stock

The filing says "implied equity value" of $60 billion. It's an all-stock deal.<sup>[4](#ref-4)</sup> Expected to close in Q3 2026, assuming closing conditions and regulatory approvals. Nobody is wiring $60 billion to a bank account.

## The 100 shares thing

This is what messed with me.

Say SpaceX has 100 shares, so each share is 1% of the company. They want Cursor, they don't want to spend cash, so they create new shares and give those to Cursor's shareholders. Maybe there are 110 shares now.

Old shareholders still have their shares. Each share is just a smaller % than before.

That's dilution.

- SpaceX did not create $60 billion of cash
- They created new ownership claims on SpaceX
- Cursor's people now own a slice of future SpaceX

Also the number of shares isn't even fixed today. It's tied to SpaceX Class A, using the volume-weighted average closing price over the 7 trading days before closing. So they agreed the framework, and the exact share count waits until close.

## Public company vs private company vs buying the whole thing

If the company is public, valuation is boring:

shares × stock price = market cap.

That's the market saying all the ownership is worth X.

Private is weirder. Suppose investors buy 1% of a startup for $600 million. People will say "the company is worth $60 billion." But only 1% actually changed hands. The $60 billion is just that small deal × 100.

An acquisition is different because the buyer is taking the whole company. SpaceX is exchanging its own shares for every outstanding Cursor share. So this one is a real transaction price, not a round extrapolated from a tiny slice.

## Could you actually buy Zomato though

Yes, roughly. That's what made it click for me.

Eternal (Zomato + Blinkit) has been around a few lakh crore rupees depending on the stock price. $60 billion is about Rs 5 lakh crore at current-ish FX. So like two Eternals, give or take the market that day. A developer tool, priced like buying one of India's biggest consumer internet companies. That's why it looks insane.

## Cursor is not making $60 billion

Before the announcement, Cursor had reportedly hit about [$4 billion annualized revenue](https://www.forbes.com/sites/richardnieva/2026/06/08/cursor-4-billion-annualized-revenue/).<sup>[2](#ref-2)</sup> That's a lot for a company this young.

Annualized just means: if the current pace continued for a year, revenue would be ~$4B. It does not mean they keep $4B. You still pay compute, inference, people, sales, infra, research, support. And we don't have a clean public net profit number.

That bothered me. How do you put $60B on a company and not show ordinary investors the P&L?

Then I remembered this isn't an IPO. SpaceX shareholders don't automatically vote on every giant purchase just because it's large. The board can approve this depending on the governing documents, the share structure, and the actual rules. Outside investors get whatever securities law calls material. You don't get Cursor's entire accounting system dumped on the internet.

What you do get, because SpaceX is public: the 8-K. Merger agreement is Exhibit 10.1. Representations, closing conditions, what happens to each class of Cursor stock, how they calculate the consideration, equity awards, termination, restrictions on both sides. You can [read the contract](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm).<sup>[1](#ref-1)</sup> I didn't realise that until I opened the filing.

## Why take stock

If someone said my company was worth $60B I'd ask for cash. Cash I can use tomorrow. Stock means I'm now invested in SpaceX, which could go better or worse.

Cursor's founders and investors are betting the SpaceX shares end up worth more than whatever cash they could've taken. They don't necessarily leave with a suitcase. They become big owners of the company that bought them.

For people who already own SpaceX it's the other side. You got diluted. Was Cursor worth more than the slice you gave away? If yes, good. If Cursor just sits there, you overpaid.

Paying with stock also tells you what SpaceX thinks of its own shares. If they think the stock is expensive, paying with it is attractive. If they think it's cheap, they're giving away something they believe is underpriced.

## The part that finally clicked

I used to treat valuation like money sitting in a vault. It's more like buying a claim on cash the company might earn later.

Company makes $1B profit a year. Investors think that can become $10B. They'll pay way more than $1B today. They're not buying this year's earnings. They're buying the next decade. That's how a company is "worth" $60B without making $60B. AI just makes those next-decade assumptions pretty aggressive.

$4B annualized revenue at a $60B price is the same move. SpaceX is saying this gets a lot bigger. Could be right. Could be wildly wrong. The price is not proof the future already happened.

## SpaceX is not just rockets

I thought of SpaceX as the rocket company. That's not really true anymore.

Biggest revenue engine is Starlink. Q2 2026 they reported about $7.8B total. Connectivity (mostly Starlink) about $4.3B. Space segment about $1B. They're also building an AI business.

Starlink works because they own the stack. They build the satellites, launch them, run the constellation, and sell the internet. A normal satellite internet company is paying someone else to launch. SpaceX is the someone else.

And it's not a handful of satellites parked really far away. Thousands in low Earth orbit, so latency is a lot closer to usable than old geostationary internet, and it works where digging fibre is not happening. Not only remote houses. Businesses, governments, militaries, planes, ships.

I assumed all of this was profitable. Q2 2026 they still posted a net loss on that $7.8B. They're spending a lot on AI infra, launch systems, Starship, data centers, more satellites. You can generate billions and still lose money. Revenue is not profit. Spend can just be bigger.

## Sources

1. <span id="ref-1"></span>[SEC filing for the Cursor merger agreement](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm)
2. <span id="ref-2"></span>[Forbes on Cursor reaching $4 billion annualized revenue](https://www.forbes.com/sites/richardnieva/2026/06/08/cursor-4-billion-annualized-revenue/)
3. <span id="ref-3"></span>[TechCrunch on the $60 billion acquisition process](https://techcrunch.com/2026/04/22/how-spacex-preempted-a-2b-fundraise-with-a-60b-buyout-offer/)
4. <span id="ref-4"></span>[Forbes on the announced all-stock acquisition](https://www.forbes.com/sites/rashishrivastava/2026/06/16/spacexs-60-billion-cursor-acquisition-double-20-something-cofounders-net-worths/)
