export const CART_UPDATED_EVENT = 'cart-updated';

export function emitCartUpdate() {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
