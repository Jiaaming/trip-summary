---
id: ai-assisted-system-design
title: AI Assisted System Design Interview Prep
date: 2025-10-27
tags:
  - AI
  - System Design
  - Career
category: posts
featured: true
excerpt: A calm, repeatable framework for pairing human intuition with AI tools during design interviews.
---

# AI Assisted System Design Interview Prep

Design interviews reward clarity more than cleverness. Over the last year I've been pairing a handful of AI tools with a small ritual so I can stay present in the conversation instead of juggling checklists.

## A 5-minute ritual

1. **Frame the goal.** Restate the ask in business language and confirm constraints.
2. **Pick a reference.** Choose a familiar system that rhymes with the prompt.
3. **Map the people.** Who uses it, who supports it, who observes it.
4. **Trace the data.** Identify the critical read/write paths and the failure budget.
5. **Name the risks.** Surface two trade-offs early, then refine as you go.

## Using AI without losing your taste

- Let the model critique: _“Where would this design fail?”_
- Summarize aloud: use the AI summary as the seed, then edit until it sounds like you.
- Keep a scrap pad: short prompts like `"alternatives to Kafka for fan-out under 1M QPS?"` speed up exploration.

## What to practice

- Draw fast boxes and arrows; redraw them slowly with labels.
- Speak in timelines: cold start, steady state, failure, recovery.
- Close with **what you would measure first**—it signals ownership beyond the interview.
