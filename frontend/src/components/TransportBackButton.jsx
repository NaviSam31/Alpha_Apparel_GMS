import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ destination = '/transport/home' }) => {
    return (
        <div className='flex'>
            <Link
                to={destination}
                className='bg-sky-800 text-white px-4 py-1 rounded-lg flex items-center justify-center hover:bg-sky-700 transition-all duration-200 w-fit'
                aria-label="Go back"
            >
                <BsArrowLeft className='text-2xl mr-2' />
                <span className='sr-only'>Back</span>
            </Link>
        </div>
    );
};

export default BackButton;
