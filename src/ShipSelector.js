import { Orientation } from "./game/Orientation.js";
import { ShipType } from "./game/ShipType.js";

export class ShipSelector {
    /** @private @type {HTMLElement} The main container for this ship selector. */
    #selector;

    /** @private @type {HTMLButtonElement} The element that contains the grid cells. */
    #orientation;

    /** @private @type {HTMLElement} The element that contains the grid cells. */
    #ships;

    /**
     * A callback function to be executed when the orientation is changed.
     * @type {function(orientation: number): void | null}
     */
    onOrientationChanged = null;

    /**
     * A callback function to be executed when a ship is selected.
     * @type {function(orientation: number, type: number): void | null} 
     */
    onShipSelected = null;

    /**
     * Creates an instance of the ship selector.
     * Finds necessary child elements within the provided root element.
     * @param {HTMLElement} root - The root container element.
     * @throws {TypeError} If 'root' is not a valid element.
     * @throws {Error} If child elements are not found within 'root'.
     */
    constructor(root) {
        if (!root || !(root instanceof HTMLElement)) {
            throw TypeError('root must be a HTML element');
        }

        const direction = root.querySelector('.orientation button');
        const ships     = root.querySelector('.ships');

        if (!(direction instanceof HTMLButtonElement)) {
            throw Error('Orientation button not found');
        }

        if (!(ships instanceof HTMLElement)) {
            throw Error('Ships group not found');
        }

        this.#selector    = root;
        this.#orientation = direction;
        this.#ships       = ships;
    }

    /**
     * Sets up the initial ship selector structure.
     * Creates the ship buttons and registers event listeners.
     * This should typically be called once after instantiation.
     */
    setup() {
        this.#orientation.dataset.orientation = Orientation.HORIZONTAL;
        this.#orientation.addEventListener('click', event => this.#handleOrientationClick(event));

        this.#ships.appendChild(this.#createShipButton(ShipType.CARRIER));
        this.#ships.appendChild(this.#createShipButton(ShipType.BATTLESHIP));
        this.#ships.appendChild(this.#createShipButton(ShipType.DESTROYER));
        this.#ships.appendChild(this.#createShipButton(ShipType.SUBMARINE));
        this.#ships.appendChild(this.#createShipButton(ShipType.PATROLBOAT));
        this.#ships.addEventListener('click', event => this.#handleShipClick(event));
    }

    /**
     * Sets a ship button as placed (disabled).
     * @param {number} type - The type of the ship (use a value from the ShipType enum).
     */
    setAsPlaced(type) {
        for (const ship of this.#ships.children) {
            if (ship.dataset.ship != type.toString()) {
                continue;
            }

            ship.classList.add('placed');
            break;
        }
    }

    /**
     * Hides the entire display component.
     */
    hide() {
        this.#selector.classList.add('hidden');
    }

    /**
     * Shows the entire display component.
     */
    show() {
        for (const ship of this.#ships.children) {
            ship.classList.remove('placed');
            break;
        }

        this.#selector.classList.remove('hidden');
    }

    /**
     * Handles orientation button click events.
     * @private
     * @param {MouseEvent} event - The click event object.
     */
    #handleOrientationClick(event) {
        let value = parseInt(this.#orientation.dataset.orientation);
        if (!Orientation.isValid(value)) {
            console.error(`invalid orientation value, received ${value}`)
            return;
        }

        if (value == Orientation.HORIZONTAL) {
            value = Orientation.VERTICAL;
        }
        else {
            value = Orientation.HORIZONTAL;
        }

        this.#orientation.dataset.orientation = value;
        this.#orientation.textContent = Orientation.toString(value);
        this.onOrientationChanged?.(value);
    }

    /**
     * Handles the click on a ship button click.
     * @private
     * @param {MouseEvent} event - The click event object.
     */
    #handleShipClick(event) {
        const button = event.target.closest('button');
        if (!button) {
            return;
        }
        // Check if the ship is already placed.
        if (button.classList.contains('placed')) {
            return;
        }

        const type = parseInt(button.dataset.ship);
        if (!ShipType.isValid(type)) {
            console.error(`invalid ship type, received ${type}`)
            return;
        }

        const orientation = parseInt(this.#orientation.dataset.orientation);
        if (!Orientation.isValid(orientation)) {
            console.error(`invalid orientation value, received ${orientation}`)
            return;
        }

        for (const child of this.#ships.children) {
            child.classList.remove('selected');
        }
        button.classList.add('selected');

        this.onShipSelected?.(orientation, type);
    }

    #createShipButton(type) {
        const button = document.createElement('button');
        button.classList.add('button-ship', `button-${ShipType.toString(type).replaceAll(' ', '-')}`);
        button.dataset.ship = type;
        button.textContent = ShipType.toString(type);
        return button;
    }
}