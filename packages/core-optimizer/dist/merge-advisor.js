function copies(item, count) {
    return Array.from({ length: count }, (_, index) => ({ ...item, id: `${item.id}#${index + 1}` }));
}
export function analyzeMerges(context) {
    const rules = context.mergeRules ?? [];
    const optimal = new Set(context.optimalItemIds ?? []);
    const recommendations = [];
    const covered = new Set();
    for (const rule of rules) {
        const entry = context.inventory.entries.find(({ item }) => item.id === rule.fromItemId);
        if (!entry || entry.count < rule.fromCount)
            continue;
        covered.add(entry.item.id);
        const slotGain = context.freedSlotValueBPPerHour ?? 0;
        const bpGainPerHour = rule.outputBPPerHour - rule.inputBPPerHour + slotGain;
        const cfbGainPerHour = (context.poolRate.CFBper1000BP * Math.max(0, bpGainPerHour)) / 1000;
        const paybackHours = cfbGainPerHour > 0 ? rule.costCFB / cfbGainPerHour : Number.POSITIVE_INFINITY;
        const threshold = context.timeHorizonHours * 0.3;
        if (rule.costCFB <= context.cfbBalance && paybackHours < threshold) {
            recommendations.push({
                action: 'merge',
                from: copies(entry.item, rule.fromCount),
                to: rule.toItem,
                costCFB: rule.costCFB,
                bpGainPerHour,
                paybackHours,
                reasoning: `Merge pays back in ${paybackHours.toFixed(1)}h, below the ${threshold.toFixed(1)}h threshold${slotGain > 0 ? ` and frees a slot worth ${slotGain.toFixed(1)} BP/h` : ''}.`,
            });
        }
        else {
            recommendations.push({
                action: 'keep',
                item: entry.item,
                reasoning: rule.costCFB > context.cfbBalance
                    ? `Keep: merge costs ${rule.costCFB} CFB but only ${context.cfbBalance} CFB is available.`
                    : `Keep: ${Number.isFinite(paybackHours) ? `${paybackHours.toFixed(1)}h payback` : 'no positive BP gain'} exceeds the ${threshold.toFixed(1)}h threshold.`,
            });
        }
    }
    for (const entry of context.inventory.entries) {
        if (covered.has(entry.item.id))
            continue;
        if (!optimal.has(entry.item.id) && (entry.inUse ?? 0) === 0 && entry.estimatedPoolBP !== undefined) {
            recommendations.push({
                action: 'sell',
                item: entry.item,
                expectedPoolBP: entry.estimatedPoolBP * entry.count,
                reasoning: 'Sell: item is not used by the optimal slot or layout plan.',
            });
        }
        else {
            recommendations.push({
                action: 'keep',
                item: entry.item,
                reasoning: optimal.has(entry.item.id)
                    ? 'Keep: item contributes to the optimal production plan.'
                    : 'Keep: no verified merge or sale advantage is available.',
            });
        }
    }
    return recommendations;
}
//# sourceMappingURL=merge-advisor.js.map