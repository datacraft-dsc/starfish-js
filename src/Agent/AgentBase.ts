/*
 *
 *
 *          Base class for all agents
 *
 *
 *
 */

import { IDDO } from 'starfish/Interfaces/IDDO'

export class AgentBase {
    public ddo: IDDO

    constructor(ddo: IDDO) {
        this.ddo = ddo
    }
}
