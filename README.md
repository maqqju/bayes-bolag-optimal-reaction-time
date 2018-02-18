#Bayes Bolag Optimal Reaction Time
==================================

## Background Story

A Server and its Client start counting together at a preset interval. On every count, the Client sends a message to the Server informing it about its own count.

With every count, the Server has a level of expectation for the Client's response. The level of expectation varies with every count.

Meanwhile, the Client suffers from a network lag, which fluctuates as time goes by and potentially arriving too late to the Server's level of expectation.

In to always ping in an acceptable time, the Client's reply needs to arrive at the Server in an optimized value.

## Solution

The solution is being implemented using a Naive Bayes Network, whereby the first few iterations are taken as training data. As for the rest, the Server will keep on coming up with a ``level of expectation`` for which we need to predict - an optimized value as an answer.

## Use Cases

The use case of this experiment is to create a simple way how network lag can be compensated. We want to give the "Benefit of the lag", hence ``Bolag``. Thanks [bahmanm](https://github.com/bahmanm) for the name inspiration.

## Works in progress

The implementation is currently works in progress - and the interpretation of the Bayes Network usage needs to be refined. This is a simple experiment before I will try to apply it to a more realistic scenario.