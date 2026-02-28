from js import document
import asyncio
import random
import pandas as pd
import numpy as np
from scipy import stats


def roll_dice(roll):
    return sorted([random.randint(1, 10) for _ in range(roll)])

def keep_dice(rolls, keep):
    return [rolls.pop(len(rolls) - 1) for _ in range(keep)]

def get_rolls(roll, keep):
    if roll < keep:
        raise ValueError("roll must be greater than keep.")
        
    rolls = sorted([random.randint(1, 10) for _ in range(roll)])
    keeps = [rolls.pop(len(rolls) - 1) for _ in range(keep)]
    for i in keeps:
        if i != 10:
            break
        keeps += get_rolls(1, 1)
    return keeps

def roll_total(roll, keep):
    return sum(get_rolls(roll, keep))

# Estimate probabilities of rolling at least a target number for each roll and keep combination
def estimate_probabilities(df, roll, keep, target):
    ys = stats.gaussian_kde(
        df.loc[(df.r.astype(int) == roll) & (df.k.astype(int) == keep), "value"]
    )
    xs = np.arange(roll, roll * 10 + 1)
    ys_values = ys(xs)
    mask = xs >= target
    calculated = np.trapezoid(ys_values[mask], xs[mask])
    data = df.loc[(df.r.astype(int) == roll) & (df.k.astype(int) == keep), "value"]
    empirical = (data >= target).mean()
    return {"empirical": empirical, "calculated": calculated}

# Make a dataframe of rolls for R1K1 through R10K10
df = {}
async def simulate_rolls():
    iterations = 10000
    global df
    for r in range(1, 11):
        for k in range(1, r + 1):
            rolls = [roll_total(r, k) for _ in range(iterations)]
            df.update({f"R{r}K{k}": rolls, "roll_index": range(iterations)})
            document.getElementById("pyscript-loading").textContent = f"Simulating R{r}K{k}..."
            await asyncio.sleep(0)
    print(df)
    df = pd.DataFrame(df)
    df = df.melt(id_vars="roll_index", var_name="roll")

    df[["r", "k"]] = (
        df['roll']
        .str.removeprefix("R")
        .str.split("K", expand=True)
    )
    document.getElementById("pyscript-loading").textContent = "Finished simulating rolls. Ready to roll!"

await simulate_rolls()

async def run_estimate(event=None):
    roll = int(document.getElementById("rolls").value)
    keep = int(document.getElementById("keeps").value)
    target = int(document.getElementById("target").value)
    probabilities = estimate_probabilities(df, roll, keep, target)
    document.getElementById("empirical").textContent = f"P(Empirical): {probabilities['empirical']:.4f}"
    document.getElementById("calculated").textContent = f"P(Calculated): {probabilities['calculated']:.4f}"

async def roller(event=None):
    roll = int(document.getElementById("dice-roll").value)
    keep = int(document.getElementById("dice-keep").value)
    
    if roll < keep:
        raise ValueError("roll must be greater than keep.")
        
    rolls = sorted([random.randint(1, 10) for _ in range(roll)])
    document.getElementById("first-roll").textContent = f"Dice: {rolls}"

    keeps = [rolls.pop(len(rolls) - 1) for _ in range(keep)]
    document.getElementById("first-keep").textContent = f"Kept: {keeps}"

    bonuses = []
    for i in keeps:
        if i != 10:
            break
        bonuses += get_rolls(1, 1)

    document.getElementById("bonuses").textContent = f"Bonuses: {bonuses}"

    all_dice = keeps + bonuses
    document.getElementById("all-dice").textContent = f"All Dice: {all_dice}"

    total = sum(all_dice)
    document.getElementById("total").textContent = f" Total: {total}"