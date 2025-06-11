export const MSG_DEPLOYMENT = 'Commander, the fleet is ready for deployment.';
export const MSG_PLACESHIP  = 'Awaiting coordinates for {0} deployment.';
export const MSG_SHIPREADY  = 'Commander, the <span class="ship confirmation">{0}</span> has been deployed and is ready for battle!';
export const MSG_SHIPERROR  = 'Commander, the <span class="ship error">{0}</span> cannot be deployed at {1}, {2}. Invalid coordinates!'
export const MSG_FLEETREADY = 'Commander, the fleet is in position.'
export const MSG_SEARCHING  = 'Commander, we are searching the waters for enemies.';
export const MSG_DETECTED   = 'Alert! Enemy detected.';
export const MSG_WAITING    = 'Waiting for firing coordinates…';
export const MSG_AIMING     = 'Adquiring target at coordinates {0}, {1}';
export const MSG_FIRE       = 'Fire!!!';
export const MSG_HIT        = 'Impact confirmed 💥💥💥!';
export const MSG_MISS       = 'Missed shot, water 🌊.'
export const MSG_ENEMYFIRE  = 'Commander! Enemy fleet is firing…';
export const MSG_HITFRIEND  = 'Our <span class="ship error">{0}</span> has been hit!';
export const MSG_SUNK       = 'Our <span class="ship error">{0}</span> has been sunk 💀!!!';

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