import { Button } from "@/components/ui/button"

const WelcomeBanner = () => {
    return (
        <div className='bg-gradient-to-tr from-[#1FA2FF] via-[#4568DC] to-[#B06AB3] p-5 rounded-xl'>
            <h2 className='text-2xl font-bold text-white'>AI Career Coach Agent</h2>
            <p className='text-white'>Smarter career decisions start here - get tailored advice , real time market insights and more.</p>
            <Button variant={"outline"} className="mt-3">Let's Get Started</Button>
        </div>
    )
}

export default WelcomeBanner