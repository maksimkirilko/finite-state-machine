class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config = null) {
        if (!config) {
            throw new Error('config isn\'t passed');
        }
        this.history = [];
        this.config = config;
        this.states = Object.keys(this.config.states);
        this.prevStateIndex = -1;
        this.nextStateIndex = -1;
        this.initialize();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.states.indexOf(state) === -1) {
            throw new Error('State isn\'t exist');
        }
        this.state = state;
        const activeIndex = this.history.findIndex((item) => item.active);
        this.updateActiveStateHistory();
        this.history.push({ name: state, active: true });
        this.prevStateIndex = activeIndex;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const newState = this.config.states[this.getState()].transitions[event];
        if (!newState) {
            throw new Error('There is no state');
        }
        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = null) {
        if (!event) return this.states;
        const states = [];
        this.states.forEach((state) => {
            const events = Object.keys(this.config.states[state].transitions);
            if (events.indexOf(event) !== -1) {
                states.push(state);
            }
        });
        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        const size = this.history.length;
        const activeIndex = this.history.findIndex((item) => item.active);
        if (!size || activeIndex < 1) return false;
        this.updateActiveStateHistory();
        const prevIndex = this.prevStateIndex === -1 ? activeIndex - 1 : this.prevStateIndex;
        this.state = this.history[prevIndex].name;
        Object.assign(this.history[prevIndex], { active: true });
        this.nextStateIndex = activeIndex;
        this.prevStateIndex = -1;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        const size = this.history.length;
        const activeIndex = this.history.findIndex((item) => item.active);
        if (!size || activeIndex === size - 1) return false;
        this.updateActiveStateHistory();
        const nextIndex = this.nextStateIndex === -1 ? activeIndex + 1 : this.nextStateIndex;
        this.state = this.history[nextIndex].name;
        Object.assign(this.history[nextIndex], { active: true });
        this.prevStateIndex = activeIndex;
        this.nextStateIndex = -1;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
    }

    initialize() {
        this.reset();
    }

    updateActiveStateHistory() {
        this.history = this.history.map(item => Object.assign(item, { active: false }));
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
