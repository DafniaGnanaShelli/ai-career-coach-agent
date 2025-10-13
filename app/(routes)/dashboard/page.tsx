import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import AiTools from './_components/AiToolsList'
import History from './_components/History'
import AiChat from '../ai-tools/ai-qa-chat/[chatid]/page'
function Dashboard() {
    return (
        <div>
            <WelcomeBanner></WelcomeBanner>
            <AiTools></AiTools>
            <History></History>
        </div>
    )
}

export default Dashboard