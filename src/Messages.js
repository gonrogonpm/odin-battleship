export const MSG_FLEETREADY = 'Commander the fleet is in position.'
export const MSG_SEARCHING  = 'Commander we are searching the waters for enemies.';
export const MSG_DETECTED   = 'Alert! Enemy detected.';
export const MSG_WAITING    = 'Waiting for firing coordinates…';
export const MSG_AIMING     = 'Adquiring target at coordinates {0}, {1}';
export const MSG_FIRE       = 'Fire!!!';
export const MSG_HIT        = 'Impact confirmed!';
export const MSG_MISS       = 'Missed shot, water.'
export const MSG_ENEMYFIRE  = 'Commander! Enemy fleet is firing…';
export const MSG_HITFRIEND  = 'Our "{0}" has been hit!';
export const MSG_SUNK       = 'Our "{0}" has been sunk!!!';

/**
 * Replaces the paramters in the message with the passed values.
 * @param {string} msg 
 * @return {string} Message with the parameters replaced with the values.
 */
export function replace(msg) {
    return msg.replaceAll(/\{(\d)\}/g, (match, p1) => {
        const index = parseInt(p1);
        if (isNaN(index) || index + 1 >= arguments.length) {
            return match;
        }

        return String(arguments[index + 1]);
    });
}