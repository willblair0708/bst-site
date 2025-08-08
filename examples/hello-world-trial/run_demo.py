#!/usr/bin/env python3
import csv
import random
import time

# Simple demo that emits a CSV and prints a short log

rows = [["step", "value"]]
acc = 0.0
for i in range(1, 11):
    acc += random.random()
    rows.append([i, round(acc, 3)])
    print(f"simulate step={i} value={rows[-1][1]}")
    time.sleep(0.02)

with open("artifact.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print("wrote artifact.csv")

