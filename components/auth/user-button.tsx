'user client'

import { Session } from 'next-auth'

export const UserButton = ({user} : Session) => {
    return (
        <div>
            <h1>Hey bitch</h1>
        </div>
    )
}