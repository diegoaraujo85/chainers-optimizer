export function choosePoolStrategy(currentBP, bpPerHour, horizonHours, poolRate, tiers) {
    const ordered = [...tiers].sort((a, b) => a.minBP - b.minBP);
    const currentTier = [...ordered].reverse().find((tier) => currentBP >= tier.minBP) ?? null;
    const reachableBP = currentBP + bpPerHour * horizonHours;
    const targetTier = [...ordered].reverse().find((tier) => reachableBP >= tier.minBP) ?? currentTier;
    const hoursToTarget = targetTier && bpPerHour > 0 ? Math.max(0, (targetTier.minBP - currentBP) / bpPerHour) : 0;
    const submitAtHour = Math.min(horizonHours, hoursToTarget);
    const submittedBP = currentBP + bpPerHour * submitAtHour;
    const redeemableBP = targetTier ? Math.min(submittedBP, targetTier.withdrawalLimit) : submittedBP;
    const expectedRewardCFB = (redeemableBP / 1000) * poolRate.CFBper1000BP * (targetTier?.rewardMultiplier ?? 1);
    return {
        currentTier,
        targetTier,
        submitAtHour,
        expectedRewardCFB,
        reasoning: targetTier
            ? `Submit after ${submitAtHour.toFixed(1)}h to reach ${targetTier.name} while respecting its ${targetTier.withdrawalLimit} BP limit.`
            : 'No pool tier metadata was supplied; submit at the end of the planning horizon.',
    };
}
//# sourceMappingURL=pool-strategy.js.map