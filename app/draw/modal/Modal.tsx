'use client';
import React, { ReactNode, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setIsModalOpen } from '@/redux/features/windowSlice';
import { COLORS } from '@/app/utils/colors';

interface ModalProps {}

const Modal: React.FC<ModalProps> = () => {
	const dispatch = useDispatch();
	const isModalOpen = useAppSelector((state) => state.windowReducer.value.isModalOpen);
	const modalContents: ReactNode | null = useAppSelector(
		(state) => state.windowReducer.value.modalContents
	);
	const [isXHovered, setIsXHovered] = useState<boolean>(false);

	return (
		<div
			className="fixed z-50 flex h-screen w-screen items-center justify-center bg-off-black-trans transition-all"
			style={{
				opacity: isModalOpen ? '100%' : '0%',
				pointerEvents: isModalOpen ? 'all' : 'none',
			}}
		>
			<div
				className="fixed z-50 h-fit min-h-52 w-fit min-w-[40%] border-[4px] border-light-pink bg-off-white transition-all"
				style={{
					transform: isModalOpen ? 'scale(100%)' : 'scale(50%)',
				}}
			>
				<div className="flex w-full justify-end">
					<button
						className="m-1 px-2 py-1 transition-all hover:bg-light-pink"
						onClick={() => dispatch(setIsModalOpen(false))}
						onMouseEnter={() => setIsXHovered(true)}
						onMouseLeave={() => setIsXHovered(false)}
					>
						<FontAwesomeIcon
							icon={faX}
							size="lg"
							color={isXHovered ? COLORS['off-white'] : COLORS['off-black']}
							style={{ transition: '0.05' }}
						/>
					</button>
				</div>
				{modalContents}
			</div>
		</div>
	);
};

export default Modal;
