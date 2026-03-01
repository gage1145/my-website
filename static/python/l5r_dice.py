from js import document
import asyncio
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from pyscript import display


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
    document.getElementById("pyscript-loading").textContent = None

async def make_graph(event=None):
    roll = int(document.getElementById("dice-roll").value)
    keep = int(document.getElementById("dice-keep").value)
    target = int(document.getElementById("target").value)
    data = df.loc[(df.r.astype(int) == roll) & (df.k.astype(int) == keep), "value"]
    fig, ax = plt.subplots(figsize=(16, 5))
    plt.rcParams['font.family'] = 'monospace'
    plt.tick_params(colors='#95ffaf')
    ax.hist(data, bins=50, density=True, color='#95ffaf')
    sns.kdeplot(data, fill=False, color='red')
    ax.patch.set_facecolor('none')
    fig.patch.set_facecolor('none')

    kde = ax.lines[0]
    xs, ys = kde.get_xdata(), kde.get_ydata()

    mask = xs >= target
    ax.fill_between(xs[mask], ys[mask], alpha=0.5, color='red')

    display(fig, target="fig")

async def run_estimate(event=None):
    roll = int(document.getElementById("dice-roll").value)
    keep = int(document.getElementById("dice-keep").value)
    target = int(document.getElementById("target").value)
    probabilities = estimate_probabilities(df, roll, keep, target)
    document.getElementById("empirical").textContent = f"P(Empirical): {probabilities['empirical']:.4f}"
    document.getElementById("calculated").textContent = f"P(Calculated): {probabilities['calculated']:.4f}"
    document.getElementById("fig").innerHTML = ""
    await make_graph()

await simulate_rolls()
await run_estimate()

async def roller(event=None):
    document.getElementById("pyscript-loading").textContent = None

    roll = int(document.getElementById("dice-roll").value)
    keep = int(document.getElementById("dice-keep").value)
    
    if roll < keep:
        document.getElementById("pyscript-loading").textContent = "Roll must be greater than or equal to keep."
        return
        
    rolls = [random.randint(1, 10) for _ in range(roll)]
    document.getElementById("first-roll").textContent = "Dice: "
    for roll in rolls:
        document.getElementById("first-roll").textContent += f"{roll} "
        await asyncio.sleep(0.3)
    
    rolls = sorted(rolls)

    keeps = [rolls.pop(len(rolls) - 1) for _ in range(keep)]
    document.getElementById("first-keep").textContent= "Keep: "
    for k in keeps:
        document.getElementById("first-keep").textContent += f"{k} "
        await asyncio.sleep(0.3)

    bonuses = []
    for i in keeps:
        if i != 10:
            break
        bonuses += get_rolls(1, 1)

    document.getElementById("bonuses").textContent = "Bonus: "
    for b in bonuses:
        document.getElementById("bonuses").textContent += f"{b} "
        await asyncio.sleep(0.3)

    all_dice = keeps + bonuses

    total = sum(all_dice)
    document.getElementById("total").textContent = f"Total: {total}"