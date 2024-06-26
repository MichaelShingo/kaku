'use client';
import React, { ReactNode, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setIsModalOpen } from '@/redux/features/windowSlice';
import { COLORS } from '@/app/utils/colors';
import SaveModal from './SaveModal';
import EditCanvas from './EditCanvas';
import UploadModal from './UploadModal';

interface ModalProps {}

const Modal: React.FC<ModalProps> = () => {
	const dispatch = useDispatch();
	const isModalOpen = useAppSelector((state) => state.windowReducer.value.isModalOpen);
	const modalContent: ReactNode | null = useAppSelector(
		(state) => state.windowReducer.value.modalContent
	);
	const [isXHovered, setIsXHovered] = useState<boolean>(false);

	const generateModalContent = () => {
		switch (modalContent) {
			case 'Save':
				return <SaveModal />;
			case 'Edit Canvas':
				return <EditCanvas />;
			case 'Upload':
				return <UploadModal />;
			default:
				return <></>;
		}
	};

	return (
		<div
			className="fixed z-50 flex h-screen w-screen items-center justify-center bg-off-black-trans transition-all"
			style={{
				opacity: isModalOpen ? '100%' : '0%',
				pointerEvents: isModalOpen ? 'all' : 'none',
			}}
			onClick={() => dispatch(setIsModalOpen(false))}
		>
			<div
				className="fixed z-50 h-fit min-h-52 w-fit min-w-[300px] border-[4px] border-light-pink bg-off-white px-4 pb-5 transition-all"
				style={{
					transform: isModalOpen ? 'scale(100%)' : 'scale(50%)',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex w-full justify-end">
					<button
						className="mt-1 translate-x-3 px-2 py-1 transition-all hover:bg-light-pink"
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
				<h2 className="pointer-events-none h-fit w-full -translate-y-7 text-center text-4xl">
					{modalContent}
				</h2>
				{generateModalContent()}
			</div>
		</div>
	);
};

export default Modal;
