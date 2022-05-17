/*
 *
 *
 *
 */

export interface IAgentItems {
    [name: string]: IAgentItem
}

export interface IAgentItem {
    username?: string
    password?: string
    token?: string
}
