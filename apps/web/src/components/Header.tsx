import { ModeToggle } from "./mode-toggle";


function Header() {
  return (
<div className='flex justify-between'>
        <div>
          <h1 className='text-3xl font-mono'>Bolt.newer</h1>
        </div>
        <div>
          <ModeToggle />
        </div>

      </div>
  )
}

export default Header
