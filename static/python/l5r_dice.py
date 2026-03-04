from js import document
import asyncio
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from pyscript import display, when


# Global variables
roll = int(document.getElementById("dice-roll").value)
keep = int(document.getElementById("dice-keep").value)
target = int(document.getElementById("target").value)

roll_elem = document.getElementById("first-roll")
keep_elem = document.getElementById("first-keep")
bonus_elem = document.getElementById("bonuses")
total_elem = document.getElementById("total")
load_elem = document.getElementById("pyscript-loading")

table_elem = document.getElementById("table-container")
tbl_button_elem = document.getElementById("prob-table-button")

empirical_elem = document.getElementById("empirical")
calculated_elem = document.getElementById("calculated")
fig_elem = document.getElementById("fig")

df = {}

# Dice rolling functions
def get_rolls(roll):
    return [random.randint(1, 10) for _ in range(roll)]

def get_keeps(rolls, keep):
    return sorted(rolls)[::-1][:keep]

def get_bonuses(keeps):
    bonuses = []
    for i in keeps:
        if i != 10: break
        bonuses += roll_dice(1, 1)
    return bonuses

def roll_dice(roll, keep):
    assert roll >= keep, "roll must be greater than or equal to keep."
    rolls = get_rolls(roll)
    keeps = get_keeps(rolls, keep)
    bonuses = get_bonuses(keeps)
    return keeps + bonuses

async def roller(event=None):
    global roll_elem
    global keep_elem
    global bonus_elem
    global total_elem
    global load_elem
    roll = int(document.getElementById("dice-roll").value)
    keep = int(document.getElementById("dice-keep").value)

    roll_elem.textContent = "Dice: "
    keep_elem.textContent= "Keep: "
    bonus_elem.textContent = "Bonus: "
    total_elem.textContent = None
    load_elem.textContent = None

    if roll < keep:
        load_elem.textContent = "Roll must be greater than or equal to keep."
        return
        
    rolls = get_rolls(roll)
    keeps = get_keeps(rolls, keep)
    bonuses = get_bonuses(keeps)
    total = sum(keeps + bonuses)

    async def show_results(iter, element):
        for i in iter:
            element.textContent += f"{i} "
            await asyncio.sleep(0.3)
    
    await show_results(rolls, roll_elem)
    await show_results(keeps, keep_elem)
    await show_results(bonuses, bonus_elem)

    total_elem.textContent = f"Total: {total}"

def estimate_probabilities(roll, keep, target):
    global df
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

async def simulate_rolls():
    global load_elem 
    global df

    iterations = 10000
    for r in range(1, 11):
        for k in range(1, r + 1):
            rolls = [sum(roll_dice(r, k)) for _ in range(iterations)]
            df.update({f"R{r}K{k}": rolls, "roll_index": range(iterations)})
            load_elem.textContent = f"Simulating R{r}K{k}"
            await asyncio.sleep(0)

    df = pd.DataFrame(df)
    df = df.melt(id_vars="roll_index", var_name="roll")

    df[["r", "k"]] = (
        df['roll']
        .str.removeprefix("R")
        .str.split("K", expand=True)
    ).astype(int)
    load_elem.textContent = None

async def make_graph(roll, keep, target, event=None):
    global df
    data = df.loc[(df.r.astype(int) == roll) & (df.k.astype(int) == keep), "value"]
    fig, ax = plt.subplots(figsize=(6, 2))
    plt.rcParams['font.family'] = 'monospace'
    plt.tick_params(colors='#95ffaf')
    plt.tight_layout()
    ax.hist(data, bins=50, density=True, color='#95ffaf', histtype='step')
    sns.kdeplot(data, fill=False, color='#ff6767')
    ax.patch.set_facecolor('none')
    fig.patch.set_facecolor('none')
    ax.set_frame_on(False)
    ax.set_ylabel("")
    ax.set_xlabel("")
    ax.set_yticks([])

    kde = ax.lines[0]
    xs, ys = kde.get_xdata(), kde.get_ydata()

    mask = xs >= target
    ax.fill_between(xs[mask], ys[mask], alpha=0.4, color='#ff6767')

    display(fig, target="fig")

async def run_estimate(roll, keep, target, event=None):
    empirical_elem = document.getElementById("empirical")
    calculated_elem = document.getElementById("calculated")
    fig_elem = document.getElementById("fig")
    
    probabilities = estimate_probabilities(roll, keep, target)
    empirical_elem.textContent = f"P(Empirical): {probabilities['empirical']:.4f}"
    calculated_elem.textContent = f"P(Calculated): {probabilities['calculated']:.4f}"
    fig_elem.innerHTML = ""
    await make_graph(roll, keep, target)

show_table = True
async def make_table(event=None):
    global show_table
    global table_elem
    global tbl_button_elem

    if show_table:
        df_sum = (
            df
            .groupby(["roll", "r", "k"])
            .agg(
                mean=("value", "mean"),
                std=("value", "std"),
                median=("value", "median"),
                var=("value", "var"),
                kurt=("value", pd.Series.kurtosis),
                skew=("value", pd.Series.skew),
            )
            .reset_index()
        )
        df_sum[["r", "k", "median"]] = df_sum[["r", "k", "median"]].astype(int)
        df_sum = df_sum.sort_values(["r", "k"])
        df_sum = df_sum.round({
            "mean": 2, "median": 0, "std": 2, "var": 1, "kurt": 2, "skew": 2
        })
        df_sum = df_sum.drop(["r", "k"], axis=1)
        table_html = df_sum.to_html(index=False)
        table_elem.innerHTML = table_html
        tbl_button_elem.textContent = "Hide Summary Table"
        show_table = False
    else:
        table_elem.innerHTML = ""
        tbl_button_elem.textContent = "Show Summary Table"
        show_table = True

await simulate_rolls()
await run_estimate(roll, keep, target)

# Event listeners
@when("change", "#dice-roll, #dice-keep, #target")
async def on_input_change(event):
    global df
    roll = int(document.getElementById("dice-roll").value)
    keep = int(document.getElementById("dice-keep").value)
    target = int(document.getElementById("target").value)
    await run_estimate(roll, keep, target)