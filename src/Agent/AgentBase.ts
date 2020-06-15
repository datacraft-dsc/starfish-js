/*
 *
 *
 *          Base class for all agents
 *
 *
 *
 */

import { IDDO } from '../Interfaces/IDDO'

export class AgentBase {
    public ddo: IDDO

    constructor(ddo: IDDO) {
        this.ddo = ddo
    }
}
