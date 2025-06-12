import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link';
import { PenBox, AlignEndVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenuBox from '../user-menu';
import { checkUser } from '@/lib/checkUser';
import UserLoading from './user-loading';

const Header = async () => {
    await checkUser();
    return (
        <div className='bg-transparent'>
            <nav className='py-6 px-4 flex justify-between items-center'>
                <Link href='/'>
                    <p className='flex items-center gap-2 text-2xl font-bold'> <AlignEndVertical /> Keera </p> 
                </Link>
                <div className='flex items-center gap-4'>
                    <Link href='/project/create'>
                        <Button variant='destructive' className='cursor-pointer hover:bg-red-800'>
                            <PenBox />
                            <span> Create Project</span>
                        </Button>
                    </Link>

            <SignedOut>
                        <SignInButton>
                            <Button variant='outline' className='cursor-pointer hover:bg-gray-100'>
                                Sign In
                            </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserMenuBox />
            </SignedIn>
            </div>    
            </nav>
            <UserLoading />
        </div>
    )
};

export default Header