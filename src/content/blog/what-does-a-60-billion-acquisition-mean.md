---
title: "So What Does a $60 Billion Acquisition Actually Mean?"
date: 2026-08-12T17:30:00+05:30
draft: false
tags:
  - "AI"
description: "I read the SpaceX 8-K because I could not figure out if $60 billion was actual cash or just shares."
---

This small blog was sparked by the SpaceX Cursor deal. The number they put on Cursor is $60 billion and I cannot picture $60 billion, like at all.

I'm also gonna link the actual [SEC 8-K](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm) here because that's what I read, I didn't want to go off a tweet.<sup>[1](#ref-1)</sup>

My first thought was, could SpaceX just buy Zomato with that? I know that's a weird comparison, but Eternal (Zomato + Blinkit) is the only company of that size whose stock price I actually see on my phone. $60 billion is about Rs 5 lakh crore at current-ish rates, Eternal has been around a few lakh crore depending on the day, so like two Eternals. That's what made the number feel real to me.

And while reading about the deal I came across a weird behaviour. I thought SpaceX just wired $60 billion to Cursor. That's not what happened.

## What actually is the deal

On June 16, 2026 SpaceX filed an 8-K announcing a merger with Anysphere, that's the company behind Cursor.

Some things to note:

- SpaceX created a wholly owned subsidiary called X67
- X67 merges into Cursor
- Cursor survives as a wholly owned subsidiary of SpaceX
- Every outstanding Cursor common and preferred share is converted into the right to receive SpaceX Class A common stock

