export const ITEM_SHAPES = {
    plot: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    waterPlot: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    animal: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    cattle: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    fuzzy: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    piggy: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    deer: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    peacock: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    otter: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    bee: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    domesticbird: { width: 1, height: 1, rotatable: false, anchor: 'bottom-left' },
    firebird: { width: 1, height: 2, rotatable: true, anchor: 'bottom-left' },
    mirrorWatcher: { width: 2, height: 2, rotatable: false, anchor: 'bottom-left' },
    phytolamp: { width: 1, height: 1, rotatable: false, anchor: 'center' },
    cropper: { width: 2, height: 2, rotatable: false, anchor: 'bottom-left' },
    decoration: { width: 1, height: 1, rotatable: true, anchor: 'center' },
};
export function resolveShape(type, override) {
    const base = ITEM_SHAPES[type] ?? ITEM_SHAPES.decoration;
    if (!base)
        throw new Error('Default item shape is not configured');
    return {
        width: override?.width ?? base.width,
        height: override?.height ?? base.height,
        rotatable: override?.rotatable ?? base.rotatable,
        anchor: override?.anchor ?? base.anchor,
    };
}
//# sourceMappingURL=shapes.js.map