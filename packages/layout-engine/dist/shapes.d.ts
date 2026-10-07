import type { Shape } from '@chainers/shared-types';
export type ItemShape = Shape;
export declare const ITEM_SHAPES: Record<string, ItemShape>;
export declare function resolveShape(type: string, override?: Partial<Shape>): ItemShape;
//# sourceMappingURL=shapes.d.ts.map