And to my absolute surprise, the filing describes this as an all-stock transaction with an "implied equity value" of $60 billion.<sup>[4](#ref-4)</sup> Expected to close in Q3 2026, subject to closing conditions and regulatory approvals.

This is a **very weird** way to "spend" $60 billion if you're expecting a suitcase of cash.

## How can they buy Cursor without $60 billion cash?

So if SpaceX has 100 shares, each share is 1% of the company.

Now they want to buy Cursor, but they don't want to spend cash. So they create new SpaceX shares and give them to Cursor's shareholders. Maybe there are 110 shares now instead of 100.

The original shareholders still own their shares, but each share is a smaller percentage of SpaceX than before. That's called dilution.

Therefore, SpaceX did not create $60 billion of cash. They created new shares. Cursor's shareholders now own a part of SpaceX. Which just doesn't work the way my brain wanted it to work, because I kept thinking a $60 billion acquisition means $60 billion sitting in a bank.

Also the exact number of shares isn't even decided today. It's tied to SpaceX's Class A share price, using the volume-weighted average closing price over the 7 trading days before closing. So they agreed the framework, and the share count waits until close.

## Public vs private vs buying the whole company

For a public company this is easy. You take the number of shares, multiply it by the stock price, that gives you market capitalization.

For a private company it's weirder. Suppose investors buy 1% of a startup for $600 million. People will then say the company is worth $60 billion. But only 1% actually changed hands. The $60 billion is just that small deal times 100.

An acquisition is different because the buyer is actually taking the whole company. SpaceX is exchanging its own shares for all outstanding Cursor shares. So this is a real transaction price, not a round extrapolated from a tiny slice.

## Cursor is not making $60 billion

Before the announcement Cursor had reportedly reached about [$4 billion in annualized revenue](https://www.forbes.com/sites/richardnieva/2026/06/08/cursor-4-billion-annualized-revenue/).<sup>[2](#ref-2)</sup> That's a lot for a company this young.

But annualized revenue is not profit. It means if the current pace continued for a year, the company would generate about $4 billion in revenue. It does not mean they keep $4 billion. From that revenue you still have to pay for compute, model inference, employees, sales, infrastructure, research, support and everything else. And we don't have a clean public number for Cursor's net profit.

That bothered me. How can somebody put a $60 billion price on a company without telling ordinary investors exactly how profitable it is?

Then I remembered this is not an IPO. SpaceX's shareholders are not necessarily voting on every acquisition just because it's large. The board can have authority to approve this depending on the company's governing documents, securities structure and applicable rules. Investors get the material information required by securities law. They don't get Cursor's entire accounting system dumped on the internet.

What we do get, because SpaceX is public now, is the 8-K. The full merger agreement is included as Exhibit 10.1. I actually opened it. Representations and warranties, closing conditions, what happens to the different classes of Cursor shares, how the consideration is calculated, equity awards, termination provisions, restrictions on both parties. You can [read the merger agreement](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm).<sup>[1](#ref-1)</sup>

## Why would Cursor take stock instead of cash

If someone told me my company was worth $60 billion I'd want cash. Cash I can use tomorrow. SpaceX stock means I'm now invested in SpaceX, which could turn out better, or worse.

Cursor's founders and investors are betting that the SpaceX shares they receive will be worth more than what they could have extracted from a cash sale. They don't necessarily walk away with a giant pile of cash. They become major owners of the company that just bought them.

For people who already own SpaceX, it's the other side of the same trade. You got diluted. Was Cursor worth more than the ownership that was given away? If Cursor becomes very valuable inside SpaceX, issuing those shares could have been a good decision. If Cursor stagnates, they overpaid.

Paying with stock also says something about SpaceX's own shares. If they think their stock is expensive, paying with it is attractive. If they think their stock is cheap, paying with it is painful.

I used to think a valuation is a pile of money sitting somewhere. It's more like an economic claim on future cash flows.

Suppose a company produces $1 billion in profit every year, and investors think it can grow that to $10 billion. They may pay far more than $1 billion for the company today. They are not buying today's earnings. They are buying the right to participate in tomorrow's earnings. That's why a company can be worth $60 billion without making $60 billion. In AI companies those future assumptions can get pretty aggressive.

A company generating $4 billion in annualized revenue being valued at $60 billion is the same thing. They're saying this business is going to become much larger. That could be correct. That could also be wildly wrong. The $60 billion price is a bet, not proof that the future already happened.

## Why is SpaceX worth so much

I thought of SpaceX as the company that launches rockets. That's not really true anymore.

Its biggest revenue engine is Starlink. In Q2 2026 SpaceX reported roughly $7.8 billion in total revenue. The connectivity segment, which is primarily Starlink, generated about $4.3 billion. The space segment generated roughly $1 billion. And they're also building an AI business.

Starlink works because SpaceX builds the satellites, launches them, operates the constellation, and sells connectivity to customers. A normal satellite internet company would have to pay someone else to launch. SpaceX is both the launch provider and the satellite operator.

Rather than putting a handful of satellites extremely far away, Starlink uses a massive constellation in low Earth orbit. Thousands of satellites are now operating. Lower latency than traditional geostationary satellite internet, and coverage in places where terrestrial broadband is weak or nonexistent. Not just people in remote houses. Businesses, governments, militaries, aviation and maritime users too.

I initially thought SpaceX makes so much money because everything is profitable. That's not necessarily true. They reported a net loss in Q2 2026 despite generating about $7.8 billion in revenue. They're spending a lot on AI infrastructure, launch systems, Starship, data centers, satellite infrastructure. You can generate billions in revenue and still lose money. Revenue is not profit.

I hope someone finds this useful.

Sources I used:

1. <span id="ref-1"></span>[SEC filing for the Cursor merger agreement](https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm)
2. <span id="ref-2"></span>[Forbes on Cursor reaching $4 billion annualized revenue](https://www.forbes.com/sites/richardnieva/2026/06/08/cursor-4-billion-annualized-revenue/)
3. <span id="ref-3"></span>[TechCrunch on the $60 billion acquisition process](https://techcrunch.com/2026/04/22/how-spacex-preempted-a-2b-fundraise-with-a-60b-buyout-offer/)
4. <span id="ref-4"></span>[Forbes on the announced all-stock acquisition](https://www.forbes.com/sites/rashishrivastava/2026/06/16/spacexs-60-billion-cursor-acquisition-double-20-something-cofounders-net-worths/)

Till next time, bye!
