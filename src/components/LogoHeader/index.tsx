import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

type LogoHeaderProps = {
    size?: 'medium' | 'large';
    hiddenText?: boolean;
}

const LogoHeader = ({ size = 'medium', hiddenText = false }: LogoHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className='cursor-pointer' onClick={() => navigate('/')}>
            <div className="flex items-center gap-2">
                <img src="/favicon.ico" alt="logo" height={size === 'large' ? 43 : 24} width={size === 'large' ? 43 : 24} />
                <div hidden={hiddenText} className={classNames("font-bold", { 'text-2xl': size === 'large', 'text-lg': size === 'medium' })}>EvaliaX</div>
            </div>
        </div>
    )
}

export default LogoHeader